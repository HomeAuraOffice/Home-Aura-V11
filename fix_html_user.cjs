const fs = require('fs');
let htmlCode = fs.readFileSync('index.html', 'utf8');
htmlCode = htmlCode.replace(/u\.username !== 'admin1'/g, "u?.username !== 'admin1'");
fs.writeFileSync('index.html', htmlCode);
