const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const helper = `
        const convertFileToPngBase64 = (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
              };
              img.onerror = reject;
              img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        };
`;

// Inject helper before processCollageFile
appJs = appJs.replace("        const processCollageFile = (file", helper + "\n        const processCollageFile = async (file");

// Replace processCollageFile body
appJs = appJs.replace(/const processCollageFile = async \(file, targetObj = intakeForm\) => \{[\s\S]*?reader\.readAsDataURL\(file\);\s*\};/, `const processCollageFile = async (file, targetObj = intakeForm) => {
          if (!file || !file.type.startsWith('image/')) return;
          const sellerUsername = currentUser.value ? currentUser.value.username : 'seller';
          const rawCn = targetObj.cnNumber || 'NOCN';
          const cleanCn = rawCn.replace(/[^a-zA-Z0-9-]/g, '');
          const dateStr = targetObj.timestamp ? targetObj.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10);
          const fileName = \`collage_\${sellerUsername}_\${cleanCn}_\${dateStr}.png\`;

          if (targetObj === intakeForm) {
            parseSuccessMsg.value = '⏳ Converting and uploading collage to Google Drive... Please wait.';
          }
          
          targetObj.collagePhotoLocalUrl = URL.createObjectURL(file);
          targetObj.collagePhotoUrl = '';
          targetObj.collagePhotoFileName = fileName;

          if (!appsScriptUrl.value) {
            if (targetObj === intakeForm) parseSuccessMsg.value = '⚠️ Collage attached locally (No Google Script URL set).';
            return;
          }

          try {
            const base64Data = await convertFileToPngBase64(file);
            const url = (appsScriptUrl.value || '').trim();
            if (!url || !url.startsWith('http')) return;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'upload_image',
                filename: fileName,
                base64: base64Data,
                folder: 'HomeAura_Collage_Photos'
              }),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            const result = await res.json();
            if (result.status === 'success' && result.url) {
              targetObj.collagePhotoUrl = result.url;
              if (targetObj === intakeForm) {
                parseSuccessMsg.value = '✅ Collage converted and securely uploaded to Google Drive!';
                setTimeout(() => { parseSuccessMsg.value = ''; }, 4000);
              }
              if (targetObj.id) {
                queueChange('orders', targetObj);
              }
            }
          } catch (err) {
            console.error('Collage Upload Error:', err);
            if (targetObj === intakeForm) parseSuccessMsg.value = '❌ Failed to upload collage. Using local preview instead.';
          }
        };`);


// Replace processProofFile body
appJs = appJs.replace(/const processProofFile = \(file, targetObj = intakeForm\) => \{[\s\S]*?reader\.readAsDataURL\(file\);\s*\};/, `const processProofFile = async (file, targetObj = intakeForm) => {
          if (!file || !file.type.startsWith('image/')) return;
          const sellerUsername = currentUser.value ? currentUser.value.username : 'seller';
          const rawCn = targetObj.cnNumber || 'NOCN';
          const cleanCn = rawCn.replace(/[^a-zA-Z0-9-]/g, '');
          const dateStr = targetObj.timestamp ? targetObj.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10);
          const fileName = \`proof_\${sellerUsername}_\${cleanCn}_\${dateStr}.png\`;

          if (targetObj === intakeForm) {
            parseSuccessMsg.value = '⏳ Converting and uploading screenshot to Google Drive... Please wait.';
          }
          
          targetObj.socialProofLocalUrl = URL.createObjectURL(file);
          targetObj.socialProofUrl = '';
          targetObj.socialProofFileName = fileName;

          if (!appsScriptUrl.value) {
            if (targetObj === intakeForm) parseSuccessMsg.value = '⚠️ Proof attached locally (No Google Script URL set).';
            return;
          }

          try {
            const base64Data = await convertFileToPngBase64(file);
            const url = (appsScriptUrl.value || '').trim();
            if (!url || !url.startsWith('http')) return;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'upload_image',
                filename: fileName,
                base64: base64Data,
                folder: 'HomeAura_Screenshot_Proofs'
              }),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            const result = await res.json();
            if (result.status === 'success' && result.url) {
              targetObj.socialProofUrl = result.url;
              if (targetObj === intakeForm) {
                parseSuccessMsg.value = '✅ Screenshot converted and securely uploaded to Google Drive!';
                setTimeout(() => { parseSuccessMsg.value = ''; }, 4000);
              }
              if (targetObj.id) {
                queueChange('orders', targetObj);
              }
            }
          } catch(err) {
            console.warn("Upload Notice (saved locally):", err.message);
            if (targetObj === intakeForm) parseSuccessMsg.value = '❌ Failed to upload screenshot. Using local preview instead.';
          }
        };`);

fs.writeFileSync('app.js', appJs);
console.log('Done replacement');
