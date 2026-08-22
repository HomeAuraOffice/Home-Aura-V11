const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8').split('\n');
let depth = 0;
for (let i = 0; i < code.length; i++) {
  const line = code[i];
  for (const char of line) {
    if (char === '{') depth++;
    if (char === '}') depth--;
  }
  if (line.match(/const \w+ = .*=> {/)) {
     console.log(`[D:${depth}] Func start at ${i+1}: ${line.trim()}`);
  }
  if (line.trim() === '};') {
     console.log(`[D:${depth}] Func end around ${i+1}`);
  }
}
