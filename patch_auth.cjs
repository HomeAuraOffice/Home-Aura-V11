const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');
app = app.replace(
    /const user = users\.value\.find\(u => u && String\(u\?\.username\) === String\(loginForm\?\.username\) && String\(u\.password\) === String\(loginForm\.password\)\);/,
    "const user = users.value.find(u => u && String(u?.username || '').trim().toLowerCase() === String(loginForm?.username || '').trim().toLowerCase() && String(u?.password || '').trim() === String(loginForm?.password || '').trim());"
);
fs.writeFileSync('app.js', app);
console.log("Patched login");
