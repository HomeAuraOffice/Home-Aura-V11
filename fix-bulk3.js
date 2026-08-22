          try {
            await navigator.clipboard.writeText(manifestText);
            bulkDispatchSuccessData.isCopiedText = true;
            bulkDispatchSuccessData.compositePngUrl = "";
            bulkDispatchSuccessData.compositePngBlob = null;
          } catch(e) {
            console.error('Bulk Clipboard write error:', e);
            bulkDispatchSuccessData.isCopiedText = false;
          }
