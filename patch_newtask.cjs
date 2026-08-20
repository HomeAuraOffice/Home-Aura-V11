const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const jsCode = `
        const newTask = reactive({ title: '', description: '', assigneeRole: 'all', assigneeId: '' });
        const createNewTask = () => {
          if (!newTask.title) return;
          const taskId = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
          tasks.value.unshift({
            id: taskId,
            title: newTask.title,
            description: newTask.description,
            status: 'pending',
            assigneeRole: newTask.assigneeRole,
            assigneeId: newTask.assigneeId,
            createdAt: new Date().toISOString()
          });
          syncQueue.value.changes.tasks = syncQueue.value.changes.tasks || {};
          syncQueue.value.changes.tasks[taskId] = true;
          saveSyncQueue();
          newTask.title = '';
          newTask.description = '';
        };
`;

code = code.replace(/const activeTab = ref\(/, jsCode + '\n        const activeTab = ref(');
code = code.replace(/isUserOnline,/, 'isUserOnline, newTask, createNewTask,');
fs.writeFileSync('app.js', code);
