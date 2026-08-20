const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const markDoneCode = `
        const markTaskDone = (task) => {
          task.status = 'completed';
          syncQueue.value.changes.tasks = syncQueue.value.changes.tasks || {};
          syncQueue.value.changes.tasks[task.id] = true;
          saveSyncQueue();
        };
`;

code = code.replace(/const createNewTask = \(\) => \{/, markDoneCode + '\n        const createNewTask = () => {');
code = code.replace(/createNewTask,/, 'createNewTask, markTaskDone,');
fs.writeFileSync('app.js', code);

let htmlCode = fs.readFileSync('index.html', 'utf8');
htmlCode = htmlCode.replace(/task\.status = 'completed'; syncQueue\.changes\.tasks = syncQueue\.changes\.tasks || \{\}; syncQueue\.changes\.tasks\[task\.id\] = true;/g, "markTaskDone(task)");
fs.writeFileSync('index.html', htmlCode);
