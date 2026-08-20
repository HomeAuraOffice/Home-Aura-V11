const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

const oldCollageHtml = `              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Collage Photo Attachment URL / File</label>
                <input v-model="modalData.order.collagePhotoUrl" type="url" placeholder="https://..." class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none" />
                <div v-if="modalData.order.collagePhotoFileName" class="mt-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                  Local Filename: {{ modalData.order.collagePhotoFileName }}
                </div>
              </div>`;

const newCollageHtml = `              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Product Collage / Final Setup Photo</span>
                  <span v-if="selectedCollageTile === 'modal'" class="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold uppercase animate-pulse">
                    🎯 Selected
                  </span>
                </label>
                <div class="space-y-2">
                  <div @click="selectCollageTile('modal')"
                       tabindex="0"
                       @focus="selectCollageTile('modal')"
                       @paste="handleCollagePaste($event, modalData.order)"
                       @dragover.prevent
                       @drop="handleCollageDrop($event, modalData.order)"
                       :class="selectedCollageTile === 'modal' ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/80 ring-4 ring-emerald-500/25 shadow-md scale-[1.01]' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-400'"
                       class="p-3 border border-dashed rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 cursor-pointer transition-all outline-none">
                    
                    <input type="file" ref="modalCollageInput" accept="image/*" @change="handleCollageFileUpload($event, modalData.order)" class="hidden" />
                    
                    <div class="text-[11px] text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">🖼️</span>
                      <span v-if="selectedCollageTile === 'modal'" class="text-emerald-600 dark:text-emerald-300 font-extrabold">
                        🎯 Tile Selected! Press <kbd class="bg-emerald-200 dark:bg-emerald-900 px-1 rounded font-mono text-[9px]">Ctrl+V</kbd> to paste photo
                      </span>
                      <span v-else>
                        Click tile to select & press <kbd class="bg-slate-200 dark:bg-slate-700 px-1 rounded font-mono text-[9px]">Ctrl+V</kbd> to paste
                      </span>
                    </div>
                    <button type="button" @click.stop="$refs.modalCollageInput.click()" class="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-lg transition-all cursor-pointer shadow-sm">
                      📁 Browse File
                    </button>
                  </div>
                  
                  <div v-if="modalData.order.collagePhotoUrl || modalData.order.collagePhotoLocalUrl" class="p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                    <div class="flex items-center gap-2 cursor-pointer" @click="openPhotoModal(modalData.order.collagePhotoLocalUrl || modalData.order.collagePhotoUrl, 'Product Collage')">
                      <img :src="modalData.order.collagePhotoLocalUrl || modalData.order.collagePhotoUrl" class="w-10 h-10 object-cover rounded-md border border-emerald-300 dark:border-emerald-700 shadow-sm" />
                      <div class="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                        Collage Ready
                        <div v-if="modalData.order.collagePhotoFileName" class="font-mono font-medium text-[9px] text-emerald-600/70 dark:text-emerald-400/70">{{ modalData.order.collagePhotoFileName }}</div>
                      </div>
                    </div>
                    <button type="button" @click="modalData.order.collagePhotoUrl = ''; modalData.order.collagePhotoLocalUrl = ''; modalData.order.collagePhotoFileName = '';" class="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-500 rounded-lg transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </div>
                </div>
              </div>`;

indexHtml = indexHtml.replace(oldCollageHtml, newCollageHtml);
fs.writeFileSync('index.html', indexHtml);
console.log('Replaced collage html');
