const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

code = code.replace(/u => u\.username === currentUser\.value\.username/g, "u => u && u.username === currentUser.value.username");
code = code.replace(/u => u\.username === user\.username/g, "u => u && u.username === user.username");
code = code.replace(/u => String\(u\.username\) === uname/g, "u => u && String(u.username) === uname");
code = code.replace(/u => String\(u\.username\) === String\(loginForm\.username\)/g, "u => u && String(u.username) === String(loginForm.username)");
code = code.replace(/u => u\.username === modalData\.user\.username/g, "u => u && u.username === modalData.user.username");

fs.writeFileSync('app.js', code);
