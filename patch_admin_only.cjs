const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const revertToAdmin = [
  "activeTab === 'payables_audit'",
  "activeTab === 'finance'",
  "activeTab === 'trash'",
  "activeTab === 'settings'",
  "@click=\"confirmVoidOrder"
];

for (const keyword of revertToAdmin) {
  const regex = new RegExp(`v-if="\\(currentUser\\.role === 'admin' \\|\\| currentUser\\.role === 'moderator'\\)([^\"]*?${keyword})`, 'g');
  code = code.replace(regex, 'v-if="currentUser.role === \'admin\'$1');
  
  const regex2 = new RegExp(`v-if="\\(currentUser\\.role === 'admin' \\|\\| currentUser\\.role === 'moderator'\\)"([^\"]*?${keyword})`, 'g');
  code = code.replace(regex2, 'v-if="currentUser.role === \'admin\'"$1');
}

// Navigation buttons:
code = code.replace(/<button @click="activeTab = 'payables_audit'" v-if="\(currentUser.role === 'admin' \|\| currentUser.role === 'moderator'\)"/g, '<button @click="activeTab = \'payables_audit\'" v-if="currentUser.role === \'admin\'"');
// Wait, the nav buttons in index.html don't have v-if on themselves, they are inside the <template v-if="(currentUser.role === 'admin' || currentUser.role === 'moderator')">

fs.writeFileSync('index.html', code);
