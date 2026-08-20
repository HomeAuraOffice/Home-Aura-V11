const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/<button @click="activeTab = 'payables_audit'" :class="activeTab === 'payables_audit' \? 'bg-white[^>]+>([\s\S]*?)<\/button>/, '<button v-if="currentUser.role === \'admin\'" @click="activeTab = \'payables_audit\'" :class="activeTab === \'payables_audit\' ? \'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold\' : \'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium\'" class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5">$1</button>');

code = code.replace(/<button @click="activeTab = 'finance'" :class="activeTab === 'finance' \? 'bg-white[^>]+>([\s\S]*?)<\/button>/, '<button v-if="currentUser.role === \'admin\'" @click="activeTab = \'finance\'" :class="activeTab === \'finance\' ? \'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold\' : \'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium\'" class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5">$1</button>');

code = code.replace(/<button @click="activeTab = 'trash'" :class="activeTab === 'trash' \? 'bg-white[^>]+>([\s\S]*?)<\/button>/, '<button v-if="currentUser.role === \'admin\'" @click="activeTab = \'trash\'" :class="activeTab === \'trash\' ? \'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs font-semibold\' : \'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium\'" class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5">$1</button>');

code = code.replace(/<button @click="activeTab = 'settings'" :class="activeTab === 'settings' \? 'bg-white[^>]+>([\s\S]*?)<\/button>/, '<button v-if="currentUser.role === \'admin\'" @click="activeTab = \'settings\'" :class="activeTab === \'settings\' ? \'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold\' : \'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium\'" class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5">$1</button>');


// Mobile navigation
code = code.replace(/<button @click="activeTab = 'payables_audit'" :class="activeTab === 'payables_audit'[^\n]+<\/button>/, '<button v-if="currentUser.role === \'admin\'" @click="activeTab = \'payables_audit\'" :class="activeTab === \'payables_audit\' ? \'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-semibold\' : \'text-slate-600 dark:text-slate-300\'" class="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap">Payables Audit</button>');

code = code.replace(/<button @click="activeTab = 'trash'" :class="activeTab === 'trash'[^\n]+<\/button>/, '<button v-if="currentUser.role === \'admin\'" @click="activeTab = \'trash\'" :class="activeTab === \'trash\' ? \'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-semibold\' : \'text-slate-600 dark:text-slate-300\'" class="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap">Trash</button>');

code = code.replace(/<button @click="activeTab = 'settings'" :class="activeTab === 'settings'[^\n]+<\/button>/, '<button v-if="currentUser.role === \'admin\'" @click="activeTab = \'settings\'" :class="activeTab === \'settings\' ? \'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold\' : \'text-slate-600 dark:text-slate-300\'" class="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap">Settings</button>');


fs.writeFileSync('index.html', code);
