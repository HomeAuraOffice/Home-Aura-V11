const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const correctExpenseModal = `            <div v-if="activeModal === 'expenseModal'" class="space-y-4 text-xs">
              <div class="space-y-4">
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
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                    <select v-model="modalData.expense.category" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900 dark:text-slate-100">
                      <option value="Salary">Salary</option>
                      <option value="Rent">Rent</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Factory Payment">Factory Payment Deposit</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount (BDT)</label>
                    <input type="number" v-model="modalData.expense.amount" placeholder="e.g. 15000" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900 dark:text-slate-100" />
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description / Notes</label>
                  <textarea v-model="modalData.expense.description" rows="2" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-900 dark:text-slate-100" placeholder="e.g. October Salary..."></textarea>
                </div>
              </div>
              <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button @click="closeModal" type="button" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all">Cancel</button>
                <button @click="saveExpenseModal" type="button" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20">
                  Save Expense
                </button>
              </div>
            </div>`;

html = html.replace(/<div v-if="activeModal === 'expenseModal'" class="space-y-4 text-xs">[\s\S]*?(?=<!-- ADMIN & SELLER: FULL ORDER & ATTACHMENTS INSPECTION MODAL -->)/, correctExpenseModal + "\n            ");

fs.writeFileSync('index.html', html);
