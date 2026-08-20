const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

indexHtml = indexHtml.replace(
  '<span v-if="ord.collagePhotoLocalUrl || ord.collagePhotoUrl" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">📸 Collage Ready</span>',
  '<span v-if="ord.collagePhotoLocalUrl || ord.collagePhotoUrl" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">📸 Collage Ready</span>\n                      <span v-if="ord.dispatchManifestUrl" class="text-[10px] text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800 cursor-pointer hover:bg-purple-100" @click.stop="openPhotoModal(ord.dispatchManifestUrl, \'Dispatch Manifest\')">📝 Manifest</span>'
);

fs.writeFileSync('index.html', indexHtml);
console.log('Added manifest to UI');
