const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(' Snapshot Backup System', '💾 Snapshot Backup System');
fs.writeFileSync('index.html', html);
