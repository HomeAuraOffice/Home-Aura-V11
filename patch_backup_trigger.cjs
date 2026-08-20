const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const backupUi = `
              <!-- AUTOMATED GOOGLE DRIVE BACKUP -->
              <div class="mt-8 pt-6 border-t border-indigo-200/50 dark:border-indigo-800/50">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h4 class="text-sm font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                    <span>☁️ Automated Google Drive Backup</span>
                  </h4>
                </div>
                <p class="text-[11px] text-indigo-700 dark:text-indigo-300 mb-4 max-w-3xl leading-relaxed">
                  Configure the Google Apps Script to automatically save a copy of the Google Sheet into a <strong>HomeAura_Backups</strong> folder in your Google Drive at the specified frequency.
                </p>
                <div class="flex flex-col sm:flex-row gap-2">
                  <select v-model="backupFrequency" class="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100">
                    <option value="0">Off (Manual Only)</option>
                    <option value="1">Every 1 Hour</option>
                    <option value="6">Every 6 Hours</option>
                    <option value="12">Every 12 Hours</option>
                    <option value="24">Every 24 Hours</option>
                  </select>
                  <button @click="updateBackupFrequency" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    Apply Backup Schedule
                  </button>
                </div>
              </div>
`;

html = html.replace('<!-- NOTIFICATION WA GROUP -->', backupUi + '\n              <!-- NOTIFICATION WA GROUP -->');
fs.writeFileSync('index.html', html);
