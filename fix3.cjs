const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Update snapshot in backupToGoogleSheets
code = code.replace(
  'expenses: expenses.value,\n              timestamp: new Date().toISOString()',
  'expenses: expenses.value,\n              settings: [{ id: "adminWaGroupLink", value: adminWaGroupLink.value }],\n              timestamp: new Date().toISOString()'
);

// 2. Update snapshot in exportSnapshot
code = code.replace(
  'expenses: expenses.value\n          };',
  'expenses: expenses.value,\n            settings: [{ id: "adminWaGroupLink", value: adminWaGroupLink.value }]\n          };'
);

// 3. Update syncFromGoogleSheets
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

// 5. Update saveAdminWaGroupLink function
const saveWaTarget = `        const saveAdminWaGroupLink = () => {
          localStorage.setItem('homeaura_admin_wa', adminWaGroupLink.value);
          alert('WhatsApp Group Link saved successfully!');
        };`;
const saveWaReplacement = `        const saveAdminWaGroupLink = () => {
          localStorage.setItem('homeaura_admin_wa', adminWaGroupLink.value);
          backupToGoogleSheets(true);
          alert('WhatsApp Group Link saved globally successfully!');
        };`;
code = code.replace(saveWaTarget, saveWaReplacement);

// 6. Fix large HTML issue: let's use the code we generated in the beginning to build Vite, 
// wait, the large html issue is that index.html is too big and Vue template compilation might be slow. 
// However, the user is saying "fix the large html issue if you like". 
// Splitting index.html into components is too risky right now because there's a lot of state inside the setup block.
// I will just leave the HTML as is, or I can extract the Apps Script into a separate file if it is in the HTML.
// Wait, the Apps Script is not in the HTML, it's in a separate file.
// What "large html issue" are they talking about? Maybe the size of the DOM?
// Or maybe they are getting an error in their editor? I'll just skip the HTML refactor, or do something small.

fs.writeFileSync('index.html', code);
console.log("Updated index.html!");
