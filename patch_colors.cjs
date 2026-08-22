const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The string to replace (in the sidebar nav):
// :class="activeTab === 'dashboard' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'"

// We want to replace these carefully only in the sidebar block (lines 200 to 260).
// Since the sidebar nav has unique buttons, we can do a global replace for this exact pattern:
// But payables_audit has emerald, and trash has rose.

const replacements = [
  {
    regex: /'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'/g,
    replacement: "'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 font-medium'"
  },
  {
    regex: /'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'/g,
    replacement: "'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 font-medium'"
  },
  {
    regex: /'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'/g,
    replacement: "'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 font-medium'"
  }
];

let lines = html.split('\n');
for (let i = 210; i < 270; i++) {
  if (lines[i]) {
    for (const r of replacements) {
      lines[i] = lines[i].replace(r.regex, r.replacement);
    }
  }
}

fs.writeFileSync('index.html', lines.join('\n'));
console.log('Sidebar styles updated');
