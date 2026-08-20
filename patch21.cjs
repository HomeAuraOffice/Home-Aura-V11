const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Update processCollageFile
let appJsRepl1 = appJs.replace(
  `            targetObj.collagePhotoUrl = base64Data;
            targetObj.collagePhotoLocalUrl = base64Data;`,
  `            targetObj.collagePhotoLocalUrl = base64Data;
            targetObj.collagePhotoUrl = ''; // We will wait for the Google Drive URL`
);

// Update processProofFile
appJsRepl1 = appJsRepl1.replace(
  `            targetObj.socialProofUrl = base64Data;
            targetObj.socialProofLocalUrl = base64Data;`,
  `            targetObj.socialProofLocalUrl = base64Data;
            targetObj.socialProofUrl = ''; // We will wait for the Google Drive URL`
);

fs.writeFileSync('app.js', appJsRepl1);

// Update indexHtml to use (ord.collagePhotoLocalUrl || ord.collagePhotoUrl) where appropriate.
// Since Vue templates handle short-circuiting safely.
let indexHtmlRepl1 = indexHtml.replace(
  /<img :src="ord\.collagePhotoUrl"/g,
  '<img :src="ord.collagePhotoLocalUrl || ord.collagePhotoUrl"'
);
indexHtmlRepl1 = indexHtmlRepl1.replace(
  /<img :src="intakeForm\.collagePhotoUrl"/g,
  '<img :src="intakeForm.collagePhotoLocalUrl || intakeForm.collagePhotoUrl"'
);
indexHtmlRepl1 = indexHtmlRepl1.replace(
  /<img :src="modalData\.order\.collagePhotoUrl"/g,
  '<img :src="modalData.order.collagePhotoLocalUrl || modalData.order.collagePhotoUrl"'
);

// We also need to fix v-if checks to check for localUrl too!
indexHtmlRepl1 = indexHtmlRepl1.replace(
  /v-if="ord\.collagePhotoUrl"/g,
  'v-if="ord.collagePhotoLocalUrl || ord.collagePhotoUrl"'
);
indexHtmlRepl1 = indexHtmlRepl1.replace(
  /v-if="intakeForm\.collagePhotoUrl"/g,
  'v-if="intakeForm.collagePhotoLocalUrl || intakeForm.collagePhotoUrl"'
);
indexHtmlRepl1 = indexHtmlRepl1.replace(
  /v-if="!intakeForm\.collagePhotoUrl"/g,
  'v-if="!(intakeForm.collagePhotoLocalUrl || intakeForm.collagePhotoUrl)"'
);
indexHtmlRepl1 = indexHtmlRepl1.replace(
  /v-if="modalData\.order\.collagePhotoUrl"/g,
  'v-if="modalData.order.collagePhotoLocalUrl || modalData.order.collagePhotoUrl"'
);

// For social proof
indexHtmlRepl1 = indexHtmlRepl1.replace(
  /v-if="intakeForm\.socialProofUrl"/g,
  'v-if="intakeForm.socialProofLocalUrl || intakeForm.socialProofUrl"'
);
indexHtmlRepl1 = indexHtmlRepl1.replace(
  /v-if="!intakeForm\.socialProofUrl"/g,
  'v-if="!(intakeForm.socialProofLocalUrl || intakeForm.socialProofUrl)"'
);
indexHtmlRepl1 = indexHtmlRepl1.replace(
  /<img :src="intakeForm\.socialProofUrl"/g,
  '<img :src="intakeForm.socialProofLocalUrl || intakeForm.socialProofUrl"'
);

fs.writeFileSync('index.html', indexHtmlRepl1);
console.log('Patched local urls');
