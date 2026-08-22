          try {
            const blob1 = await fetchImageAsBlob(newOrder.collagePhotoUrl);
            const blob2 = await fetchImageAsBlob(newOrder.socialProofUrl);
            hasCopiedTextAndImage = await writeMultipleBlobsToClipboard([blob1, blob2], waText);
            hasCopiedPhotos = hasCopiedTextAndImage;
            
            if (!hasCopiedTextAndImage) {
              await navigator.clipboard.writeText(waText);
              hasCopiedTextAndImage = true;
            }
          } catch (err) {
            console.error('Clipboard copy failed:', err);
            try {
              await navigator.clipboard.writeText(waText);
              hasCopiedTextAndImage = true;
            } catch (e2) {}
          }
          orderSuccessData.order = newOrder;
          orderSuccessData.hasCopiedPhotos = hasCopiedPhotos;
          orderSuccessData.compositePngUrl = '';
          orderSuccessData.previewPngUrl = '';
          orderSuccessData.compositePngBlob = null;
