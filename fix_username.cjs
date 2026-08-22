const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');
code = code.replace(/modalData\.user\.username/g, 'modalData.user?.username');
code = code.replace(/user\.username/g, 'user?.username');
code = code.replace(/currentUser\.value\.username/g, 'currentUser.value?.username');
code = code.replace(/seller\.username/g, 'seller?.username');
code = code.replace(/loginForm\.username/g, 'loginForm?.username');
fs.writeFileSync('app.js', code);
