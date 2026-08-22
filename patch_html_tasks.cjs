const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetHtml = `                    <select v-model="newTask.assigneeRole" class="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all">
                      <option value="all">All Roles/Users</option>
                      <option value="admin">Admins</option>
                      <option value="moderator">Moderators</option>
                      <option value="seller">Sellers</option>
                      <option value="marketer">Digital Marketers</option>
                    </select>
                    <button @click="createNewTask(); isTasksPanelOpen = true;" :disabled="!newTask.title" class="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shrink-0">Assign</button>
                  </div>`;

const newHtml = `                    <select v-model="newTask.assigneeRole" @change="newTask.assigneeIds = []" class="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all">
                      <option value="all">All Roles/Users</option>
                      <option value="admin">Admins</option>
                      <option value="moderator">Moderators</option>
                      <option value="seller">Sellers</option>
                      <option value="marketer">Digital Marketers</option>
                    </select>
                    <button @click="createNewTask();" :disabled="!newTask.title" class="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shrink-0">Assign</button>
                  </div>
                  
                  <!-- Specific User Selection Checkboxes -->
                  <div v-if="newTask.assigneeRole !== 'all'" class="mt-3 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg max-h-40 overflow-y-auto space-y-1 shadow-inner">
                    <label class="flex items-center gap-2.5 p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg cursor-pointer transition-colors group">
                      <input type="checkbox" :checked="newTask.assigneeIds.length === 0" @change="newTask.assigneeIds = []" class="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600">
                      <span class="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300">All {{ newTask.assigneeRole }}s (Broadcast)</span>
                    </label>
                    
                    <label v-for="u in users.filter(usr => usr.role === newTask.assigneeRole)" :key="u.id" class="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors group">
                      <input type="checkbox" :value="u.id" v-model="newTask.assigneeIds" class="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600">
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">{{ u.name }}</span>
                        <span class="text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">@{{ u.username }}</span>
                      </div>
                    </label>
                  </div>`;

html = html.replace(targetHtml, newHtml);
fs.writeFileSync('index.html', html);
