const fs = require('fs');
let code = fs.readFileSync('fixed_apps_script.js', 'utf8');

code = code.replace(
  'expenses: sheetToObjects("expenses"),',
  'expenses: sheetToObjects("expenses"),\n      settings: sheetToObjects("settings"),'
);

code = code.replace(
  'if (payloadObj.expenses) mergeObjectsById("expenses", payloadObj.expenses);',
  'if (payloadObj.expenses) mergeObjectsById("expenses", payloadObj.expenses);\n    if (payloadObj.settings) mergeObjectsById("settings", payloadObj.settings);'
);

fs.writeFileSync('fixed_apps_script.js', code);
console.log("Updated apps script!");
