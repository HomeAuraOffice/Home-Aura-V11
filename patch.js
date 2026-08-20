        const copyBothPhotosToClipboard = async (url1, url2) => {
          try {
            const loadImage = (url) => {
              return new Promise((resolve, reject) => {
                if (!url) return resolve(null);
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
              });
            };

            const img1 = await loadImage(url1);
            const img2 = await loadImage(url2);

            if (!img1 && !img2) return false;

            const padding = 20;
            const canvas = document.createElement('canvas');
            let totalWidth = 0;
            let maxHeight = 0;

            if (img1 && img2) {
              totalWidth = img1.width + img2.width + padding;
              maxHeight = Math.max(img1.height, img2.height);
            } else if (img1) {
              totalWidth = img1.width;
              maxHeight = img1.height;
            } else {
              totalWidth = img2.width;
              maxHeight = img2.height;
            }

            canvas.width = totalWidth;
            canvas.height = maxHeight;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (img1 && img2) {
              ctx.drawImage(img1, 0, 0);
              ctx.drawImage(img2, img1.width + padding, 0);
            } else if (img1) {
              ctx.drawImage(img1, 0, 0);
            } else if (img2) {
              ctx.drawImage(img2, 0, 0);
            }

            const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': pngBlob })
            ]);
            return true;
          } catch (err) {
            console.error("Clipboard copy failed:", err);
            return false;
          }
        };

        const submitNewOrder = async () => {
          const newId = 'ORD-' + (1000 + orders.value.length + 1);
          const now = new Date();
          const timestamp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
          const sellerUsername = currentUser.value ? currentUser.value.username : 'seller';
          const autoCn = intakeForm.cnNumber || ('CN-' + (1000 + orders.value.length + 1));
          const autoInv = intakeForm.invoiceNumber || ('INV-' + (1000 + orders.value.length + 1));
          const dateStr = timestamp.slice(0, 10);
          const autoFileName = intakeForm.collagePhotoFileName || \`collage_attachments/\${sellerUsername}_\${autoCn.replace(/[^a-zA-Z0-9-]/g, '')}_\${autoInv.replace(/[^a-zA-Z0-9-]/g, '')}_\${dateStr}.jpg\`;
          const newOrder = {
            id: newId,
            timestamp,
            merchantId: currentUser.value.id,
            merchantName: currentUser.value.name,
            customerName: intakeForm.customerName,
            customerPhone: intakeForm.customerPhone,
            customerAddress: intakeForm.customerAddress,
            trafficSource: intakeForm.trafficSource,
            designCode: intakeForm.designCode,
            productCategory: intakeForm.productCategory,
            seatConfig: intakeForm.seatConfig,
            fulfillmentMethod: intakeForm.fulfillmentMethod,
            saleAmount: intakeForm.saleAmount || 0,
            deliveryCharge: intakeForm.deliveryCharge || 0,
            totalAmount: (intakeForm.saleAmount || 0) + (intakeForm.deliveryCharge || 0),
            status: 'Confirmation Call',
            urgent: intakeForm.urgent,
            notes: intakeForm.notes,
            cnNumber: autoCn,
            invoiceNumber: autoInv,
            collagePhotoUrl: intakeForm.collagePhotoUrl || '',
            collagePhotoFileName: autoFileName,
            socialProofUrl: intakeForm.socialProofUrl || '',
            socialProofFileName: intakeForm.socialProofFileName || '',
            extraDetails: intakeForm.extraDetails || '',
            factoryTag: intakeForm.factoryTag || ''
          };
          
          const proofUrlToCopy = intakeForm.socialProofUrl;
          const collageUrlToCopy = intakeForm.collagePhotoUrl;
          
          orders.value.unshift(newOrder);
          saveOrders();
          intakeForm.customerName = '';
          intakeForm.customerPhone = '';
          intakeForm.customerAddress = '';
          intakeForm.designCode = '';
          intakeForm.saleAmount = 0;
          intakeForm.deliveryCharge = 0;
          intakeForm.urgent = false;
          intakeForm.notes = '';
          intakeForm.cnNumber = '';
          intakeForm.invoiceNumber = '';
          intakeForm.collagePhotoUrl = '';
          intakeForm.collagePhotoFileName = '';
          intakeForm.socialProofUrl = '';
          intakeForm.socialProofFileName = '';
          intakeForm.extraDetails = '';
          intakeForm.factoryTag = '';
          clipboardRawText.value = '';
          activeTab.value = 'my_orders';
          
          if (adminWaGroupLink.value || proofUrlToCopy || collageUrlToCopy) {
            const hasCopied = await copyBothPhotosToClipboard(proofUrlToCopy, collageUrlToCopy);
            let alertMsg = '✅ Order successfully created!\n\n';
            if (hasCopied) {
               alertMsg += '📸 Both attached photos (Social Proof + Collage) have been securely copied to your clipboard as a PNG image.\n\n';
            }
            if (adminWaGroupLink.value) {
               alertMsg += 'Opening the WhatsApp Group. Please paste (Ctrl+V or Cmd+V) to share the photos with the team!';
            } else {
               alertMsg += 'Setup your "Order Submission WhatsApp Group" in Settings to auto-open it upon submission!';
            }
            alert(alertMsg);

            if (adminWaGroupLink.value) {
              window.open(adminWaGroupLink.value, '_blank');
            }
          }
        };
