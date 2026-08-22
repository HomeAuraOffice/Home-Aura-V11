const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove original Live Multi-User Sync Pill (lines 290-309 approximately)
// Let's use a regex to replace it with an empty string.
html = html.replace(/<!-- Live Multi-User Sync Pill -->[\s\S]*?<\/button>/, '');

// Desktop Sidebar HA - expanded
html = html.replace(
  /<div class="flex items-center gap-3" v-if="!isSidebarCollapsed">\s*<div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">HA<\/div>\s*<div class="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-sm">HomeAura<\/div>\s*<\/div>/,
  `<div class="flex items-center gap-3" v-if="!isSidebarCollapsed">
            <button @click="syncFromGoogleSheets(true)" class="relative flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-md group shrink-0" :title="pendingSyncCount > 0 ? (pendingSyncCount + ' pending local change(s) - Click to pull/push') : 'Click to pull latest team updates from Google Sheets'">
              <!-- Sync Status Glow -->
              <div v-if="isPushing || isPulling" class="absolute -inset-1 border-2 border-indigo-400 border-t-white rounded-[11px] animate-spin shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
              <div v-else-if="syncStatus === 'error'" class="absolute -inset-1 border-2 border-rose-500 rounded-[11px]"></div>
              <div v-else-if="syncStatus === 'offline' || pendingSyncCount > 0" class="absolute -inset-1 border-2 border-amber-500 rounded-[11px]"></div>
              <div v-else class="absolute -inset-1 border-2 border-emerald-500 rounded-[11px] opacity-30 group-hover:opacity-100 transition-opacity"></div>
              HA
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

// Desktop Sidebar HA - collapsed
html = html.replace(
  /<div v-else class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">HA<\/div>/,
  `<button v-else @click="syncFromGoogleSheets(true)" class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-md shrink-0 group" :title="pendingSyncCount > 0 ? (pendingSyncCount + ' pending local change(s) - Click to pull/push') : 'Click to pull latest team updates from Google Sheets'">
            <!-- Sync Status Glow -->
            <div v-if="isPushing || isPulling" class="absolute -inset-1 border-2 border-indigo-400 border-t-white rounded-[14px] animate-spin shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
            <div v-else-if="syncStatus === 'error'" class="absolute -inset-1 border-2 border-rose-500 rounded-[14px]"></div>
            <div v-else-if="syncStatus === 'offline' || pendingSyncCount > 0" class="absolute -inset-1 border-2 border-amber-500 rounded-[14px]"></div>
            <div v-else class="absolute -inset-1 border-2 border-emerald-500 rounded-[14px] opacity-30 group-hover:opacity-100 transition-opacity"></div>
            HA
          </button>`
);

// Mobile Header HA
html = html.replace(
  /<div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-200 dark:shadow-none">\s*HA\s*<\/div>\s*<div>\s*<div class="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-base leading-tight flex items-center gap-2">\s*HomeAura\s*<span :class="\(currentUser.role === 'admin' \|\| currentUser.role === 'moderator'\) \? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'" class="px-2 py-0.5 text-\[10px\] uppercase font-bold rounded-full border">\s*\{\{ currentUser.role \}\}\s*<\/span>\s*<\/div>\s*<div class="text-\[11px\] text-slate-500 dark:text-slate-400 font-medium">Order Management Terminal<\/div>\s*<\/div>/,
  `<button @click="syncFromGoogleSheets(true)" class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-md shadow-indigo-200 dark:shadow-none group shrink-0" :title="pendingSyncCount > 0 ? (pendingSyncCount + ' pending local change(s) - Click to pull/push') : 'Click to pull latest team updates from Google Sheets'">
              <!-- Sync Status Glow -->
              <div v-if="isPushing || isPulling" class="absolute -inset-1 border-2 border-indigo-400 border-t-white rounded-[14px] animate-spin shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
              <div v-else-if="syncStatus === 'error'" class="absolute -inset-1 border-2 border-rose-500 rounded-[14px]"></div>
              <div v-else-if="syncStatus === 'offline' || pendingSyncCount > 0" class="absolute -inset-1 border-2 border-amber-500 rounded-[14px]"></div>
              <div v-else class="absolute -inset-1 border-2 border-emerald-500 rounded-[14px] opacity-30 group-hover:opacity-100 transition-opacity"></div>
              HA
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
            </div>`
);

fs.writeFileSync('index.html', html);
