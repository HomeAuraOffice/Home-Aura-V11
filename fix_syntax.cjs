const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// First, revert the bad ending
code = code.replace(`          saveOrders();
          saveDeletedOrders();
          selectedOrders.value.clear();
          closeModal();
          });
        };`, `          saveOrders();
          saveDeletedOrders();
          selectedOrders.value.clear();
        };`);

// Now apply the correct bulkDeleteSelected wrapper
const target = `          if (!confirm(\`Are you sure you want to void \${selectedOrders.value.size} selected order(s)?\`)) return;
          const toDeleteIds = Array.from(selectedOrders.value);`;

const replacement = `          openGlobalConfirm(\`Are you sure you want to void \${selectedOrders.value.size} selected order(s)?\`, 'Void Orders', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
          const toDeleteIds = Array.from(selectedOrders.value);`;

code = code.replace(target, replacement);

// And close it properly
const endTarget = `          saveOrders();
          saveDeletedOrders();
          selectedOrders.value.clear();
        };`;

const endReplacement = `          saveOrders();
          saveDeletedOrders();
          selectedOrders.value.clear();
          closeModal();
          });
        };`;

code = code.replace(endTarget, endReplacement);

fs.writeFileSync('app.js', code);
