const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<div v-if="modalData.user.role === 'seller'">\\s*<label class="flex items-center space-x-3 cursor-pointer mt-4/, "<div v-if=\\"modalData.user.role === 'seller' || modalData.user.role === 'moderator'\\">\\n                <label class=\\"flex items-center space-x-3 cursor-pointer mt-4");
fs.writeFileSync('index.html', html);

let code = fs.readFileSync('app.js', 'utf8');
code = code.replace(/const sellersList = computed\(\(\) => users\.value\.filter\(u => u && u\.role === 'seller'\)\);/, "const sellersList = computed(() => users.value.filter(u => u && (u.role === 'seller' || u.role === 'moderator')));");
fs.writeFileSync('app.js', code);
