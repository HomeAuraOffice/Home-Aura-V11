const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Update processCollageFile to use Object URL for local preview
appJs = appJs.replace(
  /targetObj\.collagePhotoLocalUrl = base64Data;/g,
  "targetObj.collagePhotoLocalUrl = URL.createObjectURL(file);"
);
appJs = appJs.replace(
  /targetObj\.socialProofLocalUrl = base64Data;/g,
  "targetObj.socialProofLocalUrl = URL.createObjectURL(file);"
);

fs.writeFileSync('app.js', appJs);
console.log('Done patch 22');
