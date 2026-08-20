const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

indexHtml = indexHtml.replace(
  '                        <div v-if="ord.collagePhotoFileName" class="text-[9px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-[120px]" :title="ord.collagePhotoFileName">',
  '                        <div v-if="ord.collagePhotoFileName" class="text-[9px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-[120px]" :title="ord.collagePhotoFileName">\n                          {{ ord.collagePhotoFileName }}\n                        </div>\n                        <div v-if="ord.dispatchManifestUrl" @click="openPhotoModal(ord.dispatchManifestUrl, \'Dispatch Manifest\')" class="text-[10px] text-purple-600 dark:text-purple-400 font-bold cursor-pointer hover:underline mt-0.5 flex items-center gap-1">\n                          📝 Manifest\n                        </div>\n                        <div v-if="false">'
);

indexHtml = indexHtml.replace(
  '<button v-if="ord.collagePhotoLocalUrl || ord.collagePhotoUrl" @click="openPhotoModal(ord.collagePhotoUrl, ord.id)" title="View Collage Photo" class="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 dark:border-indigo-800 transition-all">',
  '<button v-if="ord.dispatchManifestUrl" @click="openPhotoModal(ord.dispatchManifestUrl, \'Dispatch Manifest\')" title="View Dispatch Manifest" class="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 transition-all text-xs font-bold flex items-center gap-1">📝</button>\n<button v-if="ord.collagePhotoLocalUrl || ord.collagePhotoUrl" @click="openPhotoModal(ord.collagePhotoUrl || ord.collagePhotoLocalUrl, ord.id)" title="View Collage Photo" class="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 dark:border-indigo-800 transition-all">'
);

indexHtml = indexHtml.replace(
  '<img :src="modalData.order.collagePhotoLocalUrl || modalData.order.collagePhotoUrl" class="max-h-full object-contain group-hover:scale-105 transition-transform" />',
  '<img :src="modalData.order.collagePhotoLocalUrl || modalData.order.collagePhotoUrl" class="max-h-full object-contain group-hover:scale-105 transition-transform" />\n                      </div>\n                    </div>\n                    <div v-if="modalData.order.dispatchManifestUrl" class="space-y-2 mt-4">\n                      <label class="block font-semibold text-slate-700 dark:text-slate-300">Dispatch Manifest</label>\n                      <div class="h-32 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer group border border-slate-200 dark:border-slate-800"\n                           @click="openPhotoModal(modalData.order.dispatchManifestUrl, \'Dispatch Manifest - Order #\' + modalData.order.id)">\n                        <img :src="modalData.order.dispatchManifestUrl" class="max-h-full object-contain group-hover:scale-105 transition-transform" />'
);


fs.writeFileSync('index.html', indexHtml);
console.log('Added manifest to UI fully');
