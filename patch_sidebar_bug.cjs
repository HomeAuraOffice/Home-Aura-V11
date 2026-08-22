const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Fix the watch statement
code = code.replace(
  'watch(activeTab, isSidebarCollapsed, (val) => {',
  'watch(activeTab, (val) => {'
);

// 2. Expose isSidebarCollapsed in the return object
if (!code.includes('isSidebarCollapsed,')) {
    code = code.replace(
      'activeTab,',
      'activeTab, isSidebarCollapsed,'
    );
}

fs.writeFileSync('app.js', code);
console.log("Patched sidebar bug");
