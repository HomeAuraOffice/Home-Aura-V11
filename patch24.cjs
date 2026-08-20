const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

appJs = appJs.replace(
  /const pngRes = await generateOrdersCompositePng\(\[newOrder\], 'HOMEAURA ORDER ATTACHMENT'\);\s*if \(pngRes && pngRes\.blob\) \{\s*hasCopiedTextAndImage = await writePngBlobToClipboard\(pngRes\.blob, waText\);\s*hasCopiedPhotos = hasCopiedTextAndImage;\s*generatedPngData = pngRes;\s*\}/,
  `const pngRes = await generateOrdersCompositePng([newOrder], 'HOMEAURA ORDER ATTACHMENT');
            if (pngRes && pngRes.blob) {
              hasCopiedTextAndImage = await writePngBlobToClipboard(pngRes.blob, waText);
              hasCopiedPhotos = hasCopiedTextAndImage;
              generatedPngData = pngRes;
              
              uploadCompositePngToDrive(pngRes.dataUrl, \`order_manifest_\${newOrder.id}.png\`).then(url => {
                if (url) {
                  const targetOrder = orders.value.find(o => o.id === newOrder.id);
                  if (targetOrder) {
                    targetOrder.dispatchManifestUrl = url;
                    queueChange('orders', targetOrder);
                    saveOrdersLocally();
                  }
                }
              });
            }`
);

appJs = appJs.replace(
  /const pngRes = await generateOrdersCompositePng\(\[order\], \`DISPATCH: \$\{targetFactory\.name\.toUpperCase\(\)\}\`\);\s*if \(pngRes && pngRes\.blob\) \{\s*hasCopiedTextAndImage = await writePngBlobToClipboard\(pngRes\.blob, messageText\);\s*generatedPng = pngRes\.dataUrl;\s*\}/,
  `const pngRes = await generateOrdersCompositePng([order], \`DISPATCH: \${targetFactory.name.toUpperCase()}\`);
            if (pngRes && pngRes.blob) {
              hasCopiedTextAndImage = await writePngBlobToClipboard(pngRes.blob, messageText);
              generatedPng = pngRes.dataUrl;

              uploadCompositePngToDrive(pngRes.dataUrl, \`dispatch_manifest_\${order.id}.png\`).then(url => {
                if (url) {
                  const targetOrder = orders.value.find(o => o.id === order.id);
                  if (targetOrder) {
                    targetOrder.dispatchManifestUrl = url;
                    queueChange('orders', targetOrder);
                    saveOrdersLocally();
                  }
                }
              });
            }`
);

appJs = appJs.replace(
  /const pngRes = await generateOrdersCompositePng\(selectedList, 'HOMEAURA FACTORY DISPATCH MANIFEST'\);\s*if \(pngRes && pngRes\.blob\) \{\s*const copied = await writePngBlobToClipboard\(pngRes\.blob, manifestText\);\s*bulkDispatchSuccessData\.isCopiedPhotos = copied;\s*bulkDispatchSuccessData\.compositePngUrl = pngRes\.dataUrl;\s*\}/,
  `const pngRes = await generateOrdersCompositePng(selectedList, 'HOMEAURA FACTORY DISPATCH MANIFEST');
            if (pngRes && pngRes.blob) {
              const copied = await writePngBlobToClipboard(pngRes.blob, manifestText);
              bulkDispatchSuccessData.isCopiedPhotos = copied;
              bulkDispatchSuccessData.compositePngUrl = pngRes.dataUrl;

              const ts = Date.now();
              uploadCompositePngToDrive(pngRes.dataUrl, \`bulk_manifest_\${ts}.png\`).then(url => {
                if (url) {
                  selectedList.forEach(order => {
                    const targetOrder = orders.value.find(o => o.id === order.id);
                    if (targetOrder) {
                      targetOrder.dispatchManifestUrl = url;
                      queueChange('orders', targetOrder);
                    }
                  });
                  saveOrdersLocally();
                }
              });
            }`
);

appJs = appJs.replace(
  /pngResult = await generateOrdersCompositePng\(selectedList, \`BULK DISPATCH: \$\{targetFactory\.name\.toUpperCase\(\)\}\`\);\s*if \(pngResult && pngResult\.blob\) \{\s*hasCopiedPhotos = await writePngBlobToClipboard\(pngResult\.blob\);\s*\}/,
  `pngResult = await generateOrdersCompositePng(selectedList, \`BULK DISPATCH: \${targetFactory.name.toUpperCase()}\`);
            if (pngResult && pngResult.blob) {
              hasCopiedPhotos = await writePngBlobToClipboard(pngResult.blob);

              const ts = Date.now();
              uploadCompositePngToDrive(pngResult.dataUrl, \`bulk_dispatch_\${targetFactory.id}_\${ts}.png\`).then(url => {
                if (url) {
                  selectedList.forEach(order => {
                    const targetOrder = orders.value.find(o => o.id === order.id);
                    if (targetOrder) {
                      targetOrder.dispatchManifestUrl = url;
                      queueChange('orders', targetOrder);
                    }
                  });
                  saveOrdersLocally();
                }
              });
            }`
);

fs.writeFileSync('app.js', appJs);
console.log('Applied dispatch manifests patch');
