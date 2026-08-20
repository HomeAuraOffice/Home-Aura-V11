const fs = require('fs');

let code = fs.readFileSync('app.js', 'utf8');

// 1. Setup pendingDeletes ref
const pendingDeletesCode = `        const deletedOrders = ref(JSON.parse(localStorage.getItem('homeaura_deleted_orders')) || []);
        const pendingDeletes = ref(JSON.parse(localStorage.getItem('homeaura_pending_deletes')) || { orders: [], deletedOrders: [], factoryBills: [], expenses: [] });
        const savePendingDeletes = () => localStorage.setItem('homeaura_pending_deletes', JSON.stringify(pendingDeletes.value));
        const selectedOrders = ref(new Set());`;
code = code.replace(`        const deletedOrders = ref(JSON.parse(localStorage.getItem('homeaura_deleted_orders')) || []);
        const selectedOrders = ref(new Set());`, pendingDeletesCode);


// 2. executeVoidOrder
const executeVoidOrderTarget = `            orders.value = orders.value.filter(o => o.id !== modalData.order.id);
            saveOrders();
            saveDeletedOrders();`;
const executeVoidOrderReplacement = `            orders.value = orders.value.filter(o => o.id !== modalData.order.id);
            pendingDeletes.value.orders.push(modalData.order.id);
            savePendingDeletes();
            saveOrders();
            saveDeletedOrders();`;
code = code.replace(executeVoidOrderTarget, executeVoidOrderReplacement);

// 3. restoreOrder
const restoreOrderTarget = `          delete order.deletedAt;
          orders.value.unshift(order);
          saveOrders();
          saveDeletedOrders();`;
const restoreOrderReplacement = `          delete order.deletedAt;
          orders.value.unshift(order);
          pendingDeletes.value.deletedOrders.push(order.id);
          savePendingDeletes();
          saveOrders();
          saveDeletedOrders();`;
code = code.replace(restoreOrderTarget, restoreOrderReplacement);

// 4. emptyTrash
const emptyTrashTarget = `            const permanentlyDeletedIds = deletedOrders.value.map(o => o.id);
            deletedOrders.value = [];
            saveDeletedOrders();`;
const emptyTrashReplacement = `            const permanentlyDeletedIds = deletedOrders.value.map(o => o.id);
            deletedOrders.value = [];
            pendingDeletes.value.deletedOrders.push(...permanentlyDeletedIds);
            savePendingDeletes();
            saveDeletedOrders();`;
code = code.replace(emptyTrashTarget, emptyTrashReplacement);

// 5. bulkDeleteSelected
const bulkDeleteSelectedTarget = `          orders.value = orders.value.filter(o => !toDeleteIds.includes(o.id));
          saveOrders();
          saveDeletedOrders();`;
const bulkDeleteSelectedReplacement = `          orders.value = orders.value.filter(o => !toDeleteIds.includes(o.id));
          pendingDeletes.value.orders.push(...toDeleteIds);
          savePendingDeletes();
          saveOrders();
          saveDeletedOrders();`;
code = code.replace(bulkDeleteSelectedTarget, bulkDeleteSelectedReplacement);

// 6. deleteBill
const deleteBillTarget = `            factoryBills.value = factoryBills.value.filter(b => b.id !== id);
            saveFactoryBills();`;
const deleteBillReplacement = `            factoryBills.value = factoryBills.value.filter(b => b.id !== id);
            pendingDeletes.value.factoryBills.push(id);
            savePendingDeletes();
            saveFactoryBills();`;
code = code.replace(deleteBillTarget, deleteBillReplacement);

// 7. deleteExpense
const deleteExpenseTarget = `            expenses.value = expenses.value.filter(e => e.id !== id);
            saveExpenses();`;
const deleteExpenseReplacement = `            expenses.value = expenses.value.filter(e => e.id !== id);
            pendingDeletes.value.expenses.push(id);
            savePendingDeletes();
            saveExpenses();`;
code = code.replace(deleteExpenseTarget, deleteExpenseReplacement);

// 8. backupToGoogleSheets payload
const backupTarget = `              expenses: expenses.value,
              settings: [{ id: "adminWaGroupLink", value: adminWaGroupLink.value }],
              timestamp: new Date().toISOString()`;
const backupReplacement = `              expenses: expenses.value,
              settings: [{ id: "adminWaGroupLink", value: adminWaGroupLink.value }],
              pendingDeletes: pendingDeletes.value,
              timestamp: new Date().toISOString()`;
code = code.replace(backupTarget, backupReplacement);

// 9. backupToGoogleSheets success clear
const fetchTarget = `            await fetch(appsScriptUrl.value, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(snapshot)
            });
            if (!isAuto) alert('Backup data sent to Google Sheets successfully!\\n(Please allow a few moments for the sheet to update).');`;
const fetchReplacement = `            await fetch(appsScriptUrl.value, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(snapshot)
            });
            
            // Clear successfully synced pending deletes
            pendingDeletes.value = { orders: [], deletedOrders: [], factoryBills: [], expenses: [] };
            savePendingDeletes();
            
            if (!isAuto) alert('Backup data sent to Google Sheets successfully!\\n(Please allow a few moments for the sheet to update).');`;
code = code.replace(fetchTarget, fetchReplacement);

fs.writeFileSync('app.js', code);
console.log("Updated app.js with pendingDeletes");
