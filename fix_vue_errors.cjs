const fs = require('fs');

// Fix app.js duplicate bulkDispatchSelected
let appCode = fs.readFileSync('app.js', 'utf8');
appCode = appCode.replace(/bulkDispatchSelected,\s*bulkDispatchSelected,/g, 'bulkDispatchSelected,');
fs.writeFileSync('app.js', appCode);

// Fix index.html undefined currentUser issues
let htmlCode = fs.readFileSync('index.html', 'utf8');
htmlCode = htmlCode.replace(/\{\{ currentUser\.username \}\}/g, '{{ currentUser?.username }}');
htmlCode = htmlCode.replace(/\{\{ currentUser\.name \}\}/g, '{{ currentUser?.name }}');
fs.writeFileSync('index.html', htmlCode);

console.log("Fixed Vue errors.");
