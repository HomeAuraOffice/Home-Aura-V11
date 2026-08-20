const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target = `            <!-- CONFIRM VOID MODAL -->
            <div v-if="activeModal === 'confirmVoid'" class="space-y-4 text-xs">`;

const replacement = `            <!-- GLOBAL CONFIRM MODAL -->
            <div v-if="activeModal === 'globalConfirm'" class="space-y-4 text-xs">
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {{ modalData.confirmMessage }}
              </p>
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button @click="closeModal" type="button" class="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all text-xs">
                  ✕ Cancel
                </button>
                <button @click="modalData.onConfirm" type="button" class="px-5 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition-all" :class="modalData.confirmButtonClass">
                  {{ modalData.confirmButtonText }}
                </button>
              </div>
            </div>

            <!-- CONFIRM VOID MODAL -->
            <div v-if="activeModal === 'confirmVoid'" class="space-y-4 text-xs">`;

code = code.replace(target, replacement);

fs.writeFileSync('index.html', code);
console.log("Updated index.html to add global confirm modal!");
