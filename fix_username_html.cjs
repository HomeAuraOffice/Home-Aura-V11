const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
code = code.replace(/seller\.username/g, 'seller?.username');
code = code.replace(/merchant\.username/g, 'merchant?.username');
code = code.replace(/m\.username/g, 'm?.username');
code = code.replace(/modalData\.user\.username/g, 'modalData.user?.username');
fs.writeFileSync('index.html', code);
