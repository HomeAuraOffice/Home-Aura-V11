const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const tasksPanelHtml = `
      <!-- Tasks & Notifications Slide-over Panel -->
      <div v-if="isTasksPanelOpen" class="fixed inset-0 z-[100] overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click="isTasksPanelOpen = false"></div>
        <div class="fixed inset-y-0 right-0 max-w-sm w-full flex">
          <div class="w-full h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-[slideInRight_0.3s_ease-out]">
            <div class="px-4 py-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Tasks & Notifications</span>
                <span v-if="unreadNotificationsCount > 0" class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400 text-xs font-bold">{{ unreadNotificationsCount }} new</span>
              </h2>
              <button @click="isTasksPanelOpen = false" class="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors">
                <span class="sr-only">Close panel</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 space-y-6">
              <!-- Create Task (Admin/Moderator/Marketer only) -->
              <div v-if="currentUser?.role === 'admin' || currentUser?.role === 'moderator' || currentUser?.role === 'marketer'" class="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                <h3 class="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3">Create New Task</h3>
                <div class="space-y-3">
                  <input v-model="newTask.title" type="text" placeholder="Task title..." class="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all">
                  <textarea v-model="newTask.description" placeholder="Optional description..." rows="2" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"></textarea>
                  <div class="flex gap-2">
                    <select v-model="newTask.assigneeRole" class="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all">
                      <option value="all">All Roles/Users</option>
                      <option value="admin">Admins</option>
                      <option value="moderator">Moderators</option>
                      <option value="seller">Sellers</option>
                      <option value="marketer">Digital Marketers</option>
                    </select>
                    <button @click="createNewTask(); isTasksPanelOpen = true;" :disabled="!newTask.title" class="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shrink-0">Assign</button>
                  </div>
                </div>
              </div>

              <!-- Tasks List -->
              <div class="space-y-3">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Your Tasks</h3>
                <div v-if="tasks.filter(t => t.status === 'pending' && (t.assigneeId === currentUser?.id || t.assigneeRole === currentUser?.role || t.assigneeRole === 'all')).length === 0" class="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                  No pending tasks right now. You're all caught up!
                </div>
                <div v-for="task in tasks.filter(t => t.status === 'pending' && (t.assigneeId === currentUser?.id || t.assigneeRole === currentUser?.role || t.assigneeRole === 'all'))" :key="task.id" class="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 group hover:border-indigo-300 dark:hover:border-indigo-700 transition-all relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                  <div class="pl-2">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <h4 class="font-bold text-slate-900 dark:text-white text-sm leading-tight">{{ task.title }}</h4>
                      <span class="shrink-0 text-[10px] font-medium text-slate-400">{{ new Date(task.createdAt).toLocaleDateString() }}</span>
                    </div>
                    <p v-if="task.description" class="text-xs text-slate-600 dark:text-slate-400 mb-3">{{ task.description }}</p>
                    <div class="flex items-center justify-between mt-3">
                      <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Pending
                      </span>
                      <button @click="markTaskDone(task)" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        Mark Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
`;

if (!html.includes('Tasks & Notifications Slide-over Panel')) {
  html = html.replace('  <!-- VUE 3 COMPOSITION / OPTIONS SCRIPT -->', tasksPanelHtml + '\n  <!-- VUE 3 COMPOSITION / OPTIONS SCRIPT -->');
  fs.writeFileSync('index.html', html);
  console.log('Injected panel');
} else {
  console.log('Already injected');
}
