const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');
code = code.replace("          } catch(err) {\n            alert('Failed to update backup schedule: ' + err.message);\n          }\n        const instantBackupToDrive = async () => {",
"          } catch(err) {\n            alert('Failed to update backup schedule: ' + err.message);\n          }\n        };\n\n        const instantBackupToDrive = async () => {");
fs.writeFileSync('app.js', code);
