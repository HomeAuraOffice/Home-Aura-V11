const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const regex = /const totalFactoryBillsAmount = computed\([\s\S]*?const sellerBillStats = computed\(/;

const totalBillsReplacer = `const totalFactoryBillsAmount = computed(() => {
          let bills = factoryBills.value;
          
          if (dashboardFilter.sellerId !== 'all') {
            bills = bills.filter(b => b.sellerId === dashboardFilter.sellerId);
          } else {
            bills = bills.filter(b => {
              if (b.sellerId) {
                const seller = users.value.find(u => u.id === b.sellerId);
                if (seller && seller.excludeFromGlobalAnalytics) return false;
              }
              return true;
            });
          }

          if (dashboardFilter.dateRange !== 'all') {
            bills = bills.filter(b => {
              if (!b.date) return true;
              const d = new Date(b.date);
              const now = new Date();
              if (dashboardFilter.dateRange === 'today') return d.toDateString() === now.toDateString();
              if (dashboardFilter.dateRange === 'week') return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              if (dashboardFilter.dateRange === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              return true;
            });
          }
          return bills.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
        });

        const totalOperationalExpenses = computed(() => {
          let exps = expenses.value;
          
          if (dashboardFilter.sellerId !== 'all') {
            exps = exps.filter(e => e.sellerId === dashboardFilter.sellerId);
          } else {
            exps = exps.filter(e => {
              if (e.sellerId) {
                const seller = users.value.find(u => u.id === e.sellerId);
                if (seller && seller.excludeFromGlobalAnalytics) return false;
              }
              return true;
            });
          }

          if (dashboardFilter.dateRange !== 'all') {
            exps = exps.filter(e => {
              if (!e.date) return true;
              const d = new Date(e.date);
              const now = new Date();
              if (dashboardFilter.dateRange === 'today') return d.toDateString() === now.toDateString();
              if (dashboardFilter.dateRange === 'week') return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              if (dashboardFilter.dateRange === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              return true;
            });
          }
          return exps.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        });

        const sellerBillStats = computed(`;

code = code.replace(regex, totalBillsReplacer);
fs.writeFileSync('app.js', code);
