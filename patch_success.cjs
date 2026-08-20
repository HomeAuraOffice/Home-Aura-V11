const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

const oldModal = `            <!-- BULK DISPATCH SUCCESS MODAL -->
            <div v-if="activeModal === 'bulkDispatchSuccessModal'" class="space-y-4 text-xs">
              <div class="text-center py-2">
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3 shadow-inner">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">Bulk Factory Dispatch Completed!</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  <strong>{{ bulkDispatchSuccessData.count }} Orders</strong> assigned to <strong class="text-indigo-600 dark:text-indigo-400">{{ bulkDispatchSuccessData.factoryName }}</strong>
                </p>
              </div>

              <!-- PHOTO CLIPBOARD STATUS -->
              <div class="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5">
                <span class="text-base leading-none">📋</span>
                <div class="text-[11px] text-emerald-800 dark:text-emerald-200 leading-relaxed">
                  <strong>Composite Collages PNG Copied to Clipboard!</strong>
                  <div>All order collages and specifications were stitched into a single manifest image on your clipboard. Press <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-emerald-300 dark:border-emerald-700 font-mono text-[10px] font-bold">Ctrl+V</kbd> or <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-emerald-300 dark:border-emerald-700 font-mono text-[10px] font-bold">Cmd+V</kbd> in WhatsApp to paste.</div>
                </div>
              </div>

              <!-- PREVIEW THUMBNAIL -->
              <div v-if="bulkDispatchSuccessData.previewPngUrl" class="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div class="text-[10px] text-slate-400 font-medium mb-1.5 flex items-center justify-center gap-1">
                  <span>🖼️ Rendered Factory Batch Collage ({{ bulkDispatchSuccessData.count }} Orders)</span>
                </div>
                <img :src="bulkDispatchSuccessData.previewPngUrl" class="max-h-44 mx-auto rounded-lg border border-slate-800 object-contain shadow-md" />
              </div>

              <!-- ACTION BUTTONS -->
              <div class="space-y-2 pt-1">
                <a v-if="bulkDispatchSuccessData.waGroupLink" :href="bulkDispatchSuccessData.waGroupLink" target="_blank" rel="noopener noreferrer" class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer no-underline">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  <span>Open Factory WhatsApp Group</span>
                </a>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button @click="reCopyBulkPngToClipboard" type="button" class="py-2.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>📋 Re-Copy Collages PNG</span>
                  </button>
                  <button @click="copyBulkManifestText" type="button" class="py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <span v-if="bulkDispatchSuccessData.isCopiedText" class="text-emerald-600 dark:text-emerald-400 font-bold">✓ Copied Text!</span>
                    <span v-else>💬 Copy Manifest Text</span>
                  </button>
                </div>
              </div>

              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button @click="closeModal" type="button" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-all cursor-pointer">
                  Done / Close
                </button>
              </div>
            </div>`;

const newModal = `            <!-- BULK DISPATCH SUCCESS MODAL -->
            <div v-if="activeModal === 'bulkDispatchSuccessModal'" class="space-y-5 text-xs">
              <div class="text-center pt-4 pb-2">
                <div class="w-16 h-16 rounded-[20px] bg-gradient-to-br from-emerald-400 to-emerald-600 text-white mx-auto flex items-center justify-center mb-4 shadow-xl shadow-emerald-600/30 transform transition-transform hover:scale-105">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"/></svg>
                </div>
                <h3 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {{ bulkDispatchSuccessData.count > 1 ? 'Bulk Factory Dispatch Completed!' : 'Order Successfully Dispatched!' }}
                </h3>
                <p class="text-[13px] text-slate-600 dark:text-slate-300 mt-1.5 font-medium">
                  <strong>{{ bulkDispatchSuccessData.count }} Order{{ bulkDispatchSuccessData.count > 1 ? 's' : '' }}</strong> securely assigned to <strong class="text-emerald-600 dark:text-emerald-400 font-extrabold">{{ bulkDispatchSuccessData.factoryName }}</strong>
                </p>
              </div>

              <!-- PHOTO CLIPBOARD STATUS -->
              <div class="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 flex items-start gap-3 shadow-inner">
                <div class="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-800/60 flex items-center justify-center shrink-0 text-emerald-700 dark:text-emerald-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
                </div>
                <div class="text-[11px] text-emerald-900 dark:text-emerald-100 leading-relaxed">
                  <strong class="text-sm font-extrabold block mb-0.5">Manifest Ready in Clipboard</strong>
                  <div class="opacity-90">All {{ bulkDispatchSuccessData.count > 1 ? 'order collages and specifications were stitched' : 'collages and specs were stitched' }} into a single manifest image on your clipboard. Press <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-emerald-300 dark:border-emerald-700 font-mono text-[10px] font-bold shadow-sm">Ctrl+V</kbd> or <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-emerald-300 dark:border-emerald-700 font-mono text-[10px] font-bold shadow-sm">Cmd+V</kbd> in WhatsApp to paste.</div>
                </div>
              </div>

              <!-- PREVIEW THUMBNAIL -->
              <div v-if="bulkDispatchSuccessData.previewPngUrl" class="p-3 bg-slate-900 dark:bg-[#0f172a] rounded-2xl border border-slate-800 shadow-lg text-center group">
                <div class="text-[10px] text-slate-400 font-bold mb-2.5 flex items-center justify-center gap-1.5 tracking-wider uppercase">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <span>Generated {{ bulkDispatchSuccessData.count > 1 ? 'Batch' : 'Order' }} Manifest Preview</span>
                </div>
                <div class="relative inline-block">
                  <img :src="bulkDispatchSuccessData.previewPngUrl" class="max-h-52 mx-auto rounded-xl border border-slate-700/50 object-contain shadow-2xl transition-transform group-hover:scale-[1.02] duration-300" />
                  <div class="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none"></div>
                </div>
              </div>

              <!-- ACTION BUTTONS -->
              <div class="space-y-3 pt-2">
                <a v-if="bulkDispatchSuccessData.waGroupLink" :href="bulkDispatchSuccessData.waGroupLink" target="_blank" rel="noopener noreferrer" class="w-full py-3.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-extrabold text-[13px] rounded-xl shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer no-underline">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  <span>Open Factory WhatsApp Group</span>
                </a>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button v-if="bulkDispatchSuccessData.previewPngUrl" @click="reCopyBulkPngToClipboard" type="button" class="py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
                    <span>Re-Copy Manifest Image</span>
                  </button>
                  <button @click="copyBulkManifestText" type="button" class="py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                    <span v-if="bulkDispatchSuccessData.isCopiedText" class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Copied Text!</span>
                    <span v-else class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Copy Text Payload</span>
                  </button>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <svg class="w-3 h-3 animate-pulse text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  Manifest uploads to Drive securely on close
                </div>
                <button @click="closeModal" type="button" class="w-full sm:w-auto px-6 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-xs transition-transform active:scale-95 cursor-pointer shadow-md">
                  Upload Manifest & Close
                </button>
              </div>
            </div>`;

let count = 0;
indexHtml = indexHtml.replace(oldModal, () => {
    count++;
    return newModal;
});

fs.writeFileSync('index.html', indexHtml);
console.log('Replaced bulkDispatchSuccessModal HTML. Count: ', count);
