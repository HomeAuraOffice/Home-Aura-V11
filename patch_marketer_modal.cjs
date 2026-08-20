const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetHtml = `<div v-if="modalData.user.role === 'marketer'">
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-2">Visible Sellers for Analytics</label>
                <div class="space-y-2 max-h-40 overflow-y-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                  <label v-for="seller in sellersList" :key="seller.id" class="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" :value="seller.id" v-model="modalData.user.visibleSellers" class="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900 w-4 h-4" />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ seller.name }} (@{{ seller.username }})</span>
                  </label>
                  <div v-if="sellersList.length === 0" class="text-xs text-slate-500">No sellers available.</div>
                </div>
              </div>`;

const replaceHtml = `<div v-if="modalData.user.role === 'marketer'" class="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div class="mb-3">
                  <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assigned Sellers</label>
                  <p class="text-[10px] text-slate-400">Select which sellers this marketer manages. They will only see performance data for these accounts.</p>
                </div>
                
                <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  <label v-for="seller in sellersList" :key="seller.id" 
                         class="flex items-center justify-between p-2.5 border rounded-xl cursor-pointer transition-all"
                         :class="modalData.user.visibleSellers && modalData.user.visibleSellers.includes(seller.id) ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800' : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-lg font-bold text-[10px] flex items-center justify-center"
                           :class="modalData.user.visibleSellers && modalData.user.visibleSellers.includes(seller.id) ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'">
                        {{ seller.name.substring(0, 2).toUpperCase() }}
                      </div>
                      <div class="flex flex-col">
                        <span class="text-xs font-bold" :class="modalData.user.visibleSellers && modalData.user.visibleSellers.includes(seller.id) ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300'">{{ seller.name }}</span>
                        <span class="text-[9px]" :class="modalData.user.visibleSellers && modalData.user.visibleSellers.includes(seller.id) ? 'text-indigo-600/70 dark:text-indigo-400/70' : 'text-slate-500 dark:text-slate-400'">@{{ seller.username }}</span>
                      </div>
                    </div>
                    <input type="checkbox" :value="seller.id" v-model="modalData.user.visibleSellers" class="hidden" />
                    <div class="w-4 h-4 rounded-full border flex items-center justify-center transition-colors"
                         :class="modalData.user.visibleSellers && modalData.user.visibleSellers.includes(seller.id) ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800'">
                      <svg v-if="modalData.user.visibleSellers && modalData.user.visibleSellers.includes(seller.id)" class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </label>
                  <div v-if="sellersList.length === 0" class="col-span-2 text-xs text-slate-500 p-4 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">No sellers available yet.</div>
                </div>
              </div>`;

html = html.replace(targetHtml, replaceHtml);
fs.writeFileSync('index.html', html);
