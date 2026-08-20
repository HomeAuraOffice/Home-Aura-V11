const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/<option value="seller">Seller<\/option>\n\s+<option value="admin">Admin<\/option>/, '<option value="seller">Seller</option>\n                  <option value="moderator">Moderator</option>\n                  <option value="admin">Admin</option>');

code = code.replace(/v-if="modalData.user.role === 'seller'"/, 'v-if="modalData.user.role === \'seller\' || modalData.user.role === \'moderator\'"');

// Navigation tabs
code = code.replace(/currentUser\.role === 'admin'/g, "(currentUser.role === 'admin' || currentUser.role === 'moderator')");

fs.writeFileSync('index.html', code);
