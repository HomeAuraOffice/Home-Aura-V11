const fs = require('fs');

let temp = fs.readFileSync('temp_script.js', 'utf8');

const setupIndex = temp.indexOf('    const { createApp, ref, reactive, computed, onMounted, watch } = Vue;');
if (setupIndex !== -1) {
    let newAppJs = temp.substring(setupIndex);
    fs.writeFileSync('app.js', newAppJs);
    console.log("Restored app.js base!");
} else {
    console.log("Failed to find setup");
}
