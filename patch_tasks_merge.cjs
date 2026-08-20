const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const tasksMerge = `
            // 9. Tasks Merge
            if (Array.isArray(data.tasks)) {
              const taskMap = new Map();
              data.tasks.forEach(t => { if (t && t.id) taskMap.set(String(t.id), t); });
              const newTasksList = [];
              const processedTaskIds = new Set();
              data.tasks.forEach(remoteT => {
                if (!remoteT || !remoteT.id) return;
                const tid = String(remoteT.id);
                processedTaskIds.add(tid);
                if (syncQueue.value.deletes.tasks && syncQueue.value.deletes.tasks.includes(remoteT.id)) return;
                const localT = tasks.value.find(t => String(t.id) === tid);
                if (localT) {
                  if (!syncQueue.value.changes.tasks || !syncQueue.value.changes.tasks[localT.id]) {
                    Object.assign(localT, remoteT);
                  }
                  newTasksList.push(localT);
                } else {
                  newTasksList.push(remoteT);
                }
              });
              tasks.value.forEach(localT => {
                if (localT && localT.id && !processedTaskIds.has(String(localT.id))) {
                  if (syncQueue.value.changes.tasks && syncQueue.value.changes.tasks[localT.id]) {
                    newTasksList.push(localT);
                  }
                }
              });
              tasks.value = newTasksList;
              localStorage.setItem('homeaura_tasks', JSON.stringify(tasks.value));
            }
`;

code = code.replace(/\/\/ 8\. Settings Merge \([^\)]+\)\n/, tasksMerge + '\n            // 8. Settings Merge (WhatsApp Reporting Group, etc.)\n');

// Also update extractCollections and syncQueue defaults.
code = code.replace(/factoryBills: \[\]\n/, 'factoryBills: [],\n            tasks: []\n'); // wait, let's see where factoryBills is.

fs.writeFileSync('app.js', code);
