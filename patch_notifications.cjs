const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

const notifCode = `
        // Browser Notifications for Tasks
        let lastTaskIds = new Set(tasks.value.map(t => t.id));
        watch(() => tasks.value, (newTasks) => {
          if (!currentUser.value) return;
          const currentTaskIds = new Set(newTasks.map(t => t.id));
          
          // Check for new tasks
          const newAddedTasks = newTasks.filter(t => !lastTaskIds.has(t.id));
          
          newAddedTasks.forEach(task => {
            // Check if task is for me
            if (task.assigneeRole === 'all' || task.assigneeRole === currentUser.value.role || task.assigneeId === currentUser.value.id) {
              // It's a new task for me!
              // Ask for permission and notify
              if (Notification.permission === 'granted') {
                new Notification('HomeAura: New Task Assigned', {
                  body: task.title,
                  icon: '/icon.png' // fallback if exists
                });
              } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                  if (permission === 'granted') {
                    new Notification('HomeAura: New Task Assigned', {
                      body: task.title
                    });
                  }
                });
              }
              // Also show in-app toast if toast exists
              if (typeof showToast === 'function') {
                showToast('New Task: ' + task.title, 'info');
              }
            }
          });
          
          lastTaskIds = currentTaskIds;
        }, { deep: true });
`;

// Insert the code in the setup function, right before `return {`
js = js.replace('return {', notifCode + '\n        return {');
fs.writeFileSync('app.js', js);
