const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const billSellerHtml = `
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assign to Specific User (Optional)</label>
                  <select v-model="modalData.bill.sellerId" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900 dark:text-slate-100">
                    <option value="">-- No Specific User (Global) --</option>
                    <option v-for="seller in sellersList" :key="seller.id" :value="seller.id">{{ seller.name }}</option>
                  </select>
                  <p class="text-[10px] text-slate-400 mt-1">If assigned, this bill will only be tracked under their isolated finances.</p>
                </div>
                <div class="grid grid-cols-2 gap-3">
`;

html = html.replace(/<div class="grid grid-cols-2 gap-3">/, billSellerHtml);

const expenseSellerHtml = `
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                    <input type="date" v-model="modalData.expense.date" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900 dark:text-slate-100" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assign to User (Optional)</label>
                    <select v-model="modalData.expense.sellerId" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900 dark:text-slate-100">
                      <option value="">-- Global Expense --</option>
                      <option v-for="seller in sellersList" :key="seller.id" :value="seller.id">{{ seller.name }}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
`;

html = html.replace(/<div class="grid grid-cols-2 gap-4">\s*<div>\s*<label class="block text-\[10px\] font-bold text-slate-500 uppercase tracking-wider mb-1">Date<\/label>[\s\S]*?<div>\s*<label class="block text-\[10px\] font-bold text-slate-500 uppercase tracking-wider mb-1">Category<\/label>/, expenseSellerHtml);

fs.writeFileSync('index.html', html);
