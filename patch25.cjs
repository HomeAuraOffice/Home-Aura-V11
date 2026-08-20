const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

indexHtml = indexHtml.replace(
  '<span v-if="ord.collagePhotoUrl" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">📸 Collage Ready</span>',
  '<span v-if="ord.collagePhotoUrl" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">📸 Collage Ready</span><span v-if="ord.dispatchManifestUrl" class="text-[10px] text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800 cursor-pointer" @click.stop="openPhotoModal(ord.dispatchManifestUrl, \'Dispatch Manifest\')">📝 Manifest</span>'
);

indexHtml = indexHtml.replace(
  '<div v-if="ord.socialProofUrl" @click="openPhotoModal(ord.socialProofUrl, ord.id)" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold cursor-pointer hover:underline mt-0.5 flex items-center gap-1">',
  '<div v-if="ord.socialProofUrl" @click="openPhotoModal(ord.socialProofUrl, ord.id)" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold cursor-pointer hover:underline mt-0.5 flex items-center gap-1">\n                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>\n                            Proof Uploaded\n                          </div>\n                          <div v-if="ord.dispatchManifestUrl" @click="openPhotoModal(ord.dispatchManifestUrl, \'Dispatch Manifest\')" class="text-[10px] text-purple-600 dark:text-purple-400 font-bold cursor-pointer hover:underline mt-0.5 flex items-center gap-1">'
);

fs.writeFileSync('index.html', indexHtml);
console.log('Added manifest to UI');
