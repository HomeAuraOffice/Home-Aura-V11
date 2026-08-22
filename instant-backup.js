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
            const data = await res.json();
            if (data && data.status === 'success') {
              alert(data.message || 'Manual backup completed successfully!');
            } else {
              throw new Error(data.error || 'Unknown error');
            }
          } catch(err) {
            alert('Failed to execute instant backup: ' + err.message);
          } finally {
            isBackingUp.value = false;
          }
        };
