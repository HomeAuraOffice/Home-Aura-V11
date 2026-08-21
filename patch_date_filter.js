const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// We will inject the getBstDateString function near formatBangladeshDisplayTime
if (!code.includes('const getBstDateString =')) {
  code = code.replace(
    /const formatBangladeshDisplayTime = \(isoOrDate\) => \{/,
    "const getBstDateString = (isoOrDate) => { if (!isoOrDate) return ''; const d = new Date(isoOrDate); if (isNaN(d.getTime())) return ''; return new Date(d.getTime() + (6 * 60 * 60 * 1000)).toISOString().split('T')[0]; };\n        const formatBangladeshDisplayTime = (isoOrDate) => {"
  );
}

// Replace the filter in filterOrdersForDashboard
code = code.replace(
/if \(dashboardFilter\.dateRange !== 'all' && o\.createdAt\) \{\s+const orderDate = new Date\(o\.createdAt\);\s+const now = new Date\(\);\s+if \(dashboardFilter\.dateRange === 'today'\) \{\s+if \(orderDate\.toDateString\(\) !== now\.toDateString\(\)\) return false;\s+\} else if \(dashboardFilter\.dateRange === 'week'\) \{\s+const oneWeekAgo = new Date\(now\.getTime\(\) - 7 \* 24 \* 60 \* 60 \* 1000\);\s+if \(orderDate < oneWeekAgo\) return false;\s+\} else if \(dashboardFilter\.dateRange === 'month'\) \{\s+if \(orderDate\.getMonth\(\) !== now\.getMonth\(\) \|\| orderDate\.getFullYear\(\) !== now\.getFullYear\(\)\) return false;\s+\}\s+\}/,
`if (dashboardFilter.dateRange !== 'all' && o.createdAt) {
              const orderDate = new Date(o.createdAt);
              const now = new Date();
              const orderBst = getBstDateString(orderDate);
              const nowBst = getBstDateString(now);
              if (dashboardFilter.dateRange === 'today') {
                if (orderBst !== nowBst) return false;
              } else if (dashboardFilter.dateRange === 'week') {
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                if (orderDate < oneWeekAgo) return false;
              } else if (dashboardFilter.dateRange === 'month') {
                if (orderBst.substring(0, 7) !== nowBst.substring(0, 7)) return false;
              }
            }`
);

// Replace filter for bills
code = code.replace(
/if \(dashboardFilter\.dateRange === 'today'\) return d\.toDateString\(\) === now\.toDateString\(\);\s+if \(dashboardFilter\.dateRange === 'week'\) return d >= new Date\(now\.getTime\(\) - 7 \* 24 \* 60 \* 60 \* 1000\);\s+if \(dashboardFilter\.dateRange === 'month'\) return d\.getMonth\(\) === now\.getMonth\(\) && d\.getFullYear\(\) === now\.getFullYear\(\);/g,
`const dBst = getBstDateString(d);
              const nowBst = getBstDateString(now);
              if (dashboardFilter.dateRange === 'today') return dBst === nowBst;
              if (dashboardFilter.dateRange === 'week') return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              if (dashboardFilter.dateRange === 'month') return dBst.substring(0, 7) === nowBst.substring(0, 7);`
);

fs.writeFileSync('app.js', code);
console.log("Patched app.js date filters");
