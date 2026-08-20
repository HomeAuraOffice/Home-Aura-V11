const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const target = "const appsScriptUrl = ref(localStorage.getItem('homeaura_apps_script_url') || 'https://script.google.com/macros/s/AKfycbzLixNthxgqReboKXMfkLJSAz1baSXPw69ed9Lf2WxJBKtCrUzeOUzqawMf_tbn-da74Q/exec');";
const replacement = target + "\n        const backupFrequency = ref(localStorage.getItem('homeaura_backup_frequency') || '6');";

code = code.replace(target, replacement);
fs.writeFileSync('app.js', code);
