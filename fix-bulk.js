          let hasCopiedPhotos = false;
          try {
            const allUrls = [];
            selectedList.forEach(o => {
               if(o.collagePhotoUrl) allUrls.push(o.collagePhotoUrl);
               if(o.socialProofUrl) allUrls.push(o.socialProofUrl);
            });
            const blobs = await Promise.all(allUrls.map(url => fetchImageAsBlob(url)));
            hasCopiedPhotos = await writeMultipleBlobsToClipboard(blobs, manifestText);
          } catch (err) {
            console.warn('Notice fetching bulk images:', err.message);
          }
