const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const roleOptions = `                <select v-model="modalData.user.role" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl font-semibold text-slate-900 dark:text-slate-100 focus:outline-none">
                  <option value="seller">Seller</option>
                  <option value="moderator">Moderator</option>
                  <option value="marketer">Digital Marketer</option>
                  <option value="admin">Admin</option>
                </select>`;

html = html.replace(/<select v-model="modalData.user.role"[\s\S]*?<\/select>/, roleOptions);

const visibleSellersHtml = `              <div v-if="modalData.user.role === 'seller' || modalData.user.role === 'moderator'">
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Target Goal (BDT)</label>
                <input v-model.number="modalData.user.target" type="number" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none" />
              </div>
              <div v-if="modalData.user.role === 'marketer'">
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-2">Visible Sellers for Analytics</label>
                <div class="space-y-2 max-h-40 overflow-y-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                  <label v-for="seller in sellersList" :key="seller.id" class="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" :value="seller.id" v-model="modalData.user.visibleSellers" class="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900 w-4 h-4" />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ seller.name }} (@{{ seller.username }})</span>
                  </label>
                  <div v-if="sellersList.length === 0" class="text-xs text-slate-500">No sellers available.</div>
                </div>
              </div>`;

html = html.replace(/<div v-if="modalData.user.role === 'seller' \|\| modalData.user.role === 'moderator'">[\s\S]*?<\/div>/, visibleSellersHtml);

fs.writeFileSync('index.html', html);
