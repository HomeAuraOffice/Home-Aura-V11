const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const replacer1 = `<button @click="syncFromGoogleSheets(true)" class="relative flex items-center justify-center w-8 h-8 group shrink-0 outline-none" :title="pendingSyncCount > 0 ? (pendingSyncCount + ' pending local change(s) - Click to pull/push') : 'Click to pull latest team updates from Google Sheets'">
              <!-- Base Static Indicators -->
              <div class="absolute -inset-0.5 rounded-[10px] transition-opacity duration-1000" :class="!isPushing && !isPulling && syncStatus === 'error' ? 'bg-rose-500 opacity-100' : 'opacity-0'"></div>
              <div class="absolute -inset-0.5 rounded-[10px] transition-opacity duration-1000" :class="!isPushing && !isPulling && (syncStatus === 'offline' || pendingSyncCount > 0) ? 'bg-amber-500 opacity-100' : 'opacity-0'"></div>
              <div class="absolute -inset-0.5 rounded-[10px] bg-emerald-500 transition-opacity duration-1000" :class="!isPushing && !isPulling && syncStatus !== 'error' && syncStatus !== 'offline' && pendingSyncCount === 0 ? 'opacity-30 group-hover:opacity-100' : 'opacity-0'"></div>

              <!-- Soft Outer Circulating Glow (Fades in smoothly) -->
              <div class="absolute -inset-2 rounded-full transition-all duration-1000 ease-in-out z-0 pointer-events-none" :class="isPushing || isPulling ? 'opacity-100 scale-100' : 'opacity-0 scale-75'">
                <div class="absolute inset-0 rounded-full animate-[spin_3s_linear_infinite] blur-[6px]" style="background: conic-gradient(from 0deg, transparent 50%, rgba(99,102,241,0.2) 70%, rgba(99,102,241,0.8) 100%);"></div>
              </div>

              <!-- Sharp Inner Circulating Border (Fades in smoothly) -->
              <div class="absolute -inset-[2px] rounded-[10px] overflow-hidden transition-all duration-1000 ease-in-out z-0 pointer-events-none" :class="isPushing || isPulling ? 'opacity-100' : 'opacity-0'">
                <div class="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite]" style="background: conic-gradient(from 0deg, transparent 50%, rgba(255,255,255,0.1) 80%, rgba(255,255,255,0.7) 100%);"></div>
              </div>

              <!-- Inner HA Block (Brightens during sync) -->
              <div class="relative w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-sm transition-all duration-1000 z-10 overflow-hidden" :class="isPushing || isPulling ? 'bg-indigo-500 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]' : 'bg-indigo-600 shadow-inner'">
                <span class="relative z-20 transition-all duration-1000" :class="isPushing || isPulling ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] scale-110' : 'scale-100'">HA</span>
              </div>
            </button>`;

const replacer2 = `<button v-else @click="syncFromGoogleSheets(true)" class="relative flex items-center justify-center w-10 h-10 group shrink-0 outline-none" :title="pendingSyncCount > 0 ? (pendingSyncCount + ' pending local change(s) - Click to pull/push') : 'Click to pull latest team updates from Google Sheets'">
            <!-- Base Static Indicators -->
            <div class="absolute -inset-0.5 rounded-[14px] transition-opacity duration-1000" :class="!isPushing && !isPulling && syncStatus === 'error' ? 'bg-rose-500 opacity-100' : 'opacity-0'"></div>
            <div class="absolute -inset-0.5 rounded-[14px] transition-opacity duration-1000" :class="!isPushing && !isPulling && (syncStatus === 'offline' || pendingSyncCount > 0) ? 'bg-amber-500 opacity-100' : 'opacity-0'"></div>
            <div class="absolute -inset-0.5 rounded-[14px] bg-emerald-500 transition-opacity duration-1000" :class="!isPushing && !isPulling && syncStatus !== 'error' && syncStatus !== 'offline' && pendingSyncCount === 0 ? 'opacity-30 group-hover:opacity-100' : 'opacity-0'"></div>

            <!-- Soft Outer Circulating Glow (Fades in smoothly) -->
            <div class="absolute -inset-2.5 rounded-full transition-all duration-1000 ease-in-out z-0 pointer-events-none" :class="isPushing || isPulling ? 'opacity-100 scale-100' : 'opacity-0 scale-75'">
              <div class="absolute inset-0 rounded-full animate-[spin_3s_linear_infinite] blur-[8px]" style="background: conic-gradient(from 0deg, transparent 50%, rgba(99,102,241,0.2) 70%, rgba(99,102,241,0.8) 100%);"></div>
            </div>

            <!-- Sharp Inner Circulating Border (Fades in smoothly) -->
            <div class="absolute -inset-[2px] rounded-[14px] overflow-hidden transition-all duration-1000 ease-in-out z-0 pointer-events-none" :class="isPushing || isPulling ? 'opacity-100' : 'opacity-0'">
              <div class="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite]" style="background: conic-gradient(from 0deg, transparent 50%, rgba(255,255,255,0.1) 80%, rgba(255,255,255,0.7) 100%);"></div>
            </div>

            <!-- Inner HA Block (Brightens during sync) -->
            <div class="relative w-full h-full rounded-xl flex items-center justify-center text-white font-bold text-lg transition-all duration-1000 z-10 overflow-hidden" :class="isPushing || isPulling ? 'bg-indigo-500 shadow-[inset_0_0_12px_rgba(255,255,255,0.2)]' : 'bg-indigo-600 shadow-inner'">
              <span class="relative z-20 transition-all duration-1000" :class="isPushing || isPulling ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] scale-110' : 'scale-100'">HA</span>
            </div>
          </button>`;

const replacer3 = `<button @click="syncFromGoogleSheets(true)" class="relative flex items-center justify-center w-10 h-10 group shrink-0 outline-none" :title="pendingSyncCount > 0 ? (pendingSyncCount + ' pending local change(s) - Click to pull/push') : 'Click to pull latest team updates from Google Sheets'">
              <!-- Base Static Indicators -->
              <div class="absolute -inset-0.5 rounded-[14px] transition-opacity duration-1000" :class="!isPushing && !isPulling && syncStatus === 'error' ? 'bg-rose-500 opacity-100' : 'opacity-0'"></div>
              <div class="absolute -inset-0.5 rounded-[14px] transition-opacity duration-1000" :class="!isPushing && !isPulling && (syncStatus === 'offline' || pendingSyncCount > 0) ? 'bg-amber-500 opacity-100' : 'opacity-0'"></div>
              <div class="absolute -inset-0.5 rounded-[14px] bg-emerald-500 transition-opacity duration-1000" :class="!isPushing && !isPulling && syncStatus !== 'error' && syncStatus !== 'offline' && pendingSyncCount === 0 ? 'opacity-30 group-hover:opacity-100' : 'opacity-0'"></div>

              <!-- Soft Outer Circulating Glow (Fades in smoothly) -->
              <div class="absolute -inset-2.5 rounded-full transition-all duration-1000 ease-in-out z-0 pointer-events-none" :class="isPushing || isPulling ? 'opacity-100 scale-100' : 'opacity-0 scale-75'">
                <div class="absolute inset-0 rounded-full animate-[spin_3s_linear_infinite] blur-[8px]" style="background: conic-gradient(from 0deg, transparent 50%, rgba(99,102,241,0.2) 70%, rgba(99,102,241,0.8) 100%);"></div>
              </div>

              <!-- Sharp Inner Circulating Border (Fades in smoothly) -->
              <div class="absolute -inset-[2px] rounded-[14px] overflow-hidden transition-all duration-1000 ease-in-out z-0 pointer-events-none" :class="isPushing || isPulling ? 'opacity-100' : 'opacity-0'">
                <div class="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite]" style="background: conic-gradient(from 0deg, transparent 50%, rgba(255,255,255,0.1) 80%, rgba(255,255,255,0.7) 100%);"></div>
              </div>

              <!-- Inner HA Block (Brightens during sync) -->
              <div class="relative w-full h-full rounded-xl flex items-center justify-center text-white font-bold text-lg transition-all duration-1000 z-10 overflow-hidden" :class="isPushing || isPulling ? 'bg-indigo-500 shadow-[inset_0_0_12px_rgba(255,255,255,0.2)]' : 'bg-indigo-600 shadow-inner'">
                <span class="relative z-20 transition-all duration-1000" :class="isPushing || isPulling ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] scale-110' : 'scale-100'">HA</span>
              </div>
            </button>`;

html = html.replace(/<button @click="syncFromGoogleSheets\(true\)" class="relative flex items-center justify-center w-8 h-8 group shrink-0 outline-none"[\s\S]*?<\/button>/, replacer1);
html = html.replace(/<button v-else @click="syncFromGoogleSheets\(true\)" class="relative flex items-center justify-center w-10 h-10 group shrink-0 outline-none"[\s\S]*?<\/button>/, replacer2);
html = html.replace(/<button @click="syncFromGoogleSheets\(true\)" class="relative flex items-center justify-center w-10 h-10 group shrink-0 outline-none"[\s\S]*?<\/button>/, replacer3);

fs.writeFileSync('index.html', html);
