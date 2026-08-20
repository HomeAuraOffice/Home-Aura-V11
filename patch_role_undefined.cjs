const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

code = code.replace(/users\.value\.filter\(u => u\.role === 'seller'\)/g, "users.value.filter(u => u && u.role === 'seller')");

fs.writeFileSync('app.js', code);
