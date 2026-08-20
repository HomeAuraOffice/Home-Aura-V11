const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/<div class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ u.name }}<\/div>/, '<div class="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">{{ u.name }} <span v-if="isUserOnline(u.lastActive)" class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" title="Online now"></span><span v-else-if="u.lastActive" class="text-[9px] font-normal text-slate-400">({{ new Date(u.lastActive).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }})</span></div>');
fs.writeFileSync('index.html', code);
