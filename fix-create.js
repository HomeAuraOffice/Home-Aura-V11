          try {
            const blob1 = await fetchImageAsBlob(newOrder.collagePhotoUrl);
            const blob2 = await fetchImageAsBlob(newOrder.socialProofUrl);
            hasCopiedTextAndImage = await writeMultipleBlobsToClipboard([blob1, blob2], waText);
            hasCopiedPhotos = hasCopiedTextAndImage;
            
            // Still upload individual images? The user said "because i am not storing files/image on github please use only the drive option to upload/see/check/copy the attachments no links the main image"
            // If they are already drive URLs, we don't need to upload a composite.
            
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
