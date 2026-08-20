const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const logic = `
        const isTasksPanelOpen = ref(false);
        const unreadNotificationsCount = computed(() => {
          if (!currentUser.value) return 0;
          return tasks.value.filter(t => t.status === 'pending' && (t.assigneeId === currentUser.value.id || t.assigneeRole === currentUser.value.role || t.assigneeRole === 'all')).length;
        });

        // Automated Task Generator
        setInterval(() => {
          if (currentUser.value?.role !== 'admin' && currentUser.value?.role !== 'moderator') return;
          const now = Date.now();
          const twoHours = 2 * 60 * 60 * 1000;
          let changed = false;
          orders.value.forEach(order => {
            if (order.status === 'Pending' && order.createdAt) {
              const orderTime = new Date(order.createdAt).getTime();
              if (now - orderTime > twoHours) {
                 const taskId = 'auto_pending_' + order.id;
                 const existing = tasks.value.find(t => t.id === taskId);
                 if (!existing) {
                    tasks.value.push({
                       id: taskId,
                       title: 'Overdue Pending Order: ' + (order.orderId || order.id),
                       description: 'Order for ' + order.customerName + ' has been pending for over 2 hours.',
                       status: 'pending',
                       assigneeRole: 'seller',
                       assigneeId: order.merchantId,
                       orderId: order.id,
                       createdAt: new Date().toISOString()
                    });
                    syncQueue.value.changes.tasks = syncQueue.value.changes.tasks || {};
                    syncQueue.value.changes.tasks[taskId] = true;
                    changed = true;
                 }
              }
            }
          });
          if (changed) {
            localStorage.setItem('homeaura_tasks', JSON.stringify(tasks.value));
            saveSyncQueue();
          }
        }, 60000);
`;

code = code.replace(/const activeTab = ref\('dashboard'\);/, 'const activeTab = ref(\'dashboard\');\n' + logic);

// Include in return object
code = code.replace(/activeTab,/, 'activeTab, isTasksPanelOpen, unreadNotificationsCount, tasks, notifications,');

fs.writeFileSync('app.js', code);
