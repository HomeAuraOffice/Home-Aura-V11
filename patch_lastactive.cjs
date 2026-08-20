const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

code = code.replace(/const pushToGoogleSheets = async \(forceFull = false\) => {/, 'const pushToGoogleSheets = async (forceFull = false) => {\n          if (currentUser.value) {\n            const myU = users.value.find(u => u.username === currentUser.value.username);\n            if (myU) {\n              myU.lastActive = new Date().toISOString();\n              syncQueue.value.changes.users = syncQueue.value.changes.users || {};\n              syncQueue.value.changes.users[myU.id] = true;\n            }\n          }');

fs.writeFileSync('app.js', code);
