const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');
code = code.replace(/u\.username/g, 'u?.username');
code = code.replace(/remoteU\.username/g, 'remoteU?.username');
fs.writeFileSync('app.js', code);
