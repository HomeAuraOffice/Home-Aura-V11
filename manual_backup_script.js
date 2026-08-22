    if (payloadObj.action === 'manual_backup') {
      try {
        backupSpreadsheet();
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Manual backup completed successfully!' })).setMimeType(ContentService.MimeType.JSON);
      } catch(err) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
      }
    }
