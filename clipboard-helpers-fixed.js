        const fetchImageAsBlob = async (url) => {
          if (!url) return null;
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Fetch failed");
            return await res.blob();
          } catch (e) {
            console.warn("Fetch failed, trying canvas fallback:", url);
            return new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(resolve, "image/png");
              };
              img.onerror = () => resolve(null);
              img.src = url;
            });
          }
        };

        const writeMultipleBlobsToClipboard = async (blobs, textMsg = '') => {
          const validBlobs = blobs.filter(b => b);
          if (validBlobs.length === 0) {
            if (textMsg) {
              await navigator.clipboard.writeText(textMsg);
              return true;
            }
            return false;
          }
          try {
            let copied = false;
            const copyHandler = (e) => {
              validBlobs.forEach((b, i) => {
                e.clipboardData.items.add(new File([b], `image_${i}.png`, { type: b.type || 'image/png' }));
              });
              if (textMsg) e.clipboardData.setData('text/plain', textMsg);
              e.preventDefault();
              copied = true;
            };
            document.addEventListener('copy', copyHandler, { once: true });
            document.execCommand('copy');
            if (copied) return true;
          } catch (e) {
            console.warn('execCommand copy failed, falling back to Clipboard API', e);
          }
          try {
            if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
               const b = validBlobs[0];
               const items = { [b.type || 'image/png']: b };
               if (textMsg) items['text/plain'] = new Blob([textMsg], { type: 'text/plain' });
               await navigator.clipboard.write([new ClipboardItem(items)]);
               return true;
            }
          } catch (e) {
            console.warn('Clipboard API write failed', e);
          }
          return false;
        };
