const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

if (!code.includes('formatBangladeshDisplayTime,')) {
    code = code.replace(
        /getBillOrdersTotalSale,/,
        "formatBangladeshDisplayTime,\n          getBillOrdersTotalSale,"
    );
    fs.writeFileSync('app.js', code);
    console.log("Exposed formatBangladeshDisplayTime");
} else {
    console.log("Already exposed");
}
