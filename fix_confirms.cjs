const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Add openGlobalConfirm
const closeModalCode = `        const closeModal = () => {`;
const openGlobalConfirmCode = `        const openGlobalConfirm = (message, confirmText, confirmClass, onConfirm) => {
          modalData.title = 'Confirmation Required';
          modalData.confirmMessage = message;
          modalData.confirmButtonText = confirmText || 'Confirm';
          modalData.confirmButtonClass = confirmClass || 'bg-rose-600 hover:bg-rose-500 text-white';
          modalData.onConfirm = onConfirm;
          activeModal.value = 'globalConfirm';
        };

        const closeModal = () => {`;
code = code.replace(closeModalCode, openGlobalConfirmCode);

// 2. Add it to exports
code = code.replace('closeModal', 'closeModal,\n          openGlobalConfirm');

// 3. Update deleteBill
const deleteBillTarget = `        const deleteBill = (id) => {
          if (confirm('Are you sure you want to delete this bill?')) {
            factoryBills.value = factoryBills.value.filter(b => b.id !== id);
            saveFactoryBills();
          }
        };`;
const deleteBillReplacement = `        const deleteBill = (id) => {
          openGlobalConfirm('Are you sure you want to delete this bill?', 'Delete Bill', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
            factoryBills.value = factoryBills.value.filter(b => b.id !== id);
            saveFactoryBills();
            closeModal();
          });
        };`;
code = code.replace(deleteBillTarget, deleteBillReplacement);

// 4. Update deleteExpense
const deleteExpenseTarget = `        const deleteExpense = (id) => {
          if (confirm('Are you sure you want to delete this expense record?')) {
            expenses.value = expenses.value.filter(e => e.id !== id);
            saveExpenses();
          }
        };`;
const deleteExpenseReplacement = `        const deleteExpense = (id) => {
          openGlobalConfirm('Are you sure you want to delete this expense record?', 'Delete Expense', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
            expenses.value = expenses.value.filter(e => e.id !== id);
            saveExpenses();
            closeModal();
          });
        };`;
code = code.replace(deleteExpenseTarget, deleteExpenseReplacement);

// 5. Update emptyTrash
const emptyTrashTarget = `        const emptyTrash = () => {
          if (confirm('Are you sure you want to permanently delete all items in the trash? This action cannot be undone.')) {
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
          }
        };`;
const emptyTrashReplacement = `        const emptyTrash = () => {
          openGlobalConfirm('Are you sure you want to permanently delete all items in the trash? This action cannot be undone.', 'Empty Trash', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
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
          });
        };`;
code = code.replace(emptyTrashTarget, emptyTrashReplacement);

// 6. Update bulkDeleteSelected
const bulkDeleteSelectedTarget = `        const bulkDeleteSelected = () => {
          if (selectedOrders.value.size === 0) return;
          if (!confirm(\`Are you sure you want to void \${selectedOrders.value.size} selected order(s)?\`)) return;
          
          const idsToDelete = Array.from(selectedOrders.value);`;
const bulkDeleteSelectedReplacement = `        const bulkDeleteSelected = () => {
          if (selectedOrders.value.size === 0) return;
          openGlobalConfirm(\`Are you sure you want to void \${selectedOrders.value.size} selected order(s)?\`, 'Void Orders', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
          const idsToDelete = Array.from(selectedOrders.value);`;
const bulkDeleteSelectedTargetEnd = `          saveOrders();
          saveDeletedOrders();
          selectedOrders.value.clear();
        };`;
const bulkDeleteSelectedReplacementEnd = `          saveOrders();
          saveDeletedOrders();
          selectedOrders.value.clear();
          closeModal();
          });
        };`;
code = code.replace(bulkDeleteSelectedTarget, bulkDeleteSelectedReplacement);
code = code.replace(bulkDeleteSelectedTargetEnd, bulkDeleteSelectedReplacementEnd);

// 7. Update importSnapshot
const importSnapshotTarget = `        const importSnapshot = (event) => {
          const file = event.target.files[0];
          if (!file) return;
          
          if (!confirm('Warning: Restoring from a snapshot will completely overwrite the current system data. Proceed?')) {
             event.target.value = null; // Reset input
             return;
          }
          
          const reader = new FileReader();`;
const importSnapshotReplacement = `        const importSnapshot = (event) => {
          const file = event.target.files[0];
          if (!file) return;
          
          openGlobalConfirm('Warning: Restoring from a snapshot will completely overwrite the current system data. Proceed?', 'Restore Snapshot', 'bg-emerald-600 hover:bg-emerald-500 text-white', () => {
          const reader = new FileReader();`;
const importSnapshotTargetEnd = `              } catch (e) {
                alert('Invalid snapshot file format.');
              }
            }
          };
          reader.readAsText(file);
          event.target.value = null;
        };`;
const importSnapshotReplacementEnd = `              } catch (e) {
                alert('Invalid snapshot file format.');
              }
            }
            closeModal();
          };
          reader.readAsText(file);
          event.target.value = null;
          });
        };`;
code = code.replace(importSnapshotTarget, importSnapshotReplacement);
code = code.replace(importSnapshotTargetEnd, importSnapshotReplacementEnd);

fs.writeFileSync('app.js', code);
console.log("Updated app.js confirms!");
