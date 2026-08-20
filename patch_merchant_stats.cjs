const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const newMerchantStats = `        const merchantStats = computed(() => {
          let visibleSellersList = sellersList.value;
          if (currentUser.value?.role === 'marketer' && currentUser.value?.visibleSellers) {
              visibleSellersList = sellersList.value.filter(s => currentUser.value.visibleSellers.includes(s.id));
          }
          // Also apply the dashboard filter for specific user, if active
          if (dashboardFilter.sellerId !== 'all') {
             visibleSellersList = visibleSellersList.filter(s => s.id === dashboardFilter.sellerId);
          } else {
             visibleSellersList = visibleSellersList.filter(s => !s.excludeFromGlobalAnalytics);
          }`;

code = code.replace(/const merchantStats = computed\(\(\) => \{[\s\S]*?if \(dashboardFilter\.sellerId !== 'all'\) \{\s*visibleSellersList = visibleSellersList.filter\(s => s\.id === dashboardFilter\.sellerId\);\s*\}/, newMerchantStats);

fs.writeFileSync('app.js', code);
