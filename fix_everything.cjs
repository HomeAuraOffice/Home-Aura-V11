const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// --- A. ADD OPEN_GLOBAL_CONFIRM ---
const closeModalTarget = `        const closeModal = () => {`;
const closeModalReplacement = `        const openGlobalConfirm = (message, confirmText, confirmClass, onConfirm) => {
          modalData.title = 'Confirmation Required';
          modalData.confirmMessage = message;
          modalData.confirmButtonText = confirmText || 'Confirm';
          modalData.confirmButtonClass = confirmClass || 'bg-rose-600 hover:bg-rose-500 text-white';
          modalData.onConfirm = onConfirm;
          activeModal.value = 'globalConfirm';
        };

        const closeModal = () => {`;
code = code.replace(closeModalTarget, closeModalReplacement);

// Add to exports
code = code.replace(`          closeModal\n        };\n      }\n    }).mount('#app');`, `          closeModal,\n          openGlobalConfirm\n        };\n      }\n    }).mount('#app');`);

// --- B. REPLACE CONFIRMS ---
// deleteBill
code = code.replace(`          if (confirm('Are you sure you want to delete this bill?')) {
            factoryBills.value = factoryBills.value.filter(b => b.id !== id);
            saveFactoryBills();
          }`, `          openGlobalConfirm('Are you sure you want to delete this bill?', 'Delete Bill', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
            factoryBills.value = factoryBills.value.filter(b => b.id !== id);
            saveFactoryBills();
            closeModal();
          });`);

// deleteExpense
code = code.replace(`          if (confirm('Are you sure you want to delete this expense record?')) {
            expenses.value = expenses.value.filter(e => e.id !== id);
            saveExpenses();
          }`, `          openGlobalConfirm('Are you sure you want to delete this expense record?', 'Delete Expense', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
            expenses.value = expenses.value.filter(e => e.id !== id);
            saveExpenses();
            closeModal();
          });`);

// emptyTrash
code = code.replace(`          if (confirm('Are you sure you want to permanently delete all items in the trash? This action cannot be undone.')) {
            const permanentlyDeletedIds = deletedOrders.value.map(o => o.id);
            deletedOrders.value = [];
            saveDeletedOrders();
            
            // Clean up linked factory bills to remove permanently deleted orders
            let billsChanged = false;
            factoryBills.value.forEach(bill => {
              if (bill.linkedOrderIds) {
                const originalLength = bill.linkedOrderIds.length;
                bill.linkedOrderIds = bill.linkedOrderIds.filter(id => !permanentlyDeletedIds.includes(id));
                if (bill.linkedOrderIds.length !== originalLength) billsChanged = true;
              }
            });
            if (billsChanged) saveFactoryBills();
          }`, `          openGlobalConfirm('Are you sure you want to permanently delete all items in the trash? This action cannot be undone.', 'Empty Trash', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
            const permanentlyDeletedIds = deletedOrders.value.map(o => o.id);
            deletedOrders.value = [];
            saveDeletedOrders();
            
            // Clean up linked factory bills to remove permanently deleted orders
            let billsChanged = false;
            factoryBills.value.forEach(bill => {
              if (bill.linkedOrderIds) {
                const originalLength = bill.linkedOrderIds.length;
                bill.linkedOrderIds = bill.linkedOrderIds.filter(id => !permanentlyDeletedIds.includes(id));
                if (bill.linkedOrderIds.length !== originalLength) billsChanged = true;
              }
            });
            if (billsChanged) saveFactoryBills();
            closeModal();
          });`);

// bulkDeleteSelected
code = code.replace(`          if (!confirm(\`Are you sure you want to void \${selectedOrders.value.size} selected order(s)?\`)) return;
          const toDeleteIds = Array.from(selectedOrders.value);
          const ordersToMove = orders.value.filter(o => toDeleteIds.includes(o.id));
          
          const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
          ordersToMove.forEach(o => {
            o.deletedAt = now;
            deletedOrders.value.unshift(o);
          });
          
          orders.value = orders.value.filter(o => !toDeleteIds.includes(o.id));
          saveOrders();
          saveDeletedOrders();
          selectedOrders.value.clear();`, `          openGlobalConfirm(\`Are you sure you want to void \${selectedOrders.value.size} selected order(s)?\`, 'Void Orders', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
          const toDeleteIds = Array.from(selectedOrders.value);
          const ordersToMove = orders.value.filter(o => toDeleteIds.includes(o.id));
          
          const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
          ordersToMove.forEach(o => {
            o.deletedAt = now;
            deletedOrders.value.unshift(o);
          });
          
          orders.value = orders.value.filter(o => !toDeleteIds.includes(o.id));
          saveOrders();
          saveDeletedOrders();
          selectedOrders.value.clear();
          closeModal();
          });`);

// importSnapshot
code = code.replace(`          if (!confirm('Warning: Restoring from a snapshot will completely overwrite the current system data. Proceed?')) {
             event.target.value = null; // Reset input
             return;
          }
          
          const reader = new FileReader();`, `          openGlobalConfirm('Warning: Restoring from a snapshot will completely overwrite the current system data. Proceed?', 'Restore Snapshot', 'bg-emerald-600 hover:bg-emerald-500 text-white', () => {
          const reader = new FileReader();`);

code = code.replace(`              } catch (e) {
                alert('Invalid snapshot file format.');
              }
            }
          };
          reader.readAsText(file);
          event.target.value = null;`, `              } catch (e) {
                alert('Invalid snapshot file format.');
              }
            }
            closeModal();
          };
          reader.readAsText(file);
          event.target.value = null;
          });`);


// --- C. WA GROUP LINK SYNC SETTINGS ---

// 1. backupToGoogleSheets snapshot
code = code.replace(
  'expenses: expenses.value,\n              timestamp: new Date().toISOString()',
  'expenses: expenses.value,\n              settings: [{ id: "adminWaGroupLink", value: adminWaGroupLink.value }],\n              timestamp: new Date().toISOString()'
);

// 2. exportSnapshot snapshot
code = code.replace(
  'expenses: expenses.value\n          };',
  'expenses: expenses.value,\n            settings: [{ id: "adminWaGroupLink", value: adminWaGroupLink.value }]\n          };'
);

// 3. syncFromGoogleSheets
const syncFromTarget = `expenses.value = data.expenses || [];`;
const syncFromReplacement = `expenses.value = data.expenses || [];
                 if (data.settings && data.settings.length > 0) {
                     const waSetting = data.settings.find(s => s.id === 'adminWaGroupLink');
                     if (waSetting && waSetting.value) {
                         adminWaGroupLink.value = waSetting.value;
                         localStorage.setItem('homeaura_admin_wa', waSetting.value);
                     }
                 }`;
code = code.replace(syncFromTarget, syncFromReplacement);

// 4. Update auto sync trigger on adminWaGroupLink change
const watchTarget = `watch(adminWaGroupLink, (val) => localStorage.setItem('homeaura_admin_wa', val));`;
const watchReplacement = `watch(adminWaGroupLink, (val) => {
          localStorage.setItem('homeaura_admin_wa', val);
          triggerAutoSync();
        });`;
code = code.replace(watchTarget, watchReplacement);

// 5. Add saveAdminWaGroupLink function
const saveAppsScriptUrlCode = `        const saveAppsScriptUrl = () => {
          localStorage.setItem('homeaura_apps_script_url', appsScriptUrl.value);
          alert('Apps Script Backup URL saved!');
        };`;
const withSaveAdminWa = `        const saveAppsScriptUrl = () => {
          localStorage.setItem('homeaura_apps_script_url', appsScriptUrl.value);
          alert('Apps Script Backup URL saved!');
        };
        
        const saveAdminWaGroupLink = () => {
          localStorage.setItem('homeaura_admin_wa', adminWaGroupLink.value);
          backupToGoogleSheets(true);
          alert('WhatsApp Group Link saved globally successfully!');
        };`;
code = code.replace(saveAppsScriptUrlCode, withSaveAdminWa);

// 6. Add it to exports
code = code.replace('saveAppsScriptUrl,\n          backupToGoogleSheets', 'saveAppsScriptUrl,\n          saveAdminWaGroupLink,\n          backupToGoogleSheets');

fs.writeFileSync('app.js', code);
console.log("App.js correctly updated!");
