const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

code = code.replace(/expenses: \{\},\n\s+settings: \{\}\n\s+\},\n\s+deletes: \{/, 'expenses: {},\n              settings: {},\n              tasks: {}\n            },\n            deletes: {');
code = code.replace(/expenses: \[\]\n\s+\}\n\s+\};\n\s+\};/, 'expenses: [],\n              tasks: []\n            }\n          };\n        };');

fs.writeFileSync('app.js', code);
