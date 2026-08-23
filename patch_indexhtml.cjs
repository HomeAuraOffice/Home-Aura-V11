const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove :disabled="isPulling" from username input
html = html.replace(
    /type="text" required placeholder="e\.g\. admin1 or seller1" :disabled="isPulling"/g,
    `type="text" required placeholder="e.g. admin1 or seller1"`
);

// 2. Remove :disabled="isPulling" from password input
html = html.replace(
    /type="password" required placeholder="••••••••" :disabled="isPulling"/g,
    `type="password" required placeholder="••••••••"`
);

// 3. Update button to use isAuthenticating instead of isPulling
html = html.replace(
    /:disabled="isPulling"/g,
    `:disabled="isAuthenticating"`
);

html = html.replace(
    /v-if="isPulling"/g,
    `v-if="isAuthenticating"`
);

html = html.replace(
    /<span>Downloading Database...<\/span>/g,
    `<span>Authenticating...</span>`
);

fs.writeFileSync('index.html', html);
console.log("Patched index.html successfully");
