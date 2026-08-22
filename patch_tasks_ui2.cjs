const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Request notification permission when opening tasks panel
html = html.replace(
  `@click="isTasksPanelOpen = true"`,
  `@click="isTasksPanelOpen = true; if (window.Notification && Notification.permission === 'default') Notification.requestPermission();"`
);

// Add "Enable Notifications" button in settings if denied/default? Not necessary, the above handles it.

fs.writeFileSync('index.html', html);
