const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const oldSteadfast = `        const estimateSteadfastCharge = (order) => {
          let weight = 10;
          const cat = (order.productCategory || '').toLowerCase();
          if (cat.includes('sofa')) weight = 50;
          else if (cat.includes('bed')) weight = 80;
          else if (cat.includes('dining')) weight = 60;
          else if (cat.includes('wardrobe') || cat.includes('almirah')) weight = 70;`;

const newSteadfast = `        const estimateSteadfastCharge = (order) => {
          let weight = 2; // Default for sofa covers
          const cat = (order.productCategory || '').toLowerCase();
          if (cat.includes('sofa') && !cat.includes('cover')) weight = 50;
          else if (cat.includes('bed')) weight = 80;
          else if (cat.includes('dining')) weight = 60;
          else if (cat.includes('wardrobe') || cat.includes('almirah')) weight = 70;`;

code = code.replace(oldSteadfast, newSteadfast);

const oldSteadfastReport = `        const steadfastReport = computed(() => {
          let totalSales = 0;
          let totalDeliveryCollected = 0;
          let totalSteadfastCharge = 0;
          
          const relevantOrders = orders.value.filter(o => o.status !== 'Void' && o.status !== 'Returned Received');
          
          relevantOrders.forEach(o => {
            totalSales += (Number(o.saleAmount) || 0);
            totalDeliveryCollected += (Number(o.deliveryCharge) || 0);
            totalSteadfastCharge += estimateSteadfastCharge(o);
          });`;
          
const newSteadfastReport = `        const steadfastReport = computed(() => {
          let totalSales = 0;
          let totalDeliveryCollected = 0;
          let totalSteadfastCharge = 0;
          
          const filteredOrders = filterOrdersForDashboard(orders.value);
          const relevantOrders = filteredOrders.filter(o => o.status !== 'Void' && o.status !== 'Returned Received');
          
          relevantOrders.forEach(o => {
            totalSales += (Number(o.saleAmount) || 0);
            totalDeliveryCollected += (Number(o.deliveryCharge) || 0);
            totalSteadfastCharge += estimateSteadfastCharge(o);
          });`;

code = code.replace(oldSteadfastReport, newSteadfastReport);

const oldMerchantStats = `        const merchantStats = computed(() => {
          let visibleSellersList = sellersList.value;
          if (currentUser.value?.role === 'marketer' && currentUser.value?.visibleSellers) {
              visibleSellersList = sellersList.value.filter(s => currentUser.value.visibleSellers.includes(s.id));
          }
          return visibleSellersList.map(seller => {
            const sellerOrders = orders.value.filter(o => o.merchantName === seller.name || o.merchantId === seller.id);`;

const newMerchantStats = `        const merchantStats = computed(() => {
          let visibleSellersList = sellersList.value;
          if (currentUser.value?.role === 'marketer' && currentUser.value?.visibleSellers) {
              visibleSellersList = sellersList.value.filter(s => currentUser.value.visibleSellers.includes(s.id));
          }
          // Also apply the dashboard filter for specific user, if active
          if (dashboardFilter.sellerId !== 'all') {
             visibleSellersList = visibleSellersList.filter(s => s.id === dashboardFilter.sellerId);
          }
          const filteredOrders = filterOrdersForDashboard(orders.value);
          return visibleSellersList.map(seller => {
            const sellerOrders = filteredOrders.filter(o => o.merchantName === seller.name || o.merchantId === seller.id);`;

code = code.replace(oldMerchantStats, newMerchantStats);

code = code.replace("merchantStats, steadfastReport,", "merchantStats, steadfastReport, dashboardFilter,");

fs.writeFileSync('app.js', code);
