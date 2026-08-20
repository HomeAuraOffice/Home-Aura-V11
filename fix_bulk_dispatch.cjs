const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const dispatchFunc = `        const bulkDispatchSelected = () => {
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

        const bulkDeleteSelected`;

code = code.replace("        const bulkDeleteSelected", dispatchFunc);
fs.writeFileSync('app.js', code);
