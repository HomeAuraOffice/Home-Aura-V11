// ==============================================================================
// HOMEAURA MULTI-USER OPTIMAL SYNC SCRIPT (VERSION 4.0)
// High-Performance Bidirectional Delta Sync with Last-Write-Wins (LWW)
// ==============================================================================

/**
 * Handles incoming GET requests from all client devices (pull sync)
 */
function doGet(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (lockErr) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'busy',
      error: 'Server is processing another update. Please retry in a moment.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var rawCategories = sheetToObjects("categories");
    var categories = rawCategories.map(function(c) {
      if (typeof c === 'object' && c !== null) {
        return c.name || Object.values(c).join('');
      }
      return String(c);
    });

    var data = {
      status: 'success',
      serverTimestamp: new Date().toISOString(),
      users: sheetToObjects("users"),
      orders: sheetToObjects("orders"),
      deletedOrders: sheetToObjects("deletedOrders"),
      categories: categories,
      factories: sheetToObjects("factories"),
      factoryBills: sheetToObjects("factoryBills"),
      expenses: sheetToObjects("expenses"),
      settings: sheetToObjects("settings")
    };

    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * Handles incoming POST requests (delta pushes, image uploads, full syncs)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (lockErr) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'busy',
      error: 'Database lock timeout. Concurrent push in progress, queued for next retry.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var payloadObj;
    try {
      payloadObj = JSON.parse(e.postData.contents);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        error: 'Invalid JSON body: ' + err.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Connection diagnostic ping
    if (payloadObj._connectionTest) {
      objectsToSheetAtomic("connectionTest", payloadObj._connectionTest);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Connection verified successfully.',
        serverTimestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Google Drive image upload handler
    if (payloadObj.action === 'upload_image' && payloadObj.base64) {
      var uploadResult = handleDriveImageUpload(payloadObj.filename || 'attachment.jpg', payloadObj.base64);
      return ContentService.createTextOutput(JSON.stringify(uploadResult))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var stats = { updatedRecords: 0, deletedRecords: 0 };

    // 3. High-Performance Delta Mode (Push only changed records)
    if (payloadObj.action === 'sync_delta' || payloadObj.delta === true) {
      var changes = payloadObj.changes || {};
      var deletes = payloadObj.deletes || {};

      // Process incremental modifications with Last-Write-Wins (LWW)
      if (changes.users && changes.users.length) {
        stats.updatedRecords += mergeObjectsByIdLWW("users", changes.users);
      }
      if (changes.orders && changes.orders.length) {
        stats.updatedRecords += mergeObjectsByIdLWW("orders", changes.orders);
      }
      if (changes.deletedOrders && changes.deletedOrders.length) {
        stats.updatedRecords += mergeObjectsByIdLWW("deletedOrders", changes.deletedOrders);
      }
      if (changes.factories && changes.factories.length) {
        stats.updatedRecords += mergeObjectsByIdLWW("factories", changes.factories);
      }
      if (changes.factoryBills && changes.factoryBills.length) {
        stats.updatedRecords += mergeObjectsByIdLWW("factoryBills", changes.factoryBills);
      }
      if (changes.expenses && changes.expenses.length) {
        stats.updatedRecords += mergeObjectsByIdLWW("expenses", changes.expenses);
      }
      if (changes.settings && changes.settings.length) {
        stats.updatedRecords += mergeObjectsByIdLWW("settings", changes.settings);
      }

      // Process categories if updated
      if (changes.categories && Array.isArray(changes.categories)) {
        var catObjs = changes.categories.map(function(c) {
          return { name: typeof c === 'object' && c !== null ? (c.name || Object.values(c).join('')) : String(c) };
        });
        objectsToSheetAtomic("categories", catObjs);
        stats.updatedRecords += catObjs.length;
      }

      // Process deletions
      Object.keys(deletes).forEach(function(sheetName) {
        var idsToDelete = deletes[sheetName];
        if (idsToDelete && idsToDelete.length > 0) {
          stats.deletedRecords += deleteObjectsById(sheetName, idsToDelete);
        }
      });

      logHistory(payloadObj, stats);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        mode: 'delta',
        stats: stats,
        serverTimestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. Legacy / Full Snapshot Mode (Atomic Merge)
    if (payloadObj.users) stats.updatedRecords += mergeObjectsByIdLWW("users", payloadObj.users);
    if (payloadObj.orders) stats.updatedRecords += mergeObjectsByIdLWW("orders", payloadObj.orders);
    if (payloadObj.deletedOrders) stats.updatedRecords += mergeObjectsByIdLWW("deletedOrders", payloadObj.deletedOrders);
    if (payloadObj.factories) stats.updatedRecords += mergeObjectsByIdLWW("factories", payloadObj.factories);
    if (payloadObj.factoryBills) stats.updatedRecords += mergeObjectsByIdLWW("factoryBills", payloadObj.factoryBills);
    if (payloadObj.expenses) stats.updatedRecords += mergeObjectsByIdLWW("expenses", payloadObj.expenses);
    if (payloadObj.settings) stats.updatedRecords += mergeObjectsByIdLWW("settings", payloadObj.settings);

    if (payloadObj.pendingDeletes) {
      Object.keys(payloadObj.pendingDeletes).forEach(function(sheetName) {
        var idsToDelete = payloadObj.pendingDeletes[sheetName];
        if (idsToDelete && idsToDelete.length > 0) {
          stats.deletedRecords += deleteObjectsById(sheetName, idsToDelete);
        }
      });
    }

    if (payloadObj.categories && Array.isArray(payloadObj.categories)) {
      var catObjs2 = payloadObj.categories.map(function(c) {
        return { name: typeof c === 'object' && c !== null ? (c.name || Object.values(c).join('')) : String(c) };
      });
      objectsToSheetAtomic("categories", catObjs2);
    }

    logHistory(payloadObj, stats);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      mode: 'full',
      stats: stats,
      serverTimestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

// ------------------------------------------------------------------------------
// CORE DATA ENGINE & MULTI-USER MERGE UTILITIES
// ------------------------------------------------------------------------------

/**
 * Smart Last-Write-Wins (LWW) merge keyed by item ID and updatedAt timestamp
 */
function mergeObjectsByIdLWW(sheetName, incomingObjects) {
  if (!incomingObjects || incomingObjects.length === 0) return 0;
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);

  var existingObjects = sheetToObjects(sheetName);
  var map = {};
  var order = [];

  // 1. Index existing objects
  existingObjects.forEach(function(obj) {
    if (obj && obj.id !== undefined && obj.id !== '') {
      var key = String(obj.id);
      map[key] = obj;
      order.push(key);
    }
  });

  var updatedCount = 0;

  // 2. Merge incoming objects using Last-Write-Wins timestamp comparison
  incomingObjects.forEach(function(incObj) {
    if (!incObj || incObj.id === undefined || incObj.id === '') return;
    var key = String(incObj.id);
    var existing = map[key];

    if (!existing) {
      // New record
      map[key] = incObj;
      order.push(key);
      updatedCount++;
    } else {
      // Compare timestamps
      var incTime = incObj.updatedAt ? new Date(incObj.updatedAt).getTime() : 0;
      var extTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;

      if (incTime >= extTime || !extTime) {
        // Incoming is newer or equal -> update fields cleanly
        map[key] = Object.assign({}, existing, incObj);
        updatedCount++;
      }
    }
  });

  // 3. Reconstruct ordered list
  var merged = order.map(function(key) {
    return map[key];
  });

  objectsToSheetAtomic(sheetName, merged);
  return updatedCount;
}

/**
 * Deletes objects matching specified IDs from a sheet
 */
function deleteObjectsById(sheetName, idsToDelete) {
  if (!idsToDelete || idsToDelete.length === 0) return 0;
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return 0;

  var existingObjects = sheetToObjects(sheetName);
  var idMap = {};
  idsToDelete.forEach(function(id) { idMap[String(id)] = true; });

  var keptObjects = [];
  var deleteCount = 0;

  existingObjects.forEach(function(obj) {
    if (obj && obj.id !== undefined && idMap[String(obj.id)]) {
      deleteCount++;
    } else {
      keptObjects.push(obj);
    }
  });

  if (deleteCount > 0) {
    objectsToSheetAtomic(sheetName, keptObjects);
  }

  return deleteCount;
}

/**
 * Reads a sheet and parses it into an array of JavaScript objects
 */
function sheetToObjects(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0];
  var result = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var isEmpty = row.every(function(cell) { return cell === '' || cell === null; });
    if (isEmpty) continue;

    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var header = String(headers[j]).trim();
      if (header) {
        var cellVal = row[j];
        // Parse JSON strings for arrays/objects (e.g. linkedOrderIds)
        if (typeof cellVal === 'string' && (cellVal.startsWith('[') || cellVal.startsWith('{'))) {
          try {
            cellVal = JSON.parse(cellVal);
          } catch (e) {}
        }
        obj[header] = cellVal;
      }
    }
    result.push(obj);
  }
  return result;
}

/**
 * Atomically replaces the contents of a sheet with an array of objects
 */
function objectsToSheetAtomic(sheetName, objects) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);

  if (!objects || objects.length === 0) {
    sheet.clearContents();
    return;
  }

  // Collect all unique headers across all objects
  var headersMap = {};
  objects.forEach(function(obj) {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(function(key) {
        headersMap[key] = true;
      });
    }
  });

  var headers = Object.keys(headersMap);
  if (headers.length === 0) return;

  var rows = [headers];
  objects.forEach(function(obj) {
    var row = [];
    headers.forEach(function(header) {
      var val = obj ? obj[header] : '';
      if (val === undefined || val === null) {
        val = '';
      } else if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      row.push(val);
    });
    rows.push(row);
  });

  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
}

/**
 * Saves uploaded images (base64) to Google Drive and returns direct URL
 */
function handleDriveImageUpload(filename, base64Data) {
  try {
    var cleanBase64 = base64Data;
    var contentType = "image/jpeg";

    if (cleanBase64.indexOf(",") > -1) {
      var parts = cleanBase64.split(",");
      var mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) contentType = mimeMatch[1];
      cleanBase64 = parts[1];
    }

    var decodedBlob = Utilities.newBlob(Utilities.base64Decode(cleanBase64), contentType, filename);

    // Create or locate HomeAura folder
    var folderName = "HomeAura_Order_Attachments";
    var folders = DriveApp.getFoldersByName(folderName);
    var targetFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

    var file = targetFolder.createFile(decodedBlob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var directUrl = "https://drive.google.com/uc?export=view&id=" + file.getId();

    return {
      status: 'success',
      url: directUrl,
      fileId: file.getId(),
      filename: filename
    };
  } catch (err) {
    return {
      status: 'error',
      error: 'Drive upload error: ' + err.toString()
    };
  }
}

/**
 * Records an audit log of sync transactions
 */
function logHistory(payload, stats) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var historySheet = ss.getSheetByName("History_Log");
    if (!historySheet) {
      historySheet = ss.insertSheet("History_Log");
      historySheet.appendRow(["Timestamp", "Action/Mode", "Updated", "Deleted", "Sender"]);
    }

    var sender = payload.sender || "app_client";
    var mode = payload.delta ? "delta" : (payload.action || "full");
    var updated = (stats && stats.updatedRecords) || 0;
    var deleted = (stats && stats.deletedRecords) || 0;

    historySheet.appendRow([
      new Date().toISOString(),
      mode,
      updated,
      deleted,
      sender
    ]);

    // Keep log to at most 1000 rows
    if (historySheet.getLastRow() > 1000) {
      historySheet.deleteRows(2, 200);
    }
  } catch (e) {}
}
