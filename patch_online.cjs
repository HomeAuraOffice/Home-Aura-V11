const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

code = code.replace(/const activeTab = ref/, 'const isUserOnline = (timeStr) => {\n          if (!timeStr) return false;\n          return (Date.now() - new Date(timeStr).getTime()) < 5 * 60000;\n        };\n        const activeTab = ref');

code = code.replace(/isTasksPanelOpen,/, 'isTasksPanelOpen, isUserOnline,');
fs.writeFileSync('app.js', code);
