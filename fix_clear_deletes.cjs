const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const target = `            await fetch(appsScriptUrl.value, {
              method: 'POST',
              
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(snapshot)
            });
            if (!isAuto) alert('Backup data sent to Google Sheets successfully!\\n(Please allow a few moments for the sheet to update).');`;

const replacement = `            await fetch(appsScriptUrl.value, {
              method: 'POST',
              
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(snapshot)
            });
            
            // Clear successfully synced pending deletes
            pendingDeletes.value = { orders: [], deletedOrders: [], factoryBills: [], expenses: [] };
            savePendingDeletes();
            
            if (!isAuto) alert('Backup data sent to Google Sheets successfully!\\n(Please allow a few moments for the sheet to update).');`;

code = code.replace(target, replacement);

fs.writeFileSync('app.js', code);
