const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/<template v-if="\(currentUser\.role === 'admin' \|\| currentUser\.role === 'moderator'\)">/g, "<template v-if=\"(currentUser.role === 'admin' || currentUser.role === 'moderator' || currentUser.role === 'marketer')\">");

fs.writeFileSync('index.html', html);
