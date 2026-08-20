const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const uploadFunc = `
        const uploadCompositePngToDrive = async (base64Data, filename) => {
          const url = (appsScriptUrl.value || '').trim();
          if (!url || !url.startsWith('http')) return null;
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'upload_image',
                filename: filename,
                base64: base64Data,
                folder: 'HomeAura_Dispatch_Manifests'
              }),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            const result = await res.json();
            if (result.status === 'success' && result.url) {
              return result.url;
            }
          } catch(e) {
            console.error('Failed to upload composite PNG to drive:', e);
          }
          return null;
        };
`;

appJs = appJs.replace(
  "        const handleProofFileUpload =",
  uploadFunc + "\n        const handleProofFileUpload ="
);

fs.writeFileSync('app.js', appJs);
console.log('Added upload func');
