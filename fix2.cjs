const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const targetStr = `          // Automatically copy ONLY the image to clipboard`;
const endStr = `          window.open(waUrl, '_blank');`;

const startIndex = code.indexOf(targetStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const patch = fs.readFileSync('patch2.js', 'utf8');
  code = code.substring(0, startIndex) + "          // Automatically copy ONLY the image to clipboard\n" + patch + code.substring(endIndex);
  fs.writeFileSync('index.html', code);
  console.log("Fixed part 2!");
} else {
  console.log("Could not find boundaries");
}
