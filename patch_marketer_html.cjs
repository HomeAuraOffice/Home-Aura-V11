const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/v-if="\(\(currentUser\.role === 'admin' \|\| currentUser\.role === 'moderator'\) && activeTab === 'dashboard'\)"/g, "v-if=\"((currentUser.role === 'admin' || currentUser.role === 'moderator' || currentUser.role === 'marketer') && activeTab === 'dashboard')\"");

// Let's also find the original line without extra parenthesis if any
html = html.replace(/v-if="\(currentUser\.role === 'admin' \|\| currentUser\.role === 'moderator'\) && activeTab === 'dashboard'"/g, "v-if=\"(currentUser.role === 'admin' || currentUser.role === 'moderator' || currentUser.role === 'marketer') && activeTab === 'dashboard'\"");

fs.writeFileSync('index.html', html);
