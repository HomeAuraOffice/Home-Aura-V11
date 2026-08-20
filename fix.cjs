const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// The bad text is between "// --- ORDER SUBMISSION ---" and "const quickStatusChange"
const startStr = "// --- ORDER SUBMISSION ---";
const endStr = "const quickStatusChange = (order, newStatus) => {";

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const badPart = code.substring(startIndex, endIndex);
  
  // Remove trailing backslashes and fix the double "};"
  let fixedPart = badPart.replace(/\\\n/g, '\n').replace(/\\\r\n/g, '\n');
  fixedPart = fixedPart.replace(/};\s*};\s*$/, '};\n        ');
  
  code = code.substring(0, startIndex) + fixedPart + code.substring(endIndex);
  fs.writeFileSync('index.html', code);
  console.log("Fixed!");
} else {
  console.log("Could not find boundaries");
}
