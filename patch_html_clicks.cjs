const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/@click="isTasksPanelOpen = true;[^"]*"/g, '@click="openTasksPanel"');
html = html.replace(/@click="isTasksPanelOpen = true"/g, '@click="openTasksPanel"');

fs.writeFileSync('index.html', html);
