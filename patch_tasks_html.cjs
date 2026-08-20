const fs = require('fs');
let htmlCode = fs.readFileSync('index.html', 'utf8');

const tasksPanelHtml = `
    <!-- Slide-over Tasks & Notifications Panel -->
    <div v-show="isTasksPanelOpen" class="relative z-50" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm transition-opacity" @click="isTasksPanelOpen = false"></div>
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-auto fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <div class="flex h-full flex-col overflow-y-scroll bg-white dark:bg-slate-900 shadow-2xl w-screen sm:max-w-md ring-1 ring-slate-200 dark:ring-slate-800">
              <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur z-10">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                  Tasks & Alerts
                </h2>
                <button type="button" @click="isTasksPanelOpen = false" class="rounded-md bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 transition-colors">
                  <span class="sr-only">Close panel</span>
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <!-- Create Task (Admin/Moderator) -->
              <div v-if="currentUser?.role === 'admin' || currentUser?.role === 'moderator'" class="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Assign New Task</h3>
                <div class="space-y-3">
                  <input v-model="newTask.title" type="text" placeholder="Task title..." class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  <textarea v-model="newTask.description" placeholder="Description..." rows="2" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"></textarea>
                  <div class="flex gap-2">
                    <select v-model="newTask.assigneeRole" class="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-sm focus:outline-none">
                      <option value="all">All Roles</option>
                      <option value="seller">Sellers</option>
                      <option value="moderator">Moderators</option>
                      <option value="admin">Admins</option>
                      <option value="specific">Specific User...</option>
                    </select>
                    <select v-if="newTask.assigneeRole === 'specific'" v-model="newTask.assigneeId" class="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-sm focus:outline-none">
                      <option disabled value="">Select User</option>
                      <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }} (@{{ u.username }})</option>
                    </select>
                  </div>
                  <button @click="createNewTask" :disabled="!newTask.title" class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                    Assign Task
                  </button>
                </div>
              </div>

              <!-- Task List -->
              <div class="flex-1 p-4 space-y-4">
                <div v-for="task in tasks.filter(t => t.status === 'pending' && (t.assigneeId === currentUser?.id || t.assigneeRole === currentUser?.role || t.assigneeRole === 'all'))" :key="task.id" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm relative group overflow-hidden">
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                  <div class="flex justify-between items-start mb-1 pl-2">
                    <h4 class="font-bold text-slate-900 dark:text-slate-100 text-sm">{{ task.title }}</h4>
                    <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap">{{ new Date(task.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-400 pl-2 mb-3 leading-relaxed">{{ task.description }}</p>
                  <div class="pl-2 flex gap-2">
                    <button @click="task.status = 'completed'; syncQueue.changes.tasks = syncQueue.changes.tasks || {}; syncQueue.changes.tasks[task.id] = true;" class="text-xs px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                      Mark Done
                    </button>
                  </div>
                </div>
                
                <div v-if="tasks.filter(t => t.status === 'pending' && (t.assigneeId === currentUser?.id || t.assigneeRole === currentUser?.role || t.assigneeRole === 'all')).length === 0" class="text-center py-10 opacity-60">
                   <div class="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                     <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"></path></svg>
                   </div>
                   <p class="text-sm font-medium text-slate-500">You're all caught up!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
`;

if (!htmlCode.includes('isTasksPanelOpen" class="relative z-50"')) {
    htmlCode = htmlCode.replace('<!-- End Main Content -->', '<!-- End Main Content -->\n\n' + tasksPanelHtml);
    fs.writeFileSync('index.html', htmlCode);
}
