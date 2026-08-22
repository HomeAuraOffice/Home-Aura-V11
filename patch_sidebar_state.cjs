const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

if (!code.includes('isSidebarCollapsed')) {
    code = code.replace(
        "const activeTab = ref('dashboard');",
        "const activeTab = ref('dashboard');\n        const isSidebarCollapsed = ref(false);"
    );
    code = code.replace(
        "activeTab,",
        "activeTab, isSidebarCollapsed,"
    );
    fs.writeFileSync('app.js', code);
    console.log("Patched app.js for sidebar state");
} else {
    console.log("Already patched");
}
