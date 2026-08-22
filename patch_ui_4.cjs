const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const replacer1 = `<button @click="syncFromGoogleSheets(true)" class="relative flex items-center justify-center w-8 h-8 group shrink-0 outline-none" :title="pendingSyncCount > 0 ? (pendingSyncCount + ' pending local change(s) - Click to pull/push') : 'Click to pull latest team updates from Google Sheets'">
              <!-- Base Static Indicators -->
              <div class="absolute -inset-0.5 rounded-[10px] transition-opacity duration-700" :class="!isPushing && !isPulling && syncStatus === 'error' ? 'bg-rose-500 opacity-100' : 'opacity-0'"></div>
              <div class="absolute -inset-0.5 rounded-[10px] transition-opacity duration-700" :class="!isPushing && !isPulling && (syncStatus === 'offline' || pendingSyncCount > 0) ? 'bg-amber-500 opacity-100' : 'opacity-0'"></div>
              <div class="absolute -inset-0.5 rounded-[10px] bg-emerald-500 transition-opacity duration-700" :class="!isPushing && !isPulling && syncStatus !== 'error' && syncStatus !== 'offline' && pendingSyncCount === 0 ? 'opacity-30 group-hover:opacity-100' : 'opacity-0'"></div>

              <!-- Deep Ambient Glow (when syncing) -->
              <div class="absolute -inset-1 rounded-xl bg-indigo-400 transition-all duration-700 ease-in-out z-0 pointer-events-none blur-md" :class="isPushing || isPulling ? 'opacity-80 animate-pulse' : 'opacity-0'"></div>

              <!-- Inner HA Block -->
              <div class="relative w-full h-full rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-700 z-10 border border-white/10" :class="isPushing || isPulling ? 'bg-indigo-500 shadow-[inset_0_0_12px_rgba(255,255,255,0.3)]' : 'bg-indigo-600 shadow-inner'">
                <span class="relative z-20 transition-all duration-700" :class="isPushing || isPulling ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)] scale-110' : 'text-white/90 scale-100'">HA</span>
              </div>
            </button>`;

const replacer2 = `<button v-else @click="syncFromGoogleSheets(true)" class="relative flex items-center justify-center w-10 h-10 group shrink-0 outline-none" :title="pendingSyncCount > 0 ? (pendingSyncCount + ' pending local change(s) - Click to pull/push') : 'Click to pull latest team updates from Google Sheets'">
            <!-- Base Static Indicators -->
            <div class="absolute -inset-0.5 rounded-[14px] transition-opacity duration-700" :class="!isPushing && !isPulling && syncStatus === 'error' ? 'bg-rose-500 opacity-100' : 'opacity-0'"></div>
            <div class="absolute -inset-0.5 rounded-[14px] transition-opacity duration-700" :class="!isPushing && !isPulling && (syncStatus === 'offline' || pendingSyncCount > 0) ? 'bg-amber-500 opacity-100' : 'opacity-0'"></div>
            <div class="absolute -inset-0.5 rounded-[14px] bg-emerald-500 transition-opacity duration-700" :class="!isPushing && !isPulling && syncStatus !== 'error' && syncStatus !== 'offline' && pendingSyncCount === 0 ? 'opacity-30 group-hover:opacity-100' : 'opacity-0'"></div>

            <!-- Deep Ambient Glow (when syncing) -->
            <div class="absolute -inset-1.5 rounded-2xl bg-indigo-400 transition-all duration-700 ease-in-out z-0 pointer-events-none blur-md" :class="isPushing || isPulling ? 'opacity-80 animate-pulse' : 'opacity-0'"></div>

            <!-- Inner HA Block -->
            <div class="relative w-full h-full rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-700 z-10 border border-white/10" :class="isPushing || isPulling ? 'bg-indigo-500 shadow-[inset_0_0_12px_rgba(255,255,255,0.3)]' : 'bg-indigo-600 shadow-inner'">
              <span class="relative z-20 transition-all duration-700" :class="isPushing || isPulling ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)] scale-110' : 'text-white/90 scale-100'">HA</span>
            </div>
          </button>`;

const replacer3 = `<button @click="syncFromGoogleSheets(true)" class="relative flex items-center justify-center w-10 h-10 group shrink-0 outline-none" :title="pendingSyncCount > 0 ? (pendingSyncCount + ' pending local change(s) - Click to pull/push') : 'Click to pull latest team updates from Google Sheets'">
              <!-- Base Static Indicators -->
              <div class="absolute -inset-0.5 rounded-[14px] transition-opacity duration-700" :class="!isPushing && !isPulling && syncStatus === 'error' ? 'bg-rose-500 opacity-100' : 'opacity-0'"></div>
              <div class="absolute -inset-0.5 rounded-[14px] transition-opacity duration-700" :class="!isPushing && !isPulling && (syncStatus === 'offline' || pendingSyncCount > 0) ? 'bg-amber-500 opacity-100' : 'opacity-0'"></div>
              <div class="absolute -inset-0.5 rounded-[14px] bg-emerald-500 transition-opacity duration-700" :class="!isPushing && !isPulling && syncStatus !== 'error' && syncStatus !== 'offline' && pendingSyncCount === 0 ? 'opacity-30 group-hover:opacity-100' : 'opacity-0'"></div>

              <!-- Deep Ambient Glow (when syncing) -->
              <div class="absolute -inset-1.5 rounded-2xl bg-indigo-400 transition-all duration-700 ease-in-out z-0 pointer-events-none blur-md" :class="isPushing || isPulling ? 'opacity-80 animate-pulse' : 'opacity-0'"></div>

              <!-- Inner HA Block -->
              <div class="relative w-full h-full rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-700 z-10 border border-white/10" :class="isPushing || isPulling ? 'bg-indigo-500 shadow-[inset_0_0_12px_rgba(255,255,255,0.3)]' : 'bg-indigo-600 shadow-inner'">
                <span class="relative z-20 transition-all duration-700" :class="isPushing || isPulling ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)] scale-110' : 'text-white/90 scale-100'">HA</span>
              </div>
            </button>`;

html = html.replace(/<button @click="syncFromGoogleSheets\(true\)" class="relative flex items-center justify-center w-8 h-8 group shrink-0 outline-none"[\s\S]*?<\/button>/, replacer1);
html = html.replace(/<button v-else @click="syncFromGoogleSheets\(true\)" class="relative flex items-center justify-center w-10 h-10 group shrink-0 outline-none"[\s\S]*?<\/button>/, replacer2);
html = html.replace(/<button @click="syncFromGoogleSheets\(true\)" class="relative flex items-center justify-center w-10 h-10 group shrink-0 outline-none"[\s\S]*?<\/button>/, replacer3);

fs.writeFileSync('index.html', html);
