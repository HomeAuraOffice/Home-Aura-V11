const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const dashboardFilterCode = `
        const dashboardFilter = reactive({
          dateRange: 'all',
          sellerId: 'all'
        });

        const filterOrdersForDashboard = (orderList) => {
          return orderList.filter(o => {
            // Apply seller filter
            if (dashboardFilter.sellerId !== 'all') {
              if (o.merchantId !== dashboardFilter.sellerId) return false;
            }
            
            // Apply date filter
            if (dashboardFilter.dateRange !== 'all' && o.createdAt) {
              const orderDate = new Date(o.createdAt);
              const now = new Date();
              if (dashboardFilter.dateRange === 'today') {
                if (orderDate.toDateString() !== now.toDateString()) return false;
              } else if (dashboardFilter.dateRange === 'week') {
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                if (orderDate < oneWeekAgo) return false;
              } else if (dashboardFilter.dateRange === 'month') {
                if (orderDate.getMonth() !== now.getMonth() || orderDate.getFullYear() !== now.getFullYear()) return false;
              }
            }
            return true;
          });
        };
`;

code = code.replace(/const metrics = computed/, dashboardFilterCode + '\n        const metrics = computed');

const oldMetrics = `        const metrics = computed(() => {
          const grossRevenue = orders.value.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
          const deliveredProductsRevenue = orders.value.filter(o => o.status === 'Delivered' || o.status === 'Partial Delivered').reduce((acc, o) => acc + (o.saleAmount || 0), 0);
          const deliveredCount = orders.value.filter(o => o.status === 'Delivered').length;
          const pendingCount = orders.value.filter(o => o.status !== 'Delivered' && o.status !== 'Returned Received').length;
          const urgentCount = orders.value.filter(o => o.urgent).length;
          return { grossRevenue, deliveredProductsRevenue, deliveredCount, pendingCount, urgentCount };
        });`;
        
const newMetrics = `        const metrics = computed(() => {
          const filteredOrders = filterOrdersForDashboard(orders.value);
          const grossRevenue = filteredOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
          const deliveredProductsRevenue = filteredOrders.filter(o => o.status === 'Delivered' || o.status === 'Partial Delivered').reduce((acc, o) => acc + (o.saleAmount || 0), 0);
          const deliveredCount = filteredOrders.filter(o => o.status === 'Delivered').length;
          const pendingCount = filteredOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Returned Received').length;
          const urgentCount = filteredOrders.filter(o => o.urgent).length;
          return { grossRevenue, deliveredProductsRevenue, deliveredCount, pendingCount, urgentCount };
        });`;

code = code.replace(oldMetrics, newMetrics);

fs.writeFileSync('app.js', code);
