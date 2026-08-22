const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace Block 1: Desktop Sidebar HA - expanded
html = html.replace(
  /<div class="flex items-center gap-3" v-if="!isSidebarCollapsed">\s*<button @click="syncFromGoogleSheets\(true\)" class="relative flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-md group shrink-0"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<div class="flex items-center gap-3" v-if="!isSidebarCollapsed">
            <button @click="syncFromGoogleSheets(true)" class="relative flex items-center justify-center w-8 h-8 group shrink-0 outline-none" :title="pendingSyncCount > 0 ? (pendingSyncCount + ' pending local change(s) - Click to pull/push') : 'Click to pull latest team updates from Google Sheets'">
              <!-- Sync Status Background (Static) -->
              <div v-if="!isPushing && !isPulling" class="absolute -inset-0.5 rounded-[10px] transition-opacity" :class="syncStatus === 'error' ? 'bg-rose-500' : (syncStatus === 'offline' || pendingSyncCount > 0 ? 'bg-amber-500' : 'bg-emerald-500 opacity-30 group-hover:opacity-100')"></div>

              <!-- Animated Border Line -->
              <div v-if="isPushing || isPulling" class="absolute -inset-[2px] rounded-[10px] overflow-hidden">
                <div class="absolute w-[250%] h-[250%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_2s_linear_infinite]" style="background: conic-gradient(from 0deg, transparent 40%, rgba(165,180,252,0.1) 70%, rgba(255,255,255,1) 100%);"></div>
              </div>

              <!-- Soft Outer Glow -->
              <div v-if="isPushing || isPulling" class="absolute -inset-2 rounded-full blur-[6px] animate-[spin_2s_linear_infinite]" style="background: conic-gradient(from 0deg, transparent 60%, rgba(99,102,241,0.6) 100%);"></div>

              <!-- Inner HA Block -->
              <div class="relative w-full h-full bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-inner overflow-hidden">
                <span class="relative z-10">HA</span>
              </div>
            </button>
            <div class="flex flex-col">
              <div class="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-sm leading-tight">HomeAura</div>
              <div class="text-[9px] font-bold tracking-wider" :class="isPushing || isPulling ? 'text-indigo-500 animate-pulse' : (syncStatus === 'error' ? 'text-rose-500' : (syncStatus === 'offline' ? 'text-amber-500' : (pendingSyncCount > 0 ? 'text-amber-500' : 'text-emerald-500')))">
                <template v-if="isPushing">PUSHING ({{ pendingSyncCount }})...</template>
                <template v-else-if="isPulling">SYNCING...</template>
                <template v-else-if="syncStatus === 'offline'">OFFLINE</template>
                <template v-else-if="syncStatus === 'error'">SYNC ERROR</template>
                <template v-else-if="pendingSyncCount > 0">{{ pendingSyncCount }} QUEUED</template>
                <template v-else>SYNCED</template>
              </div>
            </div>
          </div>`
);

// Replace Block 2: Desktop Sidebar HA - collapsed
html = html.replace(
  /<button v-else @click="syncFromGoogleSheets\(true\)" class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-md shrink-0 group"[\s\S]*?<\/button>/,
  `<button v-else @click="syncFromGoogleSheets(true)" class="relative flex items-center justify-center w-10 h-10 group shrink-0 outline-none" :title="pendingSyncCount > 0 ? (pendingSyncCount + ' pending local change(s) - Click to pull/push') : 'Click to pull latest team updates from Google Sheets'">
            <!-- Sync Status Background (Static) -->
            <div v-if="!isPushing && !isPulling" class="absolute -inset-0.5 rounded-[14px] transition-opacity" :class="syncStatus === 'error' ? 'bg-rose-500' : (syncStatus === 'offline' || pendingSyncCount > 0 ? 'bg-amber-500' : 'bg-emerald-500 opacity-30 group-hover:opacity-100')"></div>

            <!-- Animated Border Line -->
            <div v-if="isPushing || isPulling" class="absolute -inset-[2px] rounded-[14px] overflow-hidden">
              <div class="absolute w-[250%] h-[250%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_2s_linear_infinite]" style="background: conic-gradient(from 0deg, transparent 40%, rgba(165,180,252,0.1) 70%, rgba(255,255,255,1) 100%);"></div>
            </div>

            <!-- Soft Outer Glow -->
            <div v-if="isPushing || isPulling" class="absolute -inset-2 rounded-full blur-[6px] animate-[spin_2s_linear_infinite]" style="background: conic-gradient(from 0deg, transparent 60%, rgba(99,102,241,0.6) 100%);"></div>

            <!-- Inner HA Block -->
            <div class="relative w-full h-full bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner overflow-hidden">
              <span class="relative z-10">HA</span>
            </div>
          </button>`
);

// Replace Block 3: Mobile Header HA
html = html.replace(
  /<div class="flex md:hidden items-center gap-3">\s*<button @click="syncFromGoogleSheets\(true\)" class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-md shadow-indigo-200 dark:shadow-none group shrink-0"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<div class="flex md:hidden items-center gap-3">
            <button @click="syncFromGoogleSheets(true)" class="relative flex items-center justify-center w-10 h-10 group shrink-0 outline-none" :title="pendingSyncCount > 0 ? (pendingSyncCount + ' pending local change(s) - Click to pull/push') : 'Click to pull latest team updates from Google Sheets'">
              <!-- Sync Status Background (Static) -->
              <div v-if="!isPushing && !isPulling" class="absolute -inset-0.5 rounded-[14px] transition-opacity" :class="syncStatus === 'error' ? 'bg-rose-500' : (syncStatus === 'offline' || pendingSyncCount > 0 ? 'bg-amber-500' : 'bg-emerald-500 opacity-30 group-hover:opacity-100')"></div>

              <!-- Animated Border Line -->
              <div v-if="isPushing || isPulling" class="absolute -inset-[2px] rounded-[14px] overflow-hidden">
                <div class="absolute w-[250%] h-[250%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_2s_linear_infinite]" style="background: conic-gradient(from 0deg, transparent 40%, rgba(165,180,252,0.1) 70%, rgba(255,255,255,1) 100%);"></div>
              </div>

              <!-- Soft Outer Glow -->
              <div v-if="isPushing || isPulling" class="absolute -inset-2 rounded-full blur-[6px] animate-[spin_2s_linear_infinite]" style="background: conic-gradient(from 0deg, transparent 60%, rgba(99,102,241,0.6) 100%);"></div>

              <!-- Inner HA Block -->
              <div class="relative w-full h-full bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner overflow-hidden">
                <span class="relative z-10">HA</span>
              </div>
            </button>
            <div class="flex flex-col">
              <div class="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-base leading-tight flex items-center gap-2">
                HomeAura
                <span :class="(currentUser.role === 'admin' || currentUser.role === 'moderator') ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'" class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full border">
                  {{ currentUser.role }}
                </span>
              </div>
              <div class="text-[10px] font-bold tracking-wider flex items-center gap-1.5" :class="isPushing || isPulling ? 'text-indigo-500 animate-pulse' : (syncStatus === 'error' ? 'text-rose-500' : (syncStatus === 'offline' ? 'text-amber-500' : (pendingSyncCount > 0 ? 'text-amber-500' : 'text-emerald-500')))">
                <span v-if="isPushing || isPulling" class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span v-else-if="syncStatus === 'error'" class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span v-else-if="syncStatus === 'offline' || pendingSyncCount > 0" class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span v-else class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                
                <template v-if="isPushing">PUSHING ({{ pendingSyncCount }})...</template>
                <template v-else-if="isPulling">SYNCING...</template>
                <template v-else-if="syncStatus === 'offline'">OFFLINE</template>
                <template v-else-if="syncStatus === 'error'">SYNC ERROR</template>
                <template v-else-if="pendingSyncCount > 0">{{ pendingSyncCount }} QUEUED</template>
                <template v-else>SYNCED</template>
              </div>
            </div>
          </div>`
);

fs.writeFileSync('index.html', html);
