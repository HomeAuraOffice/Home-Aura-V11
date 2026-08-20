const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

code = code.replace(/const appsScriptUrl = ref\\(localStorage\\.getItem\\('homeaura_apps_script_url'\\) \\|\\| '[^']*'\\);/, "const appsScriptUrl = ref(localStorage.getItem('homeaura_apps_script_url') || 'https://script.google.com/macros/s/AKfycbzLixNthxgqReboKXMfkLJSAz1baSXPw69ed9Lf2WxJBKtCrUzeOUzqawMf_tbn-da74Q/exec');\n        const backupFrequency = ref(localStorage.getItem('homeaura_backup_frequency') || '6');");

fs.writeFileSync('app.js', code);
