const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find the second <script> tag which contains the Vue logic
const scriptStart = html.indexOf('<script>', html.indexOf('<script>') + 1);
const scriptEnd = html.lastIndexOf('</script>');

if (scriptStart !== -1 && scriptEnd !== -1) {
    const vueCode = html.substring(scriptStart + 8, scriptEnd);
    fs.writeFileSync('app.js', vueCode);
    
    html = html.substring(0, scriptStart) + '<script src="/app.js"></script>' + html.substring(scriptEnd + 9);
    fs.writeFileSync('index.html', html);
    console.log("Successfully extracted app.js");
} else {
    console.log("Could not find script block");
}
