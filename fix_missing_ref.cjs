const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const target = `        const deletedOrders = ref([]);
        const selectedOrders = ref(new Set());`;
const replacement = `        const deletedOrders = ref([]);
        const selectedOrders = ref(new Set());
        const pendingDeletes = ref(JSON.parse(localStorage.getItem('homeaura_pending_deletes')) || { orders: [], deletedOrders: [], factoryBills: [], expenses: [] });
        const savePendingDeletes = () => localStorage.setItem('homeaura_pending_deletes', JSON.stringify(pendingDeletes.value));`;

code = code.replace(target, replacement);

// Wait, I should also make sure pendingDeletes gets cleared on sync success. 
// Let's check if the previous replacement for the success clear worked.
fs.writeFileSync('app.js', code);
