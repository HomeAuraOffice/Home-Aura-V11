const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const targetFunction = `function distributeOrdersBySeller() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var orders = sheetToObjects("orders");
  var users = sheetToObjects("users");
  
  var idToUsername = {};
  var allUsernames = {};
  users.forEach(function(u) {
    if (u && u.id && u.username) {
      idToUsername[u.id] = u.username;
      allUsernames[u.username] = true;
    }
  });
  
  var sellerOrders = {};
  Object.keys(allUsernames).forEach(function(username) {
    sellerOrders[username] = [];
  });
  
  orders.forEach(function(o) {
    if (o && o.merchantId) {
      var username = idToUsername[o.merchantId] || String(o.merchantId);
      if (!sellerOrders[username]) sellerOrders[username] = [];
      sellerOrders[username].push(o);
    }
  });
  
  Object.keys(sellerOrders).forEach(function(username) {
    var sheetName = "Orders_" + username;
    var userOrders = sellerOrders[username];
    objectsToSheetAtomic(sheetName, userOrders);
  });
}`;

const replaceFunction = `function distributeOrdersBySeller() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var orders = sheetToObjects("orders");
  var users = sheetToObjects("users");
  
  var idToUsername = {};
  var validSellerUsernames = {};
  
  users.forEach(function(u) {
    if (u && u.id && u.username) {
      idToUsername[u.id] = u.username;
      // Only allocate individual sheets for sellers and moderators
      if (u.role === 'seller' || u.role === 'moderator') {
        validSellerUsernames[u.username] = true;
      }
    }
  });
  
  if (Object.keys(validSellerUsernames).length === 0) return;
  
  var sellerOrders = {};
  Object.keys(validSellerUsernames).forEach(function(username) {
    sellerOrders[username] = [];
  });
  
  orders.forEach(function(o) {
    if (o && o.merchantId) {
      var username = idToUsername[o.merchantId];
      if (username && validSellerUsernames[username]) {
        sellerOrders[username].push(o);
      }
    }
  });
  
  Object.keys(sellerOrders).forEach(function(username) {
    var sheetName = "Orders_" + username;
    var userOrders = sellerOrders[username];
    objectsToSheetAtomic(sheetName, userOrders);
  });
  
  // Cleanup orphaned/stale sheets (e.g., if a username changes or role changes)
  var allSheets = ss.getSheets();
  allSheets.forEach(function(sheet) {
    var sName = sheet.getName();
    if (sName.indexOf("Orders_") === 0) {
      var sUser = sName.substring(7);
      if (!validSellerUsernames[sUser]) {
        ss.deleteSheet(sheet);
      }
    }
  });
}`;

// There is some whitespace variations, so let's do a more robust regex replace or just use precise string replace
const replaced = code.replace(targetFunction, replaceFunction);

if (replaced === code) {
  console.log("REPLACE FAILED. Trying regex...");
  
  const regex = /function distributeOrdersBySeller\(\) \{[\s\S]*?objectsToSheetAtomic\(sheetName, userOrders\);\n  \}\);\n\}/;
  const regexReplaced = code.replace(regex, replaceFunction);
  if (regexReplaced === code) {
     console.error("REGEX FAILED TOO");
  } else {
     fs.writeFileSync('app.js', regexReplaced);
     console.log("Regex replace successful.");
  }
} else {
  fs.writeFileSync('app.js', replaced);
  console.log("String replace successful.");
}
