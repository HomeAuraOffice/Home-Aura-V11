const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const filterLogic = `
        const totalFactoryBillsAmount = computed(() => {
          let bills = factoryBills.value;
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
`;

code = code.replace(/const totalFactoryBillsAmount = computed\([\s\S]*?const totalOperationalExpenses = computed\([\s\S]*?\}\);/, filterLogic);

fs.writeFileSync('app.js', code);
