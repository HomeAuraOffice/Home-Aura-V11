const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

code = code.replace(/const expenses = ref\(\[\]\);/, 'const expenses = ref([]);\n        const tasks = ref([]);\n        const notifications = ref([]);');

code = code.replace(/data\.expenses \|\| \[\]\n/, 'data.expenses || []\n              tasks.value = data.tasks || []\n              notifications.value = data.notifications || []\n');

code = code.replace(/expenses: expenses\.value/, 'expenses: expenses.value,\n              tasks: tasks.value,\n              notifications: notifications.value');

// Also update `extractCollections` and `initSyncQueue` and anywhere else `expenses` is mapped.
// Let's check extractCollections.
