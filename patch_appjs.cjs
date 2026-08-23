const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Add isAuthenticating
app = app.replace(
    /const isPulling = ref\(false\);/,
    "const isPulling = ref(false);\n        const isAuthenticating = ref(false);"
);

// 2. Replace handleLogin
const oldHandleLogin = `        const handleLogin = () => {
          loginError.value = '';
          const user = users.value.find(u => u && String(u?.username || '').trim().toLowerCase() === String(loginForm?.username || '').trim().toLowerCase() && String(u?.password || '').trim() === String(loginForm?.password || '').trim());
          if (!user) {
            loginError.value = 'Invalid username or password.';
            return;
          }
          if (!user.active) {
            loginError.value = 'Account is suspended. Contact Administrator.';
            return;
          }
          currentUser.value = user;
          localStorage.setItem('homeaura_session', JSON.stringify(user));
          activeTab.value = (user.role === 'admin' || user.role === 'marketer' || user.role === 'moderator') ? 'dashboard' : 'intake';
          loginForm.username = '';
          loginForm.password = '';
        };`;

const newHandleLogin = `        const handleLogin = async () => {
          loginError.value = '';
          isAuthenticating.value = true;
          
          let user = users.value.find(u => u && String(u?.username || '').trim().toLowerCase() === String(loginForm?.username || '').trim().toLowerCase() && String(u?.password || '').trim() === String(loginForm?.password || '').trim());
          
          if (!user && appsScriptUrl.value) {
            if (!isPulling.value) {
              await syncFromGoogleSheets(false);
            } else {
              while (isPulling.value) {
                await new Promise(r => setTimeout(r, 200));
              }
            }
            user = users.value.find(u => u && String(u?.username || '').trim().toLowerCase() === String(loginForm?.username || '').trim().toLowerCase() && String(u?.password || '').trim() === String(loginForm?.password || '').trim());
          }
          
          isAuthenticating.value = false;

          if (!user) {
            loginError.value = 'Invalid username or password.';
            return;
          }
          if (!user.active) {
            loginError.value = 'Account is suspended. Contact Administrator.';
            return;
          }
          currentUser.value = user;
          localStorage.setItem('homeaura_session', JSON.stringify(user));
          activeTab.value = (user.role === 'admin' || user.role === 'marketer' || user.role === 'moderator') ? 'dashboard' : 'intake';
          loginForm.username = '';
          loginForm.password = '';
        };`;

app = app.replace(oldHandleLogin, newHandleLogin);

// 3. Export isAuthenticating
app = app.replace(
    /isTestingSync,/,
    "isTestingSync,\n          isAuthenticating,"
);

fs.writeFileSync('app.js', app);
console.log("Patched app.js successfully");
