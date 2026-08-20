const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const assignUi = `
              <div v-if="(currentUser.role === 'admin' || currentUser.role === 'moderator')" class="mb-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                <h4 class="font-bold text-xs text-indigo-700 dark:text-indigo-400 mb-2 uppercase tracking-wide">Assign New Task</h4>
                <div class="space-y-2">
                  <input v-model="newTask.title" type="text" placeholder="Task Title" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-indigo-500">
                  <textarea v-model="newTask.description" placeholder="Description..." rows="2" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-indigo-500"></textarea>
                  <div class="flex gap-2">
                    <select v-model="newTask.assigneeRole" class="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200">
                      <option value="all">All Roles</option>
                      <option value="admin">Admins Only</option>
                      <option value="moderator">Moderators Only</option>
                      <option value="seller">Sellers Only</option>
                    </select>
                    <button @click="createNewTask" :disabled="!newTask.title" class="px-3 py-2 bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm">Assign</button>
                  </div>
                </div>
              </div>
`;

code = code.replace(/<div class="flex-1 overflow-y-auto p-4 space-y-4">/, '<div class="flex-1 overflow-y-auto p-4 space-y-4">\n' + assignUi);
fs.writeFileSync('index.html', code);
