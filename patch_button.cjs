const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldButton = `            <!-- Top Dark Mode Button -->
            <button @click="toggleDarkMode" type="button" :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
                    class="px-3 py-1.5 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    :class="isDarkMode ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-indigo-700 border-slate-200 hover:bg-indigo-50'">
              <span v-if="isDarkMode" class="flex items-center gap-1">
                <span>☀️</span>
                <span class="hidden sm:inline">Light Mode</span>
              </span>
              <span v-else class="flex items-center gap-1">
                <span>🌙</span>
                <span class="hidden sm:inline">Dark Mode</span>
              </span>
            </button>`;

const newButton = `            <!-- Top Dark Mode Button -->
            <button @click="toggleDarkMode" type="button" :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
                    class="relative overflow-hidden px-3 py-1.5 rounded-xl border transition-all duration-500 text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer group"
                    :class="isDarkMode ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-indigo-700 border-slate-200 hover:bg-indigo-50'">
              
              <!-- Icon Container -->
              <div class="relative w-4 h-4 flex items-center justify-center">
                <span class="absolute inset-0 flex items-center justify-center transition-all duration-500 transform"
                      :class="isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'">
                  ☀️
                </span>
                <span class="absolute inset-0 flex items-center justify-center transition-all duration-500 transform"
                      :class="isDarkMode ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'">
                  🌙
                </span>
              </div>
              
              <!-- Text Container -->
              <div class="relative overflow-hidden hidden sm:block w-[72px] h-[16px]">
                <span class="absolute inset-0 flex items-center transition-all duration-500 transform"
                      :class="isDarkMode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
                  Light Mode
                </span>
                <span class="absolute inset-0 flex items-center transition-all duration-500 transform"
                      :class="isDarkMode ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'">
                  Dark Mode
                </span>
              </div>
            </button>`;

// we might have slightly different spacing or moon emoji missing in grep. Let's do a regex replacement.

html = html.replace(/<!-- Top Dark Mode Button -->[\s\S]*?<\/button>/, newButton);

fs.writeFileSync('index.html', html);
console.log("Patched button");
