          try {
            if (order.collagePhotoUrl) {
              const hasCopied = await copyBothPhotosToClipboard(null, order.collagePhotoUrl);
              if (hasCopied) {
                alert('✅ Collage Photo copied to clipboard as PNG!\n\nPress Ctrl+V (or Cmd+V) to paste it directly into the WhatsApp chat once it opens.');
              } else {
                await navigator.clipboard.writeText(messageText);
                if (targetFactory.waGroupLink) {
                  alert('✅ Order Details copied to clipboard!\n\nPress Ctrl+V (or Cmd+V) to paste them into the WhatsApp group.');
                }
              }
            } else {
              await navigator.clipboard.writeText(messageText);
              if (targetFactory.waGroupLink) {
                alert('✅ Order Details copied to clipboard!\n\nPress Ctrl+V (or Cmd+V) to paste them into the WhatsApp group.');
              }
            }
          } catch (err) {
            console.error('Clipboard copy failed:', err);
            if (targetFactory.waGroupLink) {
               try {
                 await navigator.clipboard.writeText(messageText);
                 alert('Order details copied to clipboard! Paste them in the WhatsApp group.');
               } catch(e) {}
            }
          }
