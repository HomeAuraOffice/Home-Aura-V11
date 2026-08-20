const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

code = code.replace(
  "const freshUser = users.value.find(u => u && u.username === user.username);",
  "if (!user || !user.username) throw new Error('Invalid session');\n              const freshUser = users.value.find(u => u && u.username === user.username);"
);

fs.writeFileSync('app.js', code);
