const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

const oldProofHtml = `                  <div v-if="modalData.order.socialProofUrl" class="p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <img :src="modalData.order.socialProofUrl" @click="openPhotoModal(modalData.order.socialProofUrl, 'Proof - ' + modalData.order.id)" class="w-10 h-10 object-cover rounded border border-emerald-300 dark:border-emerald-700 cursor-pointer" title="Click to inspect proof" />
                      <div class="text-[10px] text-emerald-900 dark:text-emerald-200 font-bold">
                        Proof Screenshot Attached
                        <div class="font-mono text-[9px] font-normal text-emerald-700 dark:text-emerald-400 truncate max-w-[150px]">{{ modalData.order.socialProofFileName || 'chat_proof.png' }}</div>
                      </div>
                    </div>
                    <button type="button" @click="modalData.order.socialProofUrl = ''; modalData.order.socialProofFileName = '';" class="text-rose-600 dark:text-rose-400 text-[10px] font-bold p-1">
                      Remove
                    </button>
                  </div>`;

const newProofHtml = `                  <div v-if="modalData.order.socialProofUrl || modalData.order.socialProofLocalUrl" class="p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <img :src="modalData.order.socialProofLocalUrl || modalData.order.socialProofUrl" @click="openPhotoModal(modalData.order.socialProofLocalUrl || modalData.order.socialProofUrl, 'Proof - ' + modalData.order.id)" class="w-10 h-10 object-cover rounded border border-emerald-300 dark:border-emerald-700 cursor-pointer" title="Click to inspect proof" />
                      <div class="text-[10px] text-emerald-900 dark:text-emerald-200 font-bold">
                        Proof Screenshot Attached
                        <div class="font-mono text-[9px] font-normal text-emerald-700 dark:text-emerald-400 truncate max-w-[150px]">{{ modalData.order.socialProofFileName || 'chat_proof.png' }}</div>
                      </div>
                    </div>
                    <button type="button" @click="modalData.order.socialProofUrl = ''; modalData.order.socialProofLocalUrl = ''; modalData.order.socialProofFileName = '';" class="text-rose-600 dark:text-rose-400 text-[10px] font-bold p-1">
                      Remove
                    </button>
                  </div>`;

indexHtml = indexHtml.replace(oldProofHtml, newProofHtml);
fs.writeFileSync('index.html', indexHtml);
console.log('Fixed Proof section in modal');
