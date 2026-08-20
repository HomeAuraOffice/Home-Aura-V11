const fs = require('fs');

let code = fs.readFileSync('fixed_apps_script.js', 'utf8');

// 1. Add pendingDeletes processing to doPost
const doPostTarget = `    if (payloadObj.settings) mergeObjectsById("settings", payloadObj.settings);`;
const doPostReplacement = `    if (payloadObj.settings) mergeObjectsById("settings", payloadObj.settings);
    
    // --- 3. PROCESS EXPLICIT DELETES ---
    if (payloadObj.pendingDeletes) {
      Object.keys(payloadObj.pendingDeletes).forEach(function(sheetName) {
        var idsToDelete = payloadObj.pendingDeletes[sheetName];
        if (idsToDelete && idsToDelete.length > 0) {
          deleteObjectsById(sheetName, idsToDelete);
        }
      });
    }`;
code = code.replace(doPostTarget, doPostReplacement);

// 2. Add deleteObjectsById function
const helperFunctionsTarget = `// HELPER FUNCTIONS (Do not delete)
// ---------------------------------------------`;
const helperFunctionsReplacement = `// HELPER FUNCTIONS (Do not delete)
// ---------------------------------------------
function deleteObjectsById(sheetName, idsToDelete) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  
  var existingObjects = sheetToObjects(sheetName);
  var filteredObjects = [];
  
  var idMap = {};
  idsToDelete.forEach(function(id) { idMap[id] = true; });
  
  existingObjects.forEach(function(obj) {
    if (!idMap[obj.id]) {
      filteredObjects.push(obj);
    }
  });
  
  objectsToSheetAtomic(sheetName, filteredObjects);
}`;
code = code.replace(helperFunctionsTarget, helperFunctionsReplacement);

fs.writeFileSync('fixed_apps_script.js', code);
console.log("Updated fixed_apps_script.js with deleteObjectsById");
