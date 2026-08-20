const fs = require('fs');

let code = fs.readFileSync('app.js', 'utf8');

const target = `        const bulkDeleteSelected = () => {
          if (selectedOrders.value.size === 0) return;
          if (currentUser.value?.role === 'seller') {
             const toDeleteIds = Array.from(selectedOrders.value);
             const hasOthers = orders.value.some(o => toDeleteIds.includes(o.id) && o.merchantName !== currentUser.value?.name && o.merchantId !== currentUser.value?.id);
             if (hasOthers) {
               alert("⚠️ Security restriction: You cannot void orders assigned to other merchants.");
               return;
             }
          }
          if (!confirm(\`Are you sure you want to void \${selectedOrders.value.size} selected order(s)?\`)) return;
          const toDeleteIds = Array.from(selectedOrders.value);
          const ordersToMove = orders.value.filter(o => toDeleteIds.includes(o.id));
          
          const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
          ordersToMove.forEach(o => {
            o.deletedAt = now;
            deletedOrders.value.unshift(o);
          });
          
          orders.value = orders.value.filter(o => !toDeleteIds.includes(o.id));
          pendingDeletes.value.orders.push(...toDeleteIds);
          savePendingDeletes();
          saveOrders();
          saveDeletedOrders();
          selectedOrders.value.clear();
        };`;

const replacement = `        const bulkDispatchSelected = () => {
          if (selectedOrders.value.size === 0) return;
          if (currentUser.value?.role === 'seller') {
             const toDispatchIds = Array.from(selectedOrders.value);
             const hasOthers = orders.value.some(o => toDispatchIds.includes(o.id) && o.merchantName !== currentUser.value?.name && o.merchantId !== currentUser.value?.id);
             if (hasOthers) {
               alert("⚠️ Security restriction: You cannot modify orders assigned to other merchants.");
               return;
             }
          }
          openGlobalConfirm(\`Are you sure you want to mark \${selectedOrders.value.size} selected order(s) as Dispatched?\`, 'Dispatch Selected', 'bg-emerald-600 hover:bg-emerald-500 text-white', () => {
            const toDispatchIds = Array.from(selectedOrders.value);
            orders.value.forEach(o => {
              if (toDispatchIds.includes(o.id)) {
                o.status = 'Dispatched';
              }
            });
            saveOrders();
            selectedOrders.value.clear();
            closeModal();
          });
        };

        const bulkDeleteSelected = () => {
          if (selectedOrders.value.size === 0) return;
          if (currentUser.value?.role === 'seller') {
             const toDeleteIds = Array.from(selectedOrders.value);
             const hasOthers = orders.value.some(o => toDeleteIds.includes(o.id) && o.merchantName !== currentUser.value?.name && o.merchantId !== currentUser.value?.id);
             if (hasOthers) {
               alert("⚠️ Security restriction: You cannot void orders assigned to other merchants.");
               return;
             }
          }
          openGlobalConfirm(\`Are you sure you want to void \${selectedOrders.value.size} selected order(s)?\`, 'Void Selected', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
            const toDeleteIds = Array.from(selectedOrders.value);
            const ordersToMove = orders.value.filter(o => toDeleteIds.includes(o.id));
            
            const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
            ordersToMove.forEach(o => {
              o.deletedAt = now;
              deletedOrders.value.unshift(o);
            });
            
            orders.value = orders.value.filter(o => !toDeleteIds.includes(o.id));
            pendingDeletes.value.orders.push(...toDeleteIds);
            savePendingDeletes();
            saveOrders();
            saveDeletedOrders();
            selectedOrders.value.clear();
            closeModal();
          });
        };`;

code = code.replace(target, replacement);

const returnTarget = `          bulkDeleteSelected,`;
const returnReplacement = `          bulkDeleteSelected,
          bulkDispatchSelected,`;
code = code.replace(returnTarget, returnReplacement);

fs.writeFileSync('app.js', code);
