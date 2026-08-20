const fs = require('fs');
let htmlCode = fs.readFileSync('index.html', 'utf8');

const target = "task.status = 'completed'; syncQueue.changes.tasks = syncQueue.changes.tasks || {}; syncQueue.changes.tasks[task.id] = true;";
htmlCode = htmlCode.replace(target, "markTaskDone(task)");

fs.writeFileSync('index.html', htmlCode);
