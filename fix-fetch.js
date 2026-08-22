        const fetchImageAsBlob = async (url) => {
          if (!url) return null;
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Fetch failed');
            return await res.blob();
          } catch (e) {
            console.warn('Fetch failed, trying canvas fallback:', url);
            return new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(resolve, 'image/png');
              };
              img.onerror = () => resolve(null);
              img.src = url;
            });
          }
        };
