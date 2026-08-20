const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const target = `            await fetch(appsScriptUrl.value, {
              method: 'POST',
              
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(snapshot)
            });
            
            // Clear successfully synced pending deletes`;
            
const replacement = `            const response = await fetch(appsScriptUrl.value, {
              method: 'POST',
              
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(snapshot)
            });
            const result = await response.json();
            if (result.status === 'error') {
               throw new Error(result.error || 'Server rejected the backup.');
            }
            
            // Clear successfully synced pending deletes`;

code = code.replace(target, replacement);
fs.writeFileSync('app.js', code);
