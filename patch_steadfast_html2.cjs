const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const updatedSteadfastHtml = `              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700">
                  <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Sellers Price</div>
                  <div class="text-xl font-black text-slate-900 dark:text-slate-100">{{ formatBDT(steadfastReport.totalSales) }}</div>
                </div>
                
                <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700">
                  <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Delivery Collected</div>
                  <div class="text-xl font-black text-slate-900 dark:text-slate-100">{{ formatBDT(steadfastReport.totalDeliveryCollected) }}</div>
                </div>
                
                <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700">
                  <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Steadfast Estimated Cost</div>
                  <div class="text-xl font-black text-rose-600 dark:text-rose-400">{{ formatBDT(steadfastReport.totalSteadfastCharge) }}</div>
                </div>
                
                <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700 relative overflow-hidden">
                  <div class="absolute inset-0 bg-indigo-500 opacity-[0.02]"></div>
                  <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Net Delivery Balance</div>
                  <div class="text-xl font-black" :class="steadfastReport.profitOnDelivery >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
                    {{ steadfastReport.profitOnDelivery > 0 ? '+' : '' }}{{ formatBDT(steadfastReport.profitOnDelivery) }}
                  </div>
                </div>
              </div>`;

html = html.replace(/<div class="grid grid-cols-1 md:grid-cols-3 gap-4">[\s\S]*?<\/div>\n            <\/div>/, updatedSteadfastHtml + "\n            </div>");

fs.writeFileSync('index.html', html);
