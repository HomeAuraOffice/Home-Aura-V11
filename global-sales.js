        const globalSalesProgress = computed(() => {
          const allSellers = users.value.filter(u => u && u.role === 'seller');
          const target = allSellers.reduce((sum, u) => sum + (Number(u.target) || 0), 0);
          
          const now = new Date();
          // get current month using local Bangladesh time if possible, or just local ISO string
          const currentMonth = getBstIsoString().slice(0, 7); 
          const thisMonthOrders = orders.value.filter(o => o.timestamp && o.timestamp.startsWith(currentMonth) && o.status !== 'Void' && o.status !== 'Returned Received');
          
          const sales = thisMonthOrders.reduce((sum, o) => sum + (o.saleAmount || 0), 0);
          const percentage = target > 0 ? Math.min(100, Math.round((sales / target) * 100)) : 0;
          return { target, sales, percentage };
        });
