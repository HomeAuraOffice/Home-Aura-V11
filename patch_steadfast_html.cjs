const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const steadfastHtml = `            <!-- Steadfast Delivery Analytics Report -->
            <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs mb-6">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Steadfast Delivery Charges & Analytics
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Estimated delivery charges by Steadfast compared against total delivery collected</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>
            </div>

            <!-- Merchant Live Sales Performance vs Target Progress Bars -->`;

html = html.replace("<!-- Merchant Live Sales Performance vs Target Progress Bars -->", steadfastHtml);

fs.writeFileSync('index.html', html);
