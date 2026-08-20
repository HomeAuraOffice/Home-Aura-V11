const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetHtml = `<button @click="activeTab = 'users'" class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Manage Targets &rarr;
                </button>`;
const replaceHtml = `<button v-if="currentUser.role === 'admin' || currentUser.role === 'moderator'" @click="activeTab = 'users'" class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Manage Targets &rarr;
                </button>`;

html = html.replace(targetHtml, replaceHtml);

fs.writeFileSync('index.html', html);
