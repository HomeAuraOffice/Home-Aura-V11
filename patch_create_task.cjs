const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

js = js.replace(
  "const newTask = reactive({ title: '', description: '', assigneeRole: 'all', assigneeId: '' });",
  "const newTask = reactive({ title: '', description: '', assigneeRole: 'all', assigneeId: '', assigneeIds: [] });"
);

const oldCreate = `        const createNewTask = () => {
          if (!newTask.title) return;
          const taskId = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
          tasks.value.unshift({
            id: taskId,
            title: newTask.title,
            description: newTask.description,
            status: 'pending',
            assigneeRole: newTask.assigneeRole,
            assigneeId: newTask.assigneeId,
            createdAt: getBstIsoString()
          });
          syncQueue.value.changes.tasks = syncQueue.value.changes.tasks || {};
          syncQueue.value.changes.tasks[taskId] = true;
          saveSyncQueue();
          newTask.title = '';
        };`;

const newCreate = `        const createNewTask = () => {
          if (!newTask.title) return;
          syncQueue.value.changes.tasks = syncQueue.value.changes.tasks || {};

          if (newTask.assigneeRole !== 'all' && newTask.assigneeIds && newTask.assigneeIds.length > 0) {
            newTask.assigneeIds.forEach(userId => {
              const taskId = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
              tasks.value.unshift({
                id: taskId,
                title: newTask.title,
                description: newTask.description,
                status: 'pending',
                assigneeRole: newTask.assigneeRole,
                assigneeId: userId,
                createdAt: getBstIsoString()
              });
              syncQueue.value.changes.tasks[taskId] = true;
            });
          } else {
            const taskId = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            tasks.value.unshift({
              id: taskId,
              title: newTask.title,
              description: newTask.description,
              status: 'pending',
              assigneeRole: newTask.assigneeRole,
              assigneeId: '',
              createdAt: getBstIsoString()
            });
            syncQueue.value.changes.tasks[taskId] = true;
          }

          saveSyncQueue();
          newTask.title = '';
          newTask.description = '';
          newTask.assigneeIds = [];
        };`;

js = js.replace(oldCreate, newCreate);
fs.writeFileSync('app.js', js);
