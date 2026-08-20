const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const panelHtml = `
    <!-- TASKS & NOTIFICATIONS SLIDEOVER -->
    <transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="isTasksPanelOpen" class="fixed inset-0 z-[100] flex justify-end">
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" @click="isTasksPanelOpen = false"></div>
        <transition enter-active-class="transition-transform duration-300 transform" enter-from-class="translate-x-full" enter-to-class="translate-x-0" leave-active-class="transition-transform duration-300 transform" leave-from-class="translate-x-0" leave-to-class="translate-x-full">
          <div v-if="isTasksPanelOpen" class="relative w-full max-w-sm h-full bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col pointer-events-auto">
            <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-950">
              <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                Tasks & Notifications
              </h3>
              <button @click="isTasksPanelOpen = false" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              <div v-if="tasks.filter(t => t.assigneeRole === currentUser.role || t.assigneeId === currentUser.id || t.assigneeRole === 'all').length === 0" class="text-center text-slate-500 dark:text-slate-400 mt-10 text-sm">
                No tasks or notifications right now.
              </div>
              <div v-for="task in tasks.filter(t => t.assigneeRole === currentUser.role || t.assigneeId === currentUser.id || t.assigneeRole === 'all').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))" :key="task.id" :class="task.status === 'completed' ? 'opacity-50' : 'bg-white dark:bg-slate-800 shadow-sm border-indigo-100 dark:border-indigo-900'" class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-all">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200" :class="task.status === 'completed' ? 'line-through' : ''">{{ task.title }}</h4>
                  <span v-if="task.status === 'pending'" class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900">Pending</span>
                  <span v-else class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900">Done</span>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed" :class="task.status === 'completed' ? 'line-through' : ''">{{ task.description }}</p>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-[10px] text-slate-400">{{ new Date(task.createdAt).toLocaleDateString() }}</span>
                  <button v-if="task.status === 'pending'" @click="task.status = 'completed'; task.updatedAt = new Date().toISOString(); syncQueue.changes.tasks = syncQueue.changes.tasks || {}; syncQueue.changes.tasks[task.id] = true; saveSyncQueue();" class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Mark Done</button>
                  <button v-if="task.status === 'completed'" @click="task.status = 'pending'; task.updatedAt = new Date().toISOString(); syncQueue.changes.tasks = syncQueue.changes.tasks || {}; syncQueue.changes.tasks[task.id] = true; saveSyncQueue();" class="text-xs font-semibold text-slate-500 hover:underline">Reopen</button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
`;

code = code.replace(/<\/div>\n  <!-- VUE 3 COMPOSITION \/ OPTIONS SCRIPT -->/, panelHtml + '\n  </div>\n  <!-- VUE 3 COMPOSITION / OPTIONS SCRIPT -->');
fs.writeFileSync('index.html', code);
