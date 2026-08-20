const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const newUploadLogicCollage = `              if (result.status === 'success' && result.url) {
                targetObj.collagePhotoUrl = result.url;
                if (targetObj === intakeForm) {
                  parseSuccessMsg.value = '✅ Collage converted and securely uploaded to Google Drive!';
                  setTimeout(() => { parseSuccessMsg.value = ''; }, 4000);
                }
                if (targetObj.id) {
                  const realOrder = orders.value.find(o => o.id === targetObj.id);
                  if (realOrder) {
                    realOrder.collagePhotoUrl = result.url;
                    realOrder.collagePhotoFileName = fileName;
                    queueChange('orders', realOrder);
                    saveOrdersLocally();
                  }
                }
              }`;

const newUploadLogicProof = `              if (result.status === 'success' && result.url) {
                targetObj.socialProofUrl = result.url;
                if (targetObj === intakeForm) {
                  parseSuccessMsg.value = '✅ Screenshot converted and securely uploaded to Google Drive!';
                  setTimeout(() => { parseSuccessMsg.value = ''; }, 4000);
                }
                if (targetObj.id) {
                  const realOrder = orders.value.find(o => o.id === targetObj.id);
                  if (realOrder) {
                    realOrder.socialProofUrl = result.url;
                    realOrder.socialProofFileName = fileName;
                    queueChange('orders', realOrder);
                    saveOrdersLocally();
                  }
                }
              }`;

appJs = appJs.replace(/if \(result\.status === 'success' && result\.url\) \{\s*targetObj\.collagePhotoUrl = result\.url;\s*if \(targetObj === intakeForm\) \{\s*parseSuccessMsg\.value = '✅ Collage converted and securely uploaded to Google Drive!';\s*setTimeout\(\(\) => \{ parseSuccessMsg\.value = ''; \}, 4000\);\s*\}\s*if \(targetObj\.id\) \{\s*queueChange\('orders', targetObj\);\s*\}\s*\}/, newUploadLogicCollage);
appJs = appJs.replace(/if \(result\.status === 'success' && result\.url\) \{\s*targetObj\.socialProofUrl = result\.url;\s*if \(targetObj === intakeForm\) \{\s*parseSuccessMsg\.value = '✅ Screenshot converted and securely uploaded to Google Drive!';\s*setTimeout\(\(\) => \{ parseSuccessMsg\.value = ''; \}, 4000\);\s*\}\s*if \(targetObj\.id\) \{\s*queueChange\('orders', targetObj\);\s*\}\s*\}/, newUploadLogicProof);

fs.writeFileSync('app.js', appJs);
console.log('Fixed async target object references');
