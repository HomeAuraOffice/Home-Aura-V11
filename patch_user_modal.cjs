const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const isolatedHtml = `                            <div v-if="modalData.user.role === 'seller'">
                <label class="flex items-center space-x-3 cursor-pointer mt-4 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <input type="checkbox" v-model="modalData.user.excludeFromGlobalAnalytics" class="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900 w-4 h-4" />
                  <div>
                    <span class="text-sm font-bold text-slate-700 dark:text-slate-300 block">Isolated Finance User</span>
                    <span class="text-[10px] text-slate-500 block mt-0.5">Exclude this user's data from global analytics unless explicitly selected.</span>
                  </div>
                </label>
              </div>`;

html = html.replace(/<div v-if="modalData\.user\.role === 'seller' \|\| modalData\.user\.role === 'moderator'">/, isolatedHtml + "\n              <div v-if=\"modalData.user.role === 'seller' || modalData.user.role === 'moderator'\">");

fs.writeFileSync('index.html', html);
