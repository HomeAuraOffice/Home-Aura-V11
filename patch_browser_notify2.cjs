const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const notifyCode = `
        // Browser Notifications for new tasks
        watch(tasks, (newTasks, oldTasks) => {
          if (!currentUser.value) return;
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            const oldIds = new Set((oldTasks || []).map(t => t.id));
            const newAssignedTasks = newTasks.filter(t => !oldIds.has(t.id) && t.status === 'pending' && (t.assigneeId === currentUser.value.id || t.assigneeRole === currentUser.value.role || t.assigneeRole === 'all'));
            
            newAssignedTasks.forEach(task => {
              new Notification('HomeAura Task Assigned', {
                body: task.title + '\\n' + task.description,
                icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png'
              });
            });
          }
        }, { deep: true });

        const requestNotificationPermission = () => {
          if (typeof Notification !== 'undefined' && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
          }
        };
        onMounted(() => {
          requestNotificationPermission();
        });
`;

code = code.replace(/\/\/ Watchers for Charts/, notifyCode + '\n        // Watchers for Charts');
fs.writeFileSync('app.js', code);
