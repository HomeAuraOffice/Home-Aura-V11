const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const filterHtml = `
              <!-- Finance Filters (Synced with Dashboard) -->
              <div class="flex flex-col sm:flex-row gap-4 mb-6">
                <div class="flex-1">
                  <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Time Period</label>
                  <select v-model="dashboardFilter.dateRange" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none">
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Past 7 Days</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
                <div class="flex-1">
                  <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Specific User</label>
                  <select v-model="dashboardFilter.sellerId" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none">
                    <option value="all">All Users</option>
                    <option v-for="seller in sellersList" :key="seller.id" :value="seller.id">{{ seller.name }} (@{{ seller.username }})</option>
                  </select>
                </div>
              </div>
`;

html = html.replace("<!-- Profit Tally -->", filterHtml + "\n              <!-- Profit Tally -->");

fs.writeFileSync('index.html', html);
