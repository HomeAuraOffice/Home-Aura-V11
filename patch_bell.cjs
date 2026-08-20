const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const bellHtml = `
            <!-- Notifications Bell -->
            <button @click="isTasksPanelOpen = true" type="button" title="Tasks & Notifications" class="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xs">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span v-if="unreadNotificationsCount > 0" class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900 shadow-sm">{{ unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount }}</span>
            </button>
`;

code = code.replace(/<!-- Top Dark Mode Button -->/, bellHtml + '\n            <!-- Top Dark Mode Button -->');
fs.writeFileSync('index.html', code);
