const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const stateInjection = `        const appsScriptUrl = ref(localStorage.getItem('homeaura_apps_script_url') || '');
        const backupFrequency = ref(localStorage.getItem('homeaura_backup_frequency') || '6');`;

code = code.replace(/const appsScriptUrl = ref\(localStorage\.getItem\('homeaura_apps_script_url'\) \|\| ''\);/, stateInjection);

const functionInjection = `        const updateBackupFrequency = async () => {
          if (!appsScriptUrl.value) {
            alert('Please configure the Apps Script URL first.');
            return;
          }
          try {
            const url = appsScriptUrl.value.trim();
            localStorage.setItem('homeaura_backup_frequency', backupFrequency.value);
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({ action: 'setup_backup', hours: parseInt(backupFrequency.value) })
            });
            const data = await res.json();
            if (data && data.status === 'success') {
              alert(data.message || 'Backup schedule updated successfully!');
            } else {
              throw new Error(data.error || 'Unknown error');
            }
          } catch(err) {
            alert('Failed to update backup schedule: ' + err.message);
          }
        };

        const saveAdminWaGroupLink`;

code = code.replace(/const saveAdminWaGroupLink/, functionInjection);


// Now update the GAS script string.
const appsScriptFunctions = `}

function setupBackupTrigger(hours) {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'backupSpreadsheet') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  if (hours > 0) {
    ScriptApp.newTrigger('backupSpreadsheet')
             .timeBased()
             .everyHours(hours)
             .create();
  }
}

function backupSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var formattedDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  var name = ss.getName() + " Backup " + formattedDate;
  var destFolder = DriveApp.getFoldersByName("HomeAura_Backups");
  var folder;
  if (destFolder.hasNext()) {
    folder = destFolder.next();
  } else {
    folder = DriveApp.createFolder("HomeAura_Backups");
  }
  DriveApp.getFileById(ss.getId()).makeCopy(name, folder);
}
\`;`;

code = code.replace(/}\n`;/, appsScriptFunctions);

// Add the setup_backup to doPost
const doPostBackup = `    if (payloadObj.action === 'upload_image' && payloadObj.base64) {
      return ContentService.createTextOutput(JSON.stringify(handleDriveImageUpload(payloadObj.filename || 'attachment.jpg', payloadObj.base64))).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (payloadObj.action === 'setup_backup') {
      try {
        setupBackupTrigger(payloadObj.hours);
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Backup frequency set to ' + payloadObj.hours + ' hour(s).' })).setMimeType(ContentService.MimeType.JSON);
      } catch(err) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
      }
    }
`;

code = code.replace(/    if \(payloadObj\.action === 'upload_image' && payloadObj\.base64\) \{[\s\S]*?\}\n/, doPostBackup);

// Also we need to export the variable to return
const returnInjection = `          updateBackupFrequency,
          backupFrequency,
          appsScriptUrl,`;

code = code.replace(/          appsScriptUrl,/, returnInjection);

fs.writeFileSync('app.js', code);
