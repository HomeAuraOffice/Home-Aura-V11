const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

code = code.replace(/initSyncQueue,/g, 'initSyncQueue, saveSyncQueue,');
fs.writeFileSync('app.js', code);
