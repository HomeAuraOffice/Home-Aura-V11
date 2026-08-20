const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const targetHtml = `                <!-- Bulk Delete -->
                <button v-if="selectedOrders.size > 0" @click="bulkDeleteSelected" class="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-md">
                  🗑️ Void Selected ({{ selectedOrders.size }})
                </button>`;

const replacementHtml = `                <!-- Bulk Dispatch -->
                <button v-if="selectedOrders.size > 0" @click="bulkDispatchSelected" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-md">
                  📦 Dispatch Selected ({{ selectedOrders.size }})
                </button>
                <!-- Bulk Delete -->
                <button v-if="selectedOrders.size > 0" @click="bulkDeleteSelected" class="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-md">
                  🗑️ Void Selected ({{ selectedOrders.size }})
                </button>`;

html = html.replace(targetHtml, replacementHtml);
fs.writeFileSync('index.html', html);
