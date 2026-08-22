        const saveMarketingSpendsLocally = () => {
          localStorage.setItem('homeaura_marketing_spends', JSON.stringify(marketingSpends.value));
        };
        const filteredMarketingSpends = computed(() => {
          let list = marketingSpends.value.filter(s => s.date === marketingSpendFilterDate.value);
          if (currentUser.value && currentUser.value.role === 'marketer' && currentUser.value.visibleSellers && currentUser.value.visibleSellers.length > 0) {
            list = list.filter(s => currentUser.value.visibleSellers.includes(s.sellerId));
          }
          return list;
        });

        const openMarketingSpendModal = (spend = null) => {
          if (spend) {
            modalData.marketingSpend = { ...spend };
          } else {
            modalData.marketingSpend = {
              date: marketingSpendFilterDate.value,
              sellerId: '',
              amount: 0,
              history: []
            };
          }
          activeModal.value = 'marketingSpendModal';
        };

        const openMarketingSpendHistory = (spend) => {
          modalData.marketingSpend = { ...spend };
          activeModal.value = 'marketingSpendHistoryModal';
        };

        const saveMarketingSpend = () => {
          const spend = modalData.marketingSpend;
          if (!spend.date || !spend.sellerId) return;
          const ts = Date.now();
          const recordHistory = {
            timestamp: ts,
            amount: spend.amount,
            updatedBy: currentUser.value ? currentUser.value.username : 'system'
          };
          if (spend.id) {
            const idx = marketingSpends.value.findIndex(s => s.id === spend.id);
            if (idx !== -1) {
              const target = marketingSpends.value[idx];
              target.amount = spend.amount;
              target.updatedBy = recordHistory.updatedBy;
              target.history = target.history || [];
              target.history.unshift(recordHistory);
            }
          } else {
            const existing = marketingSpends.value.find(s => s.date === spend.date && s.sellerId === spend.sellerId);
            if (existing) {
              existing.amount = spend.amount;
              existing.updatedBy = recordHistory.updatedBy;
              existing.history = existing.history || [];
              existing.history.unshift(recordHistory);
            } else {
              spend.id = 'ms_' + ts + Math.random().toString(36).substr(2, 5);
              spend.updatedBy = recordHistory.updatedBy;
              spend.history = [recordHistory];
              marketingSpends.value.push(spend);
            }
          }
          saveMarketingSpendsLocally();
          closeModal();
        };

        const totalMarketingSpendToday = computed(() => {
          const today = new Date().toISOString().split('T')[0];
          return marketingSpends.value.filter(s => s.date === today).reduce((sum, s) => sum + s.amount, 0);
        });
