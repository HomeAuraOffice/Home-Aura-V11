const fs = require('fs');
let code = fs.readFileSync('patch3.js', 'utf8');
code = code.replace(/appJs = appJs\.replace\\\/\\\\(\\\`\\"\\\\\\\$\{o\\\\\.designCode\}\\",\\\`/g, 'appJs = appJs.replace(/\\\\(\\\`\\"\\\\\\\${o\\\\.designCode}\\",\\\\\\\`/g');
fs.writeFileSync('patch4.js', code);
