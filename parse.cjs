const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// We want to insert the Sidebar BEFORE the Top Navigation Header.
const mainPortalStart = `    <!-- MAIN AUTHENTICATED SYSTEM PORTAL -->\n    <div v-else class="flex-1 flex flex-col">`;
const mainPortalNew = `    <!-- MAIN AUTHENTICATED SYSTEM PORTAL -->\n    <div v-else class="flex-1 flex flex-col md:flex-row relative">`;
html = html.replace(mainPortalStart, mainPortalNew);

// We want to extract the Center Navigation Tabs.
const navRegex = /<!-- Center Navigation Tabs -->[\s\S]*?<\/nav>/;
const navMatch = html.match(navRegex);
const navHtml = navMatch ? navMatch[0] : '';
if (navHtml) {
    html = html.replace(navHtml, '');
}

// Adjust the nav classes for sidebar layout
let sidebarNav = navHtml;
sidebarNav = sidebarNav.replace('hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700', 'flex flex-col gap-1.5 w-full');
// Make buttons look good in vertical sidebar
sidebarNav = sidebarNav.replace(/class="px-3\.5 py-1\.5 rounded-lg text-xs transition-all flex items-center gap-1\.5"/g, 'class="px-3.5 py-2.5 rounded-lg text-xs transition-all flex items-center gap-3 w-full text-left"');
// We need to conditionally hide text when collapsed
sidebarNav = sidebarNav.replace(/>\s*(Analytics Dashboard)\s*<\/button>/g, '><span v-show="!isSidebarCollapsed">$1</span></button>');
sidebarNav = sidebarNav.replace(/>\s*(Master Order Ledger)\s*<\/button>/g, '><span v-show="!isSidebarCollapsed">$1</span></button>');
sidebarNav = sidebarNav.replace(/>\s*(Factories & Priority)\s*<\/button>/g, '><span v-show="!isSidebarCollapsed">$1</span></button>');
sidebarNav = sidebarNav.replace(/>\s*(Payables Audit)\s*<\/button>/g, '><span v-show="!isSidebarCollapsed">$1</span></button>');
sidebarNav = sidebarNav.replace(/>\s*(Finance Ledger)\s*<\/button>/g, '><span v-show="!isSidebarCollapsed">$1</span></button>');
sidebarNav = sidebarNav.replace(/>\s*(Trash)\s*<\/button>/g, '><span v-show="!isSidebarCollapsed">$1</span></button>');
sidebarNav = sidebarNav.replace(/>\s*(Settings)\s*<\/button>/g, '><span v-show="!isSidebarCollapsed">$1</span></button>');
sidebarNav = sidebarNav.replace(/>\s*(Order Registration Terminal)\s*<\/button>/g, '><span v-show="!isSidebarCollapsed">$1</span></button>');
sidebarNav = sidebarNav.replace(/>\s*(My Submitted Logs \(\{\{ myOrdersCount \}\}\))\s*<\/button>/g, '><span v-show="!isSidebarCollapsed">$1</span></button>');

// Wait, the icons should be larger or stay the same. In the header they are w-4 h-4.
sidebarNav = sidebarNav.replace(/w-4 h-4/g, 'w-5 h-5 shrink-0');

const sidebarHtml = `
      <!-- DESKTOP SIDEBAR -->
      <aside class="hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 sticky top-0 h-screen overflow-y-auto"
             :class="isSidebarCollapsed ? 'w-20' : 'w-64'">
        <div class="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800" :class="isSidebarCollapsed ? 'justify-center' : 'justify-between'">
          <div class="flex items-center gap-3" v-if="!isSidebarCollapsed">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">HA</div>
            <div class="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-sm">HomeAura</div>
          </div>
          <div v-else class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">HA</div>
          
          <button @click="isSidebarCollapsed = !isSidebarCollapsed" v-if="!isSidebarCollapsed" class="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          <button @click="isSidebarCollapsed = !isSidebarCollapsed" v-if="isSidebarCollapsed" class="mb-4 mx-auto p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Expand Sidebar">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
          </button>

          ${sidebarNav}
        </div>
      </aside>
      
      <!-- MAIN CONTENT WRAPPER -->
      <div class="flex-1 flex flex-col min-w-0">
`;

// Insert the sidebar right before the Top Navigation Header
const headerRegex = /<!-- Top Navigation Header -->/;
html = html.replace(headerRegex, sidebarHtml + '\n      <!-- Top Navigation Header -->');

// In the header, hide the Left Brand Identity on desktop since it's in the sidebar
html = html.replace('<!-- Left Brand Identity -->\n          <div class="flex items-center gap-3">', '<!-- Left Brand Identity (Mobile Only) -->\n          <div class="flex md:hidden items-center gap-3">');

// Finally, we need to close the MAIN CONTENT WRAPPER at the end of the authenticated system portal.
// We can just add a </div> right before the final closing div of the app.
html = html.replace(/<\/div>\n  <\/div>\n  <!-- Vue App Initialization -->/g, '  </div>\n    </div>\n  </div>\n  <!-- Vue App Initialization -->');

fs.writeFileSync('index.html', html);
console.log('Sidebar integrated.');
