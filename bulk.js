        const executeBulkFactoryDispatch = async () => {
          if (!bulkDispatchData.selectedFactoryId) {
            alert('⚠️ Please select a target factory.');
            return;
          }
          const targetFactory = factories.value.find(f => f.id === bulkDispatchData.selectedFactoryId);
          if (!targetFactory) {
            alert('⚠️ Selected factory not found.');
            return;
          }

          bulkDispatchData.isGeneratingPng = true;
          bulkDispatchData.isLoading = true;

          const selectedList = orders.value.filter(o => selectedOrders.value.has(o.id));
          if (selectedList.length === 0) {
            bulkDispatchData.isGeneratingPng = false;
            bulkDispatchData.isLoading = false;
            closeModal();
            return;
          }

          // Build consolidated manifest text for WhatsApp
          let manifestText = `🏭 *HOMEAURA BULK FACTORY DISPATCH MANIFEST*\n`;
          manifestText += `━━━━━━━━━━━━━━━━━━━━━\n`;
          manifestText += `🏭 *Factory:* ${targetFactory.name}\n`;
          manifestText += `📦 *Total Batched Orders:* ${selectedList.length} Order(s)\n`;
          manifestText += `📅 *Dispatch Date (BST):* ${formatBangladeshDisplayTime(new Date())}\n`;
          manifestText += `👤 *Dispatched By:* ${currentUser.value?.name || 'Administrator'}\n`;
          manifestText += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

          selectedList.forEach((ord, index) => {
            manifestText += `*#${index + 1} | Order ID:* ${ord.id}\n`;
            manifestText += `🛋️ *Item:* ${ord.productCategory} (${ord.fabric || 'N/A'}) (${ord.seatConfig || ''})\n`;
            if (ord.extraDetails) manifestText += `🔍 *Specs:* ${ord.extraDetails}\n`;
            if (ord.notes) manifestText += `📝 *Notes:* ${ord.notes}\n`;
            if (ord.collagePhotoUrl) manifestText += `🖼️ Product Photo: ${ord.collagePhotoUrl}\n`;
            manifestText += `------------------------------------\n`;
          });
          manifestText += `\n*Please confirm fabric availability & production queue for the attached order collages.*`;

          // Generate composite PNG containing all collages
          let hasCopiedPhotos = false;
          let pngResult = null;
          try {
            const allUrls = [];
            selectedList.forEach(o => {
               if(o.collagePhotoUrl) allUrls.push(o.collagePhotoUrl);
               if(o.socialProofUrl) allUrls.push(o.socialProofUrl);
            });
            const blobs = await Promise.all(allUrls.map(url => fetchImageAsBlob(url)));
            hasCopiedPhotos = await writeMultipleBlobsToClipboard(blobs);
          } catch (err) {
            console.warn("Notice fetching bulk images:", err.message);
          }
          }
          // Update status of all selected orders in local state and queue for delta sync
          const nowIso = getBstIsoString();
          selectedList.forEach(ord => {
            ord.factoryTag = targetFactory.name;
            ord.status = 'Factory Submit';
            ord.updatedAt = nowIso;
            ord.updatedBy = currentUser.value?.username || 'user';
            queueChange('orders', ord);
          });
          saveOrdersLocally();

          // Calculate WA URL
          const encodedMessage = encodeURIComponent(manifestText);
          let waUrl = '';
          if (targetFactory.waGroupLink) {
            waUrl = targetFactory.waGroupLink;
          } else {
            const cleanPhone = (targetFactory.phone || '').replace(/[^0-9]/g, '');
            waUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
          }

          // Setup success modal state
          bulkDispatchSuccessData.ordersCount = selectedList.length;
          bulkDispatchSuccessData.count = selectedList.length;
          bulkDispatchSuccessData.photoCount = pngResult ? pngResult.itemsCount : 0;
          bulkDispatchSuccessData.factoryName = targetFactory.name;
          bulkDispatchSuccessData.waGroupLink = waUrl;
          bulkDispatchSuccessData.compositePngUrl = pngResult ? pngResult.dataUrl : '';
          bulkDispatchSuccessData.previewPngUrl = pngResult ? pngResult.dataUrl : '';
          bulkDispatchSuccessData.compositePngBlob = pngResult ? pngResult.blob : null;
          bulkDispatchSuccessData.previewBlob = pngResult ? pngResult.blob : null;
          bulkDispatchSuccessData.hasCopiedPhotos = hasCopiedPhotos;
          bulkDispatchSuccessData.manifestText = manifestText;
          try {
            await navigator.clipboard.writeText(manifestText);
            bulkDispatchSuccessData.isCopiedText = true;
            bulkDispatchSuccessData.compositePngUrl = "";
            bulkDispatchSuccessData.compositePngBlob = null;
          } catch(e) {
            console.error("Bulk Clipboard write error:", e);
            bulkDispatchSuccessData.isCopiedText = false;
          }
          // Clear selection
          selectedOrders.value.clear();
          bulkDispatchData.isGeneratingPng = false;
          bulkDispatchData.isLoading = false;

          // Show success modal
          activeModal.value = 'bulkDispatchSuccessModal';

          // Open WhatsApp group/chat
          if (waUrl) {
            try {
              window.open(waUrl, '_blank');
            } catch (e) {}
          }
        };
