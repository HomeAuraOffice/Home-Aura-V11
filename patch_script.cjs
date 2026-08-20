const fs = require('fs');
let code = fs.readFileSync('full_apps_script.js', 'utf8');

code = code.replace(/settings: sheetToObjects\("settings"\)/, 'settings: sheetToObjects("settings"),\n      tasks: sheetToObjects("tasks"),\n      notifications: sheetToObjects("notifications")');

code = code.replace(/if \(changes.settings && changes.settings.length\) \{\n        stats.updatedRecords \+= mergeObjectsByIdLWW\("settings", changes.settings\);\n      \}/, 'if (changes.settings && changes.settings.length) {\n        stats.updatedRecords += mergeObjectsByIdLWW("settings", changes.settings);\n      }\n      if (changes.tasks && changes.tasks.length) {\n        stats.updatedRecords += mergeObjectsByIdLWW("tasks", changes.tasks);\n      }\n      if (changes.notifications && changes.notifications.length) {\n        stats.updatedRecords += mergeObjectsByIdLWW("notifications", changes.notifications);\n      }');

code = code.replace(/if \(payloadObj.settings\) stats.updatedRecords \+= mergeObjectsByIdLWW\("settings", payloadObj.settings\);/, 'if (payloadObj.settings) stats.updatedRecords += mergeObjectsByIdLWW("settings", payloadObj.settings);\n    if (payloadObj.tasks) stats.updatedRecords += mergeObjectsByIdLWW("tasks", payloadObj.tasks);\n    if (payloadObj.notifications) stats.updatedRecords += mergeObjectsByIdLWW("notifications", payloadObj.notifications);');

fs.writeFileSync('full_apps_script.js', code);
console.log('Patched full_apps_script.js');
