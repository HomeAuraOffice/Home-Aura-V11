const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

if (!js.includes('const openTasksPanel')) {
  const methodCode = `
        const openTasksPanel = () => {
          isTasksPanelOpen.value = true;
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
          }
        };
  `;
  js = js.replace('const isTasksPanelOpen = ref(false);', 'const isTasksPanelOpen = ref(false);\n' + methodCode);
  
  js = js.replace(/factoryBills, isTasksPanelOpen,/g, 'factoryBills, isTasksPanelOpen, openTasksPanel,');
  
  fs.writeFileSync('app.js', js);
}
