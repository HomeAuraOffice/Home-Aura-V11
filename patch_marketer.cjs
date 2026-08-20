const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// Patch handleLogin
code = code.replace(/activeTab\.value = user\.role === 'admin' \? 'dashboard' \: 'intake';/, "activeTab.value = (user.role === 'admin' || user.role === 'marketer' || user.role === 'moderator') ? 'dashboard' : 'intake';");

// Patch session restore
code = code.replace(/activeTab\.value = freshUser\.role === 'admin' \? 'dashboard' \: 'intake';/, "activeTab.value = (freshUser.role === 'admin' || freshUser.role === 'marketer' || freshUser.role === 'moderator') ? 'dashboard' : 'intake';");

// Add estimateSteadfastCharge and steadfastReport
const steadfastCode = `
        const estimateSteadfastCharge = (order) => {
          let weight = 10;
          const cat = (order.productCategory || '').toLowerCase();
          if (cat.includes('sofa')) weight = 50;
          else if (cat.includes('bed')) weight = 80;
          else if (cat.includes('dining')) weight = 60;
          else if (cat.includes('wardrobe') || cat.includes('almirah')) weight = 70;
          
          const addr = (order.customerAddress || '').toLowerCase();
          let base = 130;
          let perKg = 20;
          if (addr.includes('dhaka') && !addr.includes('outside')) {
            if (addr.includes('savar') || addr.includes('gazipur') || addr.includes('keraniganj') || addr.includes('narayanganj')) {
              base = 100;
              perKg = 15;
            } else {
              base = 70;
              perKg = 10;
            }
          }
          
          return base + (weight - 1) * perKg;
        };

        const steadfastReport = computed(() => {
          let totalSales = 0;
          let totalDeliveryCollected = 0;
          let totalSteadfastCharge = 0;
          
          const relevantOrders = orders.value.filter(o => o.status !== 'Void' && o.status !== 'Returned Received');
          
          relevantOrders.forEach(o => {
            totalSales += (Number(o.saleAmount) || 0);
            totalDeliveryCollected += (Number(o.deliveryCharge) || 0);
            totalSteadfastCharge += estimateSteadfastCharge(o);
          });
          
          return {
            totalSales,
            totalDeliveryCollected,
            totalSteadfastCharge,
            profitOnDelivery: totalDeliveryCollected - totalSteadfastCharge
          };
        });
`;
code = code.replace(/const merchantStats = computed\(\(\) => \{/, steadfastCode + '\n        const merchantStats = computed(() => {');

// Patch merchantStats
const oldMerchantStats = `        const merchantStats = computed(() => {
          return sellersList.value.map(seller => {
            const sellerOrders = orders.value.filter(o => o.merchantName === seller.name || o.merchantId === seller.id);
            const totalSales = sellerOrders.reduce((acc, o) => acc + (o.saleAmount || 0), 0);
            const target = seller.target || 300000;
            const percentage = target > 0 ? Math.round((totalSales / target) * 100) : 0;
            return {
              username: seller.username,
              name: seller.name,
              totalOrders: sellerOrders.length,
              totalSales,
              target,
              percentage
            };
          });
        });`;

const newMerchantStats = `        const merchantStats = computed(() => {
          let visibleSellersList = sellersList.value;
          if (currentUser.value?.role === 'marketer' && currentUser.value?.visibleSellers) {
              visibleSellersList = sellersList.value.filter(s => currentUser.value.visibleSellers.includes(s.id));
          }
          return visibleSellersList.map(seller => {
            const sellerOrders = orders.value.filter(o => o.merchantName === seller.name || o.merchantId === seller.id);
            const totalSales = sellerOrders.reduce((acc, o) => acc + (Number(o.saleAmount) || 0), 0);
            const target = seller.target || 300000;
            const percentage = target > 0 ? Math.round((totalSales / target) * 100) : 0;
            return {
              username: seller.username,
              name: seller.name,
              totalOrders: sellerOrders.length,
              totalSales,
              target,
              percentage
            };
          });
        });`;
code = code.replace(oldMerchantStats, newMerchantStats);

// Patch openAddUserModal
code = code.replace(/modalData\.user = reactive\(\{ name: '', username: '', password: '1234', role: 'seller', active: true, target: 300000 \}\);/, "modalData.user = reactive({ name: '', username: '', password: '1234', role: 'seller', active: true, target: 300000, visibleSellers: [] });");

// Patch openEditUserModal
code = code.replace(/modalData\.user = reactive\(\{ \.\.\.user \}\);/, "modalData.user = reactive({ ...user, visibleSellers: user.visibleSellers || [] });");

// Add steadfastReport to return
code = code.replace(/merchantStats,/, "merchantStats, steadfastReport,");

fs.writeFileSync('app.js', code);
