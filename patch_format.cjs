const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const oldFormat = `const formatBangladeshDisplayTime = (isoOrDate) => {
          if (!isoOrDate) return 'N/A';
          try {
            const d = new Date(isoOrDate);
            if (isNaN(d.getTime())) return String(isoOrDate);
            return d.toLocaleString('en-GB', {
               timeZone: 'Asia/Dhaka',
               day: '2-digit', month: 'short', year: 'numeric',
               hour: '2-digit', minute: '2-digit', hour12: true
            });
          } catch(e) {
            return String(isoOrDate);
          }
        };`;

const newFormat = `const formatBangladeshDisplayTime = (isoOrDate) => {
          if (!isoOrDate) return 'N/A';
          try {
            let str = String(isoOrDate);
            if (str.length >= 16 && str.length <= 19 && !str.includes('T') && !str.includes('+') && !str.includes('Z')) {
               str = str.replace(' ', 'T') + '+06:00';
            }
            const d = new Date(str);
            if (isNaN(d.getTime())) return String(isoOrDate);
            return d.toLocaleString('en-GB', {
               timeZone: 'Asia/Dhaka',
               day: '2-digit', month: 'short', year: 'numeric',
               hour: '2-digit', minute: '2-digit', hour12: true
            });
          } catch(e) {
            return String(isoOrDate);
          }
        };`;

code = code.replace(oldFormat, newFormat);
fs.writeFileSync('app.js', code);
console.log("Patched formatBangladeshDisplayTime");
