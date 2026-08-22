const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const injection = `
        const getBstIsoString = (dateInput = new Date()) => {
          const d = new Date(dateInput);
          if (isNaN(d.getTime())) return new Date().toISOString();
          const pad = (n) => String(n).padStart(2, '0');
          const dhakaStr = d.toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour12: false });
          const dhakaDate = new Date(dhakaStr);
          const year = dhakaDate.getFullYear();
          const month = pad(dhakaDate.getMonth() + 1);
          const day = pad(dhakaDate.getDate());
          const hours = pad(dhakaDate.getHours());
          const minutes = pad(dhakaDate.getMinutes());
          const seconds = pad(dhakaDate.getSeconds());
          return \`\${year}-\${month}-\${day}T\${hours}:\${minutes}:\${seconds}+06:00\`;
        };
`;

if (!code.includes('const getBstIsoString =')) {
    code = code.replace(
        /const getBstDateString =/,
        injection.trim() + "\n        const getBstDateString ="
    );
}

// Replace new Date().toISOString() in Vue app (before line 3350)
const lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (i < 3340) {
        lines[i] = lines[i].replace(/new Date\(\)\.toISOString\(\)/g, "getBstIsoString()");
        lines[i] = lines[i].replace(/getBangladeshTimeString\(new Date\(\)\)/g, "getBstIsoString()");
    }
}

fs.writeFileSync('app.js', lines.join('\n'));
console.log("Patched getBstIsoString");
