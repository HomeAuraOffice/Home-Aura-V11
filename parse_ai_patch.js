        const parseClipboard = async () => {
          if (!clipboardRawText.value) return;
          const text = clipboardRawText.value;
          
          parseSuccessMsg.value = `✨ Analyzing text with Omni-Clipboard AI...`;
          
          try {
            const res = await fetch('/api/parse-clipboard', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ text })
            });
            
            if (!res.ok) {
              throw new Error('Failed to parse');
            }
            
            const data = await res.json();
            
            let parsedCount = 0;
            const keys = [
              'customerName', 'customerPhone', 'customerAddress', 'trafficSource',
              'fabric', 'productCategory', 'seatConfig', 'fulfillmentMethod',
              'saleAmount', 'deliveryCharge', 'urgent', 'notes', 'cnNumber',
              'invoiceNumber', 'extraDetails', 'factoryTag'
            ];
            
            keys.forEach(k => {
              if (data[k] !== undefined && data[k] !== null && data[k] !== '') {
                intakeForm[k] = data[k];
                parsedCount++;
              }
            });
            
            parseSuccessMsg.value = `✨ AI successfully parsed ${parsedCount} fields!`;
            setTimeout(() => { parseSuccessMsg.value = ''; }, 4000);
          } catch (err) {
            parseSuccessMsg.value = `❌ Failed to parse using AI.`;
            setTimeout(() => { parseSuccessMsg.value = ''; }, 4000);
          }
        };
