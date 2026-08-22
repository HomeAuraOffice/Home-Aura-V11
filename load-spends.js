          const storedSpends = localStorage.getItem('homeaura_marketing_spends');
          if (storedSpends) { try { marketingSpends.value = JSON.parse(storedSpends); } catch (e) {} }
