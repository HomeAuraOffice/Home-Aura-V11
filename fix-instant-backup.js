        const instantBackupToDrive = async () => {
          if (!appsScriptUrl.value) {
            alert('Please configure the Apps Script URL first.');
            return;
          }
          try {
            const url = appsScriptUrl.value.trim();
            isBackingUp.value = true;
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({ action: 'manual_backup' })
            });
            const text = await res.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch (e) {
              throw new Error('Server returned HTML or invalid JSON. Did you re-deploy as a NEW Web App and grant permissions?');
            }
            if (data && data.status === 'success') {
              if (data.mode === 'full') {
                 alert('⚠️ Backup command ignored! You are still using an OLD version of the Apps Script.\n\nPlease click "Copy Apps Script Code (V4)", paste it in your Google Apps Script editor, and create a NEW deployment.');
              } else {
                 alert(data.message || '✅ Manual backup completed successfully!');
              }
            } else {
              throw new Error(data.error || 'Unknown error');
            }
          } catch(err) {
            let msg = err.message;
            if (msg.includes('permission') || msg.includes('DriveApp')) {
                msg += '\n\n💡 FIX: Open your Google Sheet > Extensions > Apps Script. Select "backupSpreadsheet" from the top toolbar and click "Run" to grant Google Drive permissions, then deploy as a New Web App again!';
            }
            alert('❌ Failed to execute instant backup:\n' + msg);
          } finally {
            isBackingUp.value = false;
          }
        };
