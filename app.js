    const { createApp, ref, reactive, computed, onMounted, watch } = Vue;

    createApp({
      setup() {
        // --- 8-STAGE WORKFLOW PIPELINE ---
        const pipelineStages = [
          'Confirmation Call',
          'Courier Booking',
          'Factory Submit',
          'Courier Pending',
          'Delivered',
          'Partial Delivered',
          'Returned from Customer',
          'Returned Received'
        ];

        // --- SEEDING DEFAULT USERS ---
        const defaultUsers = [
          { id: 'u1', username: 'admin', password: 'changeme123', name: 'Master Admin', role: 'admin', active: true, target: 0 }
        ];

        // --- SEEDING DEFAULT FACTORIES ---
        const defaultFactories = [];

        const sampleCollagePresets = [
          { name: 'Royal Velvet Sofa', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80' },
          { name: 'Modern Leatherette', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80' },
          { name: 'Minimalist Dining', url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80' },
          { name: 'Chesterfield Armchair', url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80' }
        ];

        // --- EMPTY INITIAL BOOTSTRAP ORDERS (DATA LOADS FROM GOOGLE SHEETS) ---
        const defaultOrders = [];

        const defaultCategories = ['L-Shape Sofa', 'Sofa Set', 'Recliner Chair', 'Dining Table', 'Custom Bed', 'Living Room Accessories'];

        // --- REACTIVE STATE MANAGEMENT ---
        const users = ref([]);
        const orders = ref([]);
        const deletedOrders = ref([]);
        const selectedOrders = ref(new Set());
        const categories = ref([]);
        const factories = ref([]);
        const factoryBills = ref([]);
        const expenses = ref([]);
        const marketingSpends = ref([]);
        const marketingSpendFilterDate = ref(new Date().toISOString().split('T')[0]);
        const tasks = ref([]);
        const notifications = ref([]);
        const currentUser = ref(null);
        const isUserOnline = (timeStr) => {
          if (!timeStr) return false;
          return (Date.now() - new Date(timeStr).getTime()) < 5 * 60000;
        };
        
        const newTask = reactive({ title: '', description: '', assigneeRole: 'all', assigneeId: '', assigneeIds: [] });
        
        const markTaskDone = (task) => {
          task.status = 'completed';
          syncQueue.value.changes.tasks = syncQueue.value.changes.tasks || {};
          syncQueue.value.changes.tasks[task.id] = true;
          saveSyncQueue();
        };

        const createNewTask = () => {
          if (!newTask.title) return;
          const taskId = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
          tasks.value.unshift({
            id: taskId,
            title: newTask.title,
            description: newTask.description,
            status: 'pending',
            assigneeRole: newTask.assigneeRole,
            assigneeId: newTask.assigneeId,
            createdAt: getBstIsoString()
          });
          syncQueue.value.changes.tasks = syncQueue.value.changes.tasks || {};
          syncQueue.value.changes.tasks[taskId] = true;
          saveSyncQueue();
          newTask.title = '';
          newTask.description = '';
        };

        const activeTab = ref('dashboard');
        const isSidebarCollapsed = ref(false);

        const isTasksPanelOpen = ref(false);

        const openTasksPanel = () => {
          isTasksPanelOpen.value = true;
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
          }
        };
  
        const unreadNotificationsCount = computed(() => {
          if (!currentUser.value) return 0;
          return tasks.value.filter(t => t.status === 'pending' && (t.assigneeId === currentUser.value.id || t.assigneeRole === currentUser.value.role || t.assigneeRole === 'all')).length;
        });

        // Automated Task Generator
        setInterval(() => {
          if (currentUser.value?.role !== 'admin' && currentUser.value?.role !== 'moderator') return;
          const now = Date.now();
          const twoHours = 2 * 60 * 60 * 1000;
          let changed = false;
          orders.value.forEach(order => {
            if (order.status === 'Pending' && order.createdAt) {
              const orderTime = new Date(order.createdAt).getTime();
              if (now - orderTime > twoHours) {
                 const taskId = 'auto_pending_' + order.id;
                 const existing = tasks.value.find(t => t.id === taskId);
                 if (!existing) {
                    tasks.value.push({
                       id: taskId,
                       title: 'Overdue Pending Order: ' + (order.orderId || order.id),
                       description: 'Order for ' + order.customerName + ' has been pending for over 2 hours.',
                       status: 'pending',
                       assigneeRole: 'seller',
                       assigneeId: order.merchantId,
                       orderId: order.id,
                       createdAt: getBstIsoString()
                    });
                    syncQueue.value.changes.tasks = syncQueue.value.changes.tasks || {};
                    syncQueue.value.changes.tasks[taskId] = true;
                    changed = true;
                 }
              }
            }
          });
          if (changed) {
            localStorage.setItem('homeaura_tasks', JSON.stringify(tasks.value));
            saveSyncQueue();
          }
        }, 60000);


        // WhatsApp Submission Group Default Link
        const DEFAULT_WA_GROUP_LINK = 'https://chat.whatsapp.com/LStonFBgIe67wTqWx9f1dw';
        const LEGACY_BAD_LINK = 'https://chat.whatsapp.com/HomeAuraOfficialTeam';

        // Apps Script Endpoint URL
        const appsScriptUrl = ref(localStorage.getItem('homeaura_apps_script_url') || 'https://script.google.com/macros/s/AKfycbzLixNthxgqReboKXMfkLJSAz1baSXPw69ed9Lf2WxJBKtCrUzeOUzqawMf_tbn-da74Q/exec');
        const backupFrequency = ref(localStorage.getItem('homeaura_backup_frequency') || '6');
        let initialStoredWa = localStorage.getItem('homeaura_admin_wa');
        if (initialStoredWa && initialStoredWa.includes('HomeAuraOfficialTeam')) {
            initialStoredWa = DEFAULT_WA_GROUP_LINK; // Force overwrite bad legacy link
            localStorage.setItem('homeaura_admin_wa', DEFAULT_WA_GROUP_LINK);
        }
        const adminWaGroupLink = ref(initialStoredWa && initialStoredWa.trim().startsWith('http') ? initialStoredWa.trim() : DEFAULT_WA_GROUP_LINK);

        // --- BANGLADESH TIME UTILITIES (Asia/Dhaka, UTC+6) ---
        const getBangladeshDate = (dateInput = new Date()) => {
          if (!dateInput) dateInput = new Date();
          const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
          if (isNaN(d.getTime())) return new Date();
          const dhakaStr = d.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
          return new Date(dhakaStr);
        };

        const getBangladeshTimeString = (dateInput = new Date()) => {
          const d = getBangladeshDate(dateInput);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const hours = String(d.getHours()).padStart(2, '0');
          const minutes = String(d.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day} ${hours}:${minutes}`;
        };

        const getBangladeshTimestamp = (dateInput = new Date()) => {
          const d = getBangladeshDate(dateInput);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const hours = String(d.getHours()).padStart(2, '0');
          const minutes = String(d.getMinutes()).padStart(2, '0');
          const seconds = String(d.getSeconds()).padStart(2, '0');
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        const getBangladeshDateString = (dateInput = new Date()) => {
          const d = getBangladeshDate(dateInput);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const getBstIsoString = (dateInput = new Date()) => {
          const d = new Date(dateInput);
          if (isNaN(d.getTime())) return getBstIsoString();
          const pad = (n) => String(n).padStart(2, '0');
          const dhakaStr = d.toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour12: false });
          const dhakaDate = new Date(dhakaStr);
          const year = dhakaDate.getFullYear();
          const month = pad(dhakaDate.getMonth() + 1);
          const day = pad(dhakaDate.getDate());
          const hours = pad(dhakaDate.getHours());
          const minutes = pad(dhakaDate.getMinutes());
          const seconds = pad(dhakaDate.getSeconds());
          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+06:00`;
        };
        const getBstDateString = (isoOrDate) => { if (!isoOrDate) return ''; const d = new Date(isoOrDate); if (isNaN(d.getTime())) return ''; return new Date(d.getTime() + (6 * 60 * 60 * 1000)).toISOString().split('T')[0]; };
        const formatBangladeshDisplayTime = (isoOrDate) => {
          if (!isoOrDate) return 'N/A';
          try {
            const d = new Date(isoOrDate);
            if (isNaN(d.getTime())) return String(isoOrDate);
            return d.toLocaleString('en-GB', {
              timeZone: 'Asia/Dhaka',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }) + ' BST';
          } catch(e) {
            return String(isoOrDate);
          }
        };

        const getBangladeshClockString = () => {
          const now = new Date();
          return now.toLocaleString('en-GB', {
            timeZone: 'Asia/Dhaka',
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }) + ' BST';
        };

        const bangladeshTimeDisplay = ref(getBangladeshClockString());
        setInterval(() => {
          bangladeshTimeDisplay.value = getBangladeshClockString();
        }, 1000);

        // --- OPTIMAL MULTI-USER OUTBOX SYNC QUEUE (DELTA SYNC) ---
        const initSyncQueue = () => {
          try {
            const raw = localStorage.getItem('homeaura_sync_queue_v4');
            if (raw) {
              const q = JSON.parse(raw);
              if (q && q.changes && q.deletes) return q;
            }
          } catch(e) {}
          
        // Browser Notifications for Tasks
        let lastTaskIds = new Set(tasks.value.map(t => t.id));
        watch(() => tasks.value, (newTasks) => {
          if (!currentUser.value) return;
          const currentTaskIds = new Set(newTasks.map(t => t.id));
          
          // Check for new tasks
          const newAddedTasks = newTasks.filter(t => !lastTaskIds.has(t.id));
          
          newAddedTasks.forEach(task => {
            // Check if task is for me
            if (task.assigneeRole === 'all' || task.assigneeRole === currentUser.value.role || task.assigneeId === currentUser.value.id) {
              // It's a new task for me!
              // Ask for permission and notify
              if (typeof window !== 'undefined' && 'Notification' in window) {
                if (Notification.permission === 'granted') {
                  new Notification('HomeAura: New Task Assigned', {
                    body: task.title,
                    icon: '/icon.png' // fallback if exists
                  });
                } else if (Notification.permission !== 'denied') {
                  Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                      new Notification('HomeAura: New Task Assigned', {
                        body: task.title
                      });
                    }
                  });
                }
              }
              // Also show in-app toast if toast exists
              if (typeof showToast === 'function') {
                showToast('New Task: ' + task.title, 'info');
              }
            }
          });
          
          lastTaskIds = currentTaskIds;
        }, { deep: true });

        return {
            changes: {
              orders: {},
              deletedOrders: {},
              users: {},
              factories: {},
              factoryBills: {},
              expenses: {},
              categories: null,
              settings: {}
            },
            deletes: {
              orders: [],
              deletedOrders: [],
              users: [],
              factories: [],
              factoryBills: [],
              expenses: [],
              tasks: []
            }
          };
        };

        const syncQueue = ref(initSyncQueue());

        const saveSyncQueue = () => {
          try {
            localStorage.setItem('homeaura_sync_queue_v4', JSON.stringify(syncQueue.value));
          } catch (e) {}
        };

        // Real-time pending changes counter
        const pendingSyncCount = computed(() => {
          let count = 0;
          const ch = syncQueue.value.changes;
          const del = syncQueue.value.deletes;
          if (ch) {
            count += Object.keys(ch.orders || {}).length;
            count += Object.keys(ch.deletedOrders || {}).length;
            count += Object.keys(ch.users || {}).length;
            count += Object.keys(ch.factories || {}).length;
            count += Object.keys(ch.factoryBills || {}).length;
            count += Object.keys(ch.expenses || {}).length;
            count += Object.keys(ch.settings || {}).length;
            if (ch.categories) count += 1;
          }
          if (del) {
            count += (del.orders || []).length;
            count += (del.deletedOrders || []).length;
            count += (del.users || []).length;
            count += (del.factories || []).length;
            count += (del.factoryBills || []).length;
            count += (del.expenses || []).length;
          }
          return count;
        });

        // Sync Status Indicators
        const syncStatus = ref('synced'); // 'synced' | 'syncing_push' | 'syncing_pull' | 'offline' | 'error'
        const syncNotice = ref('');
        const syncStatusMsg = ref('');
        const syncStatusColor = ref('');
        const lastSyncTimestamp = ref(localStorage.getItem('homeaura_last_sync_time') || '');
        const lastPullTimestamp = ref(localStorage.getItem('homeaura_last_pull_time') || '');
        const isBackingUp = ref(false);
        const isPushing = ref(false);
        const isPulling = ref(false);
        const isTestingSync = ref(false);

        // Helper: Stamp entity with ISO timestamp and author
        const stampEntity = (entity) => {
          if (!entity) return entity;
          entity.updatedAt = getBstIsoString();
          if (currentUser.value?.username) {
            entity.updatedBy = currentUser.value?.username;
          }
          return entity;
        };

        // Outbox queue mutations
        const queueChange = (collection, entity) => {
          if (!entity) return;
          stampEntity(entity);
          if (collection === 'categories') {
            syncQueue.value.changes.categories = [...categories.value];
          } else if (collection === 'settings') {
            if (!syncQueue.value.changes.settings) syncQueue.value.changes.settings = {};
            syncQueue.value.changes.settings[entity.id] = { ...entity };
          } else {
            if (!syncQueue.value.changes[collection]) syncQueue.value.changes[collection] = {};
            syncQueue.value.changes[collection][entity.id] = { ...entity };
            // Remove from deletes list if it was previously queued for deletion
            if (syncQueue.value.deletes[collection]) {
              syncQueue.value.deletes[collection] = syncQueue.value.deletes[collection].filter(id => id !== entity.id);
            }
          }
          saveSyncQueue();
          triggerAutoSync();
        };

        const queueDelete = (collection, id) => {
          if (!id) return;
          // Remove from changes list if queued
          if (syncQueue.value.changes[collection] && syncQueue.value.changes[collection][id]) {
            delete syncQueue.value.changes[collection][id];
          }
          if (!syncQueue.value.deletes[collection]) syncQueue.value.deletes[collection] = [];
          if (!syncQueue.value.deletes[collection].includes(id)) {
            syncQueue.value.deletes[collection].push(id);
          }
          saveSyncQueue();
          triggerAutoSync();
        };

        // --- BIDIRECTIONAL DELTA SYNC ENGINE ---
        let autoSyncTimeout = null;
        const triggerAutoSync = (immediate = false) => {
          if (!appsScriptUrl.value) return;
          if (autoSyncTimeout) clearTimeout(autoSyncTimeout);
          if (immediate) {
            pushToGoogleSheets(false);
          } else {
            autoSyncTimeout = setTimeout(() => {
              pushToGoogleSheets(false);
            }, 1000); // 1-second batching debounce
          }
        };

        const pushToGoogleSheets = async (forceFull = false, isUserTriggered = false) => {
          if (currentUser.value) {
            const myU = users.value.find(u => u && u?.username === currentUser.value?.username);
            if (myU) {
              myU.lastActive = getBstIsoString();
              syncQueue.value.changes.users = syncQueue.value.changes.users || {};
              syncQueue.value.changes.users[myU.id] = true;
            }
          }
          if (!appsScriptUrl.value) return;
          if (!navigator.onLine) {
            syncStatus.value = 'offline';
            return;
          }
          if (isPushing.value) return;
          if (!forceFull && pendingSyncCount.value === 0) return;

          isPushing.value = true;
          isBackingUp.value = true;
          syncStatus.value = 'syncing_push';

          // Snapshot queue so newly created changes during request aren't lost
          const queueSnapshot = JSON.parse(JSON.stringify(syncQueue.value));

          let payload;
          if (forceFull) {
            payload = {
              action: 'sync_full',
              delta: false,
              sender: currentUser.value?.username || 'user',
              clientTimestamp: getBstIsoString(),
              users: users.value,
              orders: orders.value,
              deletedOrders: deletedOrders.value,
              categories: categories.value,
              factories: factories.value,
              factoryBills: factoryBills.value,
              expenses: expenses.value,
              settings: [{ id: "adminWaGroupLink", value: adminWaGroupLink.value }]
            };
          } else {
            payload = {
              action: 'sync_delta',
              delta: true,
              sender: currentUser.value?.username || 'user',
              clientTimestamp: getBstIsoString(),
              changes: {
                orders: Object.values(queueSnapshot.changes.orders || {}),
                deletedOrders: Object.values(queueSnapshot.changes.deletedOrders || {}),
                users: Object.values(queueSnapshot.changes.users || {}),
                factories: Object.values(queueSnapshot.changes.factories || {}),
                factoryBills: Object.values(queueSnapshot.changes.factoryBills || {}),
                expenses: Object.values(queueSnapshot.changes.expenses || {}),
                categories: queueSnapshot.changes.categories,
                settings: Object.values(queueSnapshot.changes.settings || {})
              },
              deletes: queueSnapshot.deletes || {}
            };
          }

          try {
            const url = (appsScriptUrl.value || '').trim();
            if (!url || !url.startsWith('http')) {
              isPushing.value = false;
              isBackingUp.value = false;
              return;
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(payload),
              signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) {
              throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            if (data && data.status === 'error') {
              throw new Error(data.error || 'Server rejected changes');
            }

            if (!forceFull) {
              // Prune successfully synced items from queue
              if (queueSnapshot.changes) {
                Object.keys(queueSnapshot.changes.orders || {}).forEach(id => {
                  delete syncQueue.value.changes.orders[id];
                });
                Object.keys(queueSnapshot.changes.deletedOrders || {}).forEach(id => {
                  delete syncQueue.value.changes.deletedOrders[id];
                });
                Object.keys(queueSnapshot.changes.users || {}).forEach(id => {
                  delete syncQueue.value.changes.users[id];
                });
                Object.keys(queueSnapshot.changes.factories || {}).forEach(id => {
                  delete syncQueue.value.changes.factories[id];
                });
                Object.keys(queueSnapshot.changes.factoryBills || {}).forEach(id => {
                  delete syncQueue.value.changes.factoryBills[id];
                });
                Object.keys(queueSnapshot.changes.expenses || {}).forEach(id => {
                  delete syncQueue.value.changes.expenses[id];
                });
                Object.keys(queueSnapshot.changes.settings || {}).forEach(id => {
                  delete syncQueue.value.changes.settings[id];
                });
                if (queueSnapshot.changes.categories) {
                  syncQueue.value.changes.categories = null;
                }
              }
              if (queueSnapshot.deletes) {
                Object.keys(queueSnapshot.deletes).forEach(coll => {
                  const sentIds = queueSnapshot.deletes[coll] || [];
                  syncQueue.value.deletes[coll] = (syncQueue.value.deletes[coll] || []).filter(id => !sentIds.includes(id));
                });
              }
            } else {
              // Reset queue after full sync
              syncQueue.value = {
                changes: { orders: {}, deletedOrders: {}, users: {}, factories: {}, factoryBills: {}, expenses: {}, categories: null, settings: {} },
                deletes: { orders: [], deletedOrders: [], users: [], factories: [], factoryBills: [], expenses: [] }
              };
            }

            saveSyncQueue();
            lastSyncTimestamp.value = getBangladeshClockString();
            localStorage.setItem('homeaura_last_sync_time', lastSyncTimestamp.value);
            syncStatus.value = 'synced';
          } catch (err) {
            console.warn('Push sync note (local outbox preserved):', err.message);
            syncStatus.value = 'offline';
            if (isUserTriggered) {
              syncNotice.value = 'Sync push queued locally: ' + (err.name === 'AbortError' ? 'request timeout' : err.message);
              setTimeout(() => { syncNotice.value = ''; }, 5000);
            }
          } finally {
            isPushing.value = false;
            isBackingUp.value = false;
          }
        };

        // Smart Non-Destructive Pull with Conflict-Free LWW Resolution
        const syncFromGoogleSheets = async (isUserTriggered = false) => {
          const url = (appsScriptUrl.value || '').trim();
          if (!url || !url.startsWith('http')) return;
          if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            syncStatus.value = 'offline';
            return;
          }
          if (isPulling.value || isPushing.value) return;

          isPulling.value = true;
          if (isUserTriggered) syncStatus.value = 'syncing_pull';

          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);

            const res = await fetch(url, {
              signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) {
              throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            if (!data || data.status === 'error') {
              throw new Error(data?.error || 'Failed to fetch sheet data');
            }

            let updatedCount = 0;

            // 1. Orders Smart Merge (Remote Source of Truth with Local Offline Preservation)
            if (Array.isArray(data.orders)) {
              const remoteOrderMap = new Map();
              data.orders.forEach(ro => { if (ro && ro.id) remoteOrderMap.set(String(ro.id), ro); });

              const newOrdersList = [];
              const processedIds = new Set();

              // Merge/add all remote orders
              data.orders.forEach(remoteOrd => {
                if (!remoteOrd || !remoteOrd.id) return;
                const rId = String(remoteOrd.id);
                processedIds.add(rId);

                const wasDeletedLocally = deletedOrders.value.some(d => String(d.id) === rId) ||
                  (syncQueue.value.deletes.orders && syncQueue.value.deletes.orders.map(String).includes(rId));
                if (wasDeletedLocally) return;

                const localOrd = orders.value.find(o => String(o.id) === rId);
                if (localOrd) {
                  const hasLocalPending = syncQueue.value.changes.orders && syncQueue.value.changes.orders[localOrd.id];
                  if (!hasLocalPending) {
                    const locTime = localOrd.updatedAt ? new Date(localOrd.updatedAt).getTime() : 0;
                    const remTime = remoteOrd.updatedAt ? new Date(remoteOrd.updatedAt).getTime() : 0;
                    if (remTime >= locTime || !localOrd.updatedAt) {
                      const prevStatus = localOrd.status;
                      Object.assign(localOrd, remoteOrd);
                      if (prevStatus !== remoteOrd.status) updatedCount++;
                    }
                  }
                  newOrdersList.push(localOrd);
                } else {
                  newOrdersList.push(remoteOrd);
                  updatedCount++;
                }
              });

              // Keep only truly local new orders created offline that haven't been pushed to the remote sheet yet
              orders.value.forEach(localOrd => {
                if (!localOrd || !localOrd.id) return;
                const lId = String(localOrd.id);
                if (!processedIds.has(lId)) {
                  const hasLocalPending = syncQueue.value.changes.orders && syncQueue.value.changes.orders[localOrd.id];
                  if (hasLocalPending) {
                    newOrdersList.unshift(localOrd);
                  }
                }
              });

              orders.value = newOrdersList;
              localStorage.setItem('homeaura_orders', JSON.stringify(orders.value));
            }

            // 2. Deleted Orders Merge
            if (Array.isArray(data.deletedOrders)) {
              data.deletedOrders.forEach(remDel => {
                if (remDel && remDel.id && !deletedOrders.value.some(ld => String(ld.id) === String(remDel.id))) {
                  deletedOrders.value.unshift(remDel);
                }
              });
              orders.value = orders.value.filter(o => !deletedOrders.value.some(d => String(d.id) === String(o.id)));
              localStorage.setItem('homeaura_deleted_orders', JSON.stringify(deletedOrders.value));
              localStorage.setItem('homeaura_orders', JSON.stringify(orders.value));
            }

            // 3. Users Merge
            if (Array.isArray(data.users) && data.users.length > 0) {
              const userMap = new Map();
              data.users.forEach(u => { if (u && u?.username) userMap.set(String(u?.username), u); });
              const newUsersList = [];
              const processedUsernames = new Set();

              data.users.forEach(remoteU => {
                if (!remoteU || !remoteU?.username) return;
                const uname = String(remoteU?.username);
                processedUsernames.add(uname);
                const localU = users.value.find(u => u && String(u?.username) === uname);
                if (localU) {
                  if (!syncQueue.value.changes.users || !syncQueue.value.changes.users[localU.id]) {
                    Object.assign(localU, remoteU);
                  }
                  newUsersList.push(localU);
                } else {
                  newUsersList.push(remoteU);
                }
              });

              users.value.forEach(localU => {
                if (localU && localU.username && !processedUsernames.has(String(localU.username))) {
                  if (syncQueue.value.changes.users && syncQueue.value.changes.users[localU.id]) {
                    newUsersList.push(localU);
                  }
                }
              });

              if (newUsersList.length > 0) {
                users.value = newUsersList;
                localStorage.setItem('homeaura_users', JSON.stringify(users.value));
              }
            }

            // 4. Factories Merge
            if (Array.isArray(data.factories)) {
              if (data.factories.length > 0 || factories.value.length === 0) {
                const facMap = new Map();
                data.factories.forEach(f => { if (f && f.id) facMap.set(String(f.id), f); });
                const newFacsList = [];
                const processedFacIds = new Set();

                data.factories.forEach(remoteF => {
                  if (!remoteF || !remoteF.id) return;
                  const fid = String(remoteF.id);
                  processedFacIds.add(fid);
                  const localF = factories.value.find(f => String(f.id) === fid);
                  if (localF) {
                    if (!syncQueue.value.changes.factories || !syncQueue.value.changes.factories[localF.id]) {
                      Object.assign(localF, remoteF);
                    }
                    newFacsList.push(localF);
                  } else {
                    newFacsList.push(remoteF);
                  }
                });

                factories.value.forEach(localF => {
                  if (localF && localF.id && !processedFacIds.has(String(localF.id))) {
                    if (syncQueue.value.changes.factories && syncQueue.value.changes.factories[localF.id]) {
                      newFacsList.push(localF);
                    }
                  }
                });

                factories.value = newFacsList;
                localStorage.setItem('homeaura_factories', JSON.stringify(factories.value));
              }
            }

            // 5. Factory Bills Merge
            if (Array.isArray(data.factoryBills)) {
              const billMap = new Map();
              data.factoryBills.forEach(b => { if (b && b.id) billMap.set(String(b.id), b); });
              const newBillsList = [];
              const processedBillIds = new Set();

              data.factoryBills.forEach(remoteB => {
                if (!remoteB || !remoteB.id) return;
                const bid = String(remoteB.id);
                processedBillIds.add(bid);
                if (syncQueue.value.deletes.factoryBills && syncQueue.value.deletes.factoryBills.includes(remoteB.id)) return;
                const localB = factoryBills.value.find(b => String(b.id) === bid);
                if (localB) {
                  if (!syncQueue.value.changes.factoryBills || !syncQueue.value.changes.factoryBills[localB.id]) {
                    Object.assign(localB, remoteB);
                  }
                  newBillsList.push(localB);
                } else {
                  newBillsList.push(remoteB);
                }
              });

              factoryBills.value.forEach(localB => {
                if (localB && localB.id && !processedBillIds.has(String(localB.id))) {
                  if (syncQueue.value.changes.factoryBills && syncQueue.value.changes.factoryBills[localB.id]) {
                    newBillsList.push(localB);
                  }
                }
              });

              factoryBills.value = newBillsList;
              localStorage.setItem('homeaura_factory_bills', JSON.stringify(factoryBills.value));
            }

            // 6. Expenses Merge
            if (Array.isArray(data.expenses)) {
              const expMap = new Map();
              data.expenses.forEach(e => { if (e && e.id) expMap.set(String(e.id), e); });
              const newExpList = [];
              const processedExpIds = new Set();

              data.expenses.forEach(remoteE => {
                if (!remoteE || !remoteE.id) return;
                const eid = String(remoteE.id);
                processedExpIds.add(eid);
                if (syncQueue.value.deletes.expenses && syncQueue.value.deletes.expenses.includes(remoteE.id)) return;
                const localE = expenses.value.find(e => String(e.id) === eid);
                if (localE) {
                  if (!syncQueue.value.changes.expenses || !syncQueue.value.changes.expenses[localE.id]) {
                    Object.assign(localE, remoteE);
                  }
                  newExpList.push(localE);
                } else {
                  newExpList.push(remoteE);
                }
              });

              expenses.value.forEach(localE => {
                if (localE && localE.id && !processedExpIds.has(String(localE.id))) {
                  if (syncQueue.value.changes.expenses && syncQueue.value.changes.expenses[localE.id]) {
                    newExpList.push(localE);
                  }
                }
              });

              expenses.value = newExpList;
              localStorage.setItem('homeaura_expenses', JSON.stringify(expenses.value));
            }

            // 7. Categories Merge
            if (Array.isArray(data.categories) && data.categories.length > 0 && !syncQueue.value.changes.categories) {
              categories.value = data.categories.map(c => typeof c === 'object' && c !== null ? (c.name || Object.values(c).join('')) : String(c));
              localStorage.setItem('homeaura_categories', JSON.stringify(categories.value));
            }

            
            // 9. Tasks Merge
            if (Array.isArray(data.tasks)) {
              const taskMap = new Map();
              data.tasks.forEach(t => { if (t && t.id) taskMap.set(String(t.id), t); });
              const newTasksList = [];
              const processedTaskIds = new Set();
              data.tasks.forEach(remoteT => {
                if (!remoteT || !remoteT.id) return;
                const tid = String(remoteT.id);
                processedTaskIds.add(tid);
                if (syncQueue.value.deletes.tasks && syncQueue.value.deletes.tasks.includes(remoteT.id)) return;
                const localT = tasks.value.find(t => String(t.id) === tid);
                if (localT) {
                  if (!syncQueue.value.changes.tasks || !syncQueue.value.changes.tasks[localT.id]) {
                    Object.assign(localT, remoteT);
                  }
                  newTasksList.push(localT);
                } else {
                  newTasksList.push(remoteT);
                }
              });
              tasks.value.forEach(localT => {
                if (localT && localT.id && !processedTaskIds.has(String(localT.id))) {
                  if (syncQueue.value.changes.tasks && syncQueue.value.changes.tasks[localT.id]) {
                    newTasksList.push(localT);
                  }
                }
              });
              tasks.value = newTasksList;
              localStorage.setItem('homeaura_tasks', JSON.stringify(tasks.value));
            }

            // 8. Settings Merge (WhatsApp Reporting Group, etc.)
            if (data.settings) {
              let waRemoteVal = null;
              if (Array.isArray(data.settings)) {
                const waSetting = data.settings.find(s => s && (s.id === 'adminWaGroupLink' || s.key === 'adminWaGroupLink' || s.name === 'adminWaGroupLink'));
                if (waSetting) {
                  waRemoteVal = waSetting.value !== undefined ? waSetting.value : (waSetting.val || waSetting.link || '');
                }
              } else if (typeof data.settings === 'object') {
                waRemoteVal = data.settings.adminWaGroupLink;
              }

              if (waRemoteVal && typeof waRemoteVal === 'string' && waRemoteVal.trim().startsWith('http')) {
                // Ignore the bad legacy link from Google Sheets if it's there
                if (waRemoteVal.includes('HomeAuraOfficialTeam')) {
                    waRemoteVal = DEFAULT_WA_GROUP_LINK;
                }
                const hasLocalPending = syncQueue.value.changes.settings && syncQueue.value.changes.settings.adminWaGroupLink;
                if (!hasLocalPending) {
                  if (adminWaGroupLink.value !== waRemoteVal.trim()) {
                    adminWaGroupLink.value = waRemoteVal.trim();
                    localStorage.setItem('homeaura_admin_wa', waRemoteVal.trim());
                  }
                }
              }
            }

            lastPullTimestamp.value = getBangladeshClockString();
            localStorage.setItem('homeaura_last_pull_time', lastPullTimestamp.value);
            syncStatus.value = 'synced';

            if (updatedCount > 0) {
              syncNotice.value = `⚡ Synced ${updatedCount} team updates from Google Sheets`;
              setTimeout(() => { syncNotice.value = ''; }, 4000);
            }
          } catch (err) {
            console.warn('Pull sync note (offline/local fallback):', err.message);
            syncStatus.value = 'offline';
            if (isUserTriggered) {
              syncNotice.value = 'Offline mode: using local cache (' + (err.name === 'AbortError' ? 'request timeout' : err.message) + ')';
              setTimeout(() => { syncNotice.value = ''; }, 5000);
            }
          } finally {
            isPulling.value = false;
          }
        };

        const backupToGoogleSheets = async (isAuto = false) => {
          return pushToGoogleSheets(!isAuto);
        };

        // --- DARK MODE LOGIC ---
        const isDarkMode = ref(localStorage.getItem('homeaura_dark') === 'true');

        const applyDarkMode = () => {
          if (isDarkMode.value) {
            document.body.classList.add('dark');
            document.documentElement.classList.add('dark');
          } else {
            document.body.classList.remove('dark');
            document.documentElement.classList.remove('dark');
          }
        };

        const toggleDarkMode = () => {
          isDarkMode.value = !isDarkMode.value;
          localStorage.setItem('homeaura_dark', isDarkMode.value ? 'true' : 'false');
          applyDarkMode();
        };

        // --- LOCAL STORAGE PERSISTENCE INITIAL LOAD ---
        const loadInitialData = () => {
          const storedUsers = localStorage.getItem('homeaura_users');
          let parsedUsrs = storedUsers ? JSON.parse(storedUsers) : null;
          if (!parsedUsrs || parsedUsrs.length === 0) parsedUsrs = defaultUsers;
          users.value = parsedUsrs;
          if (!storedUsers) localStorage.setItem('homeaura_users', JSON.stringify(defaultUsers));

          const fakeOrderIds = new Set(['ORD-1001', 'ORD-1002', 'ORD-1003', 'ORD-1004', 'ORD-1005', 'ORD-1006', 'ORD-1007', 'ORD-1008', 'ORD-1009']);
          const storedOrders = localStorage.getItem('homeaura_orders');
          let parsedOrders = [];
          if (storedOrders) {
            try {
              const loaded = JSON.parse(storedOrders);
              if (Array.isArray(loaded)) {
                // Filter out legacy fake demo orders
                parsedOrders = loaded.filter(o => {
                  if (!o || !o.id) return false;
                  if (fakeOrderIds.has(String(o.id)) && (o.customerName === 'Far Ha Na' || o.customerName === 'Muslim Wddin Piyash' || o.customerName === 'Rayhan Kabir' || o.customerName === 'Farah Naz' || o.customerName === 'Tanvir Hossain' || o.customerName === 'Kazi Shakil' || o.customerName === 'Nusrat Jahan' || o.customerName === 'Mahfuzur Rahman' || o.customerName === 'Sultana Razia' || o.customerName === 'Anisur Rahman' || o.customerName === 'Tahmina Begum')) {
                    return false;
                  }
                  return true;
                });
              }
            } catch (e) {
              parsedOrders = [];
            }
          }
          orders.value = parsedOrders;
          localStorage.setItem('homeaura_orders', JSON.stringify(orders.value));

          const storedDeletedOrders = localStorage.getItem('homeaura_deleted_orders');
          deletedOrders.value = storedDeletedOrders ? JSON.parse(storedDeletedOrders) : [];

          const storedCats = localStorage.getItem('homeaura_categories');
          let parsedCats = storedCats ? JSON.parse(storedCats) : null;
          if (!parsedCats || parsedCats.length === 0) parsedCats = defaultCategories;
          categories.value = parsedCats;
          if (!storedCats) localStorage.setItem('homeaura_categories', JSON.stringify(defaultCategories));

          const fakeFactoryIds = new Set(['f1', 'f2', 'f3']);
          const storedFactories = localStorage.getItem('homeaura_factories');
          let parsedFacs = [];
          if (storedFactories) {
            try {
              const loadedFacs = JSON.parse(storedFactories);
              if (Array.isArray(loadedFacs)) {
                parsedFacs = loadedFacs.filter(f => {
                  if (!f || !f.id) return false;
                  if (fakeFactoryIds.has(String(f.id)) && (f.name === 'Apex Crafting Hub' || f.name === 'Royal Heritage Workshop' || f.name === 'Standard Guild Factory')) {
                    return false;
                  }
                  return true;
                });
              }
            } catch (e) {
              parsedFacs = [];
            }
          }
          factories.value = parsedFacs;
          localStorage.setItem('homeaura_factories', JSON.stringify(factories.value));

          const storedFactoryBills = localStorage.getItem('homeaura_factory_bills');
          factoryBills.value = storedFactoryBills ? JSON.parse(storedFactoryBills) : [];

          const storedExpenses = localStorage.getItem('homeaura_expenses');
          const storedSpends = localStorage.getItem('homeaura_marketing_spends');
          if (storedSpends) { try { marketingSpends.value = JSON.parse(storedSpends); } catch (e) {} }
          expenses.value = storedExpenses ? JSON.parse(storedExpenses) : [];

          let storedWa = localStorage.getItem('homeaura_admin_wa');
          if (storedWa && storedWa.includes('HomeAuraOfficialTeam')) {
            storedWa = DEFAULT_WA_GROUP_LINK;
          }
          if (storedWa && storedWa.trim().startsWith('http')) {
            adminWaGroupLink.value = storedWa.trim();
          } else {
            adminWaGroupLink.value = DEFAULT_WA_GROUP_LINK;
            localStorage.setItem('homeaura_admin_wa', DEFAULT_WA_GROUP_LINK);
          }

          const storedSession = localStorage.getItem('homeaura_session');
          if (storedSession) {
            try {
              const user = JSON.parse(storedSession);
              if (!user || !user?.username) throw new Error('Invalid session');
              const freshUser = users.value.find(u => u && u?.username === user?.username);
              if (freshUser && freshUser.active) {
                currentUser.value = freshUser;
                activeTab.value = (freshUser.role === 'admin' || freshUser.role === 'marketer' || freshUser.role === 'moderator') ? 'dashboard' : 'intake';
              } else {
                localStorage.removeItem('homeaura_session');
              }
            } catch (e) {}
          }
        };

        const saveOrdersLocally = () => {
          const stripped = orders.value.map(o => {
            const copy = { ...o };
            delete copy.collagePhotoLocalUrl;
            delete copy.socialProofLocalUrl;
            return copy;
          });
          localStorage.setItem("homeaura_orders", JSON.stringify(stripped));
        };
        const saveDeletedOrdersLocally = () => {
          const stripped = deletedOrders.value.map(o => {
            const copy = { ...o };
            delete copy.collagePhotoLocalUrl;
            delete copy.socialProofLocalUrl;
            return copy;
          });
          localStorage.setItem("homeaura_deleted_orders", JSON.stringify(stripped));
        };
        const saveUsersLocally = () => {
          localStorage.setItem("homeaura_users", JSON.stringify(users.value));
        };
        const saveCategoriesLocally = () => {
          localStorage.setItem("homeaura_categories", JSON.stringify(categories.value));
        };
        const saveFactoryBillsLocally = () => {
          localStorage.setItem("homeaura_factory_bills", JSON.stringify(factoryBills.value));
        };
        const saveExpensesLocally = () => {
          localStorage.setItem("homeaura_expenses", JSON.stringify(expenses.value));
        };
        const saveFactoriesLocally = () => {
          localStorage.setItem("homeaura_factories", JSON.stringify(factories.value));
        };

        // --- MODAL AND VIEW STATE ---
        const selectedProofTile = ref('terminal');
        const selectProofTile = (tileKey) => { selectedProofTile.value = tileKey; };
        
        const selectedCollageTile = ref('terminal');
        const selectCollageTile = (tileKey) => { selectedCollageTile.value = tileKey; };

        const loginForm = reactive({ username: '', password: '' });
        const loginError = ref('');

        // Filtering
        const orderSearch = ref('');
        const sortOption = ref('NEWEST');
        const statusFilter = ref('ALL');
        const merchantFilter = ref('ALL');
        const factoryFilter = ref('ALL');
        const urgentOnly = ref(false);
        const newCategoryName = ref('');

        // Intake Form
        const clipboardRawText = ref('');
        const parseSuccessMsg = ref('');
        const intakeForm = reactive({
          customerName: '',
          customerPhone: '',
          customerAddress: '',
          trafficSource: 'Messenger',
          fabric: '',
          productCategory: 'L-Shape Sofa',
          seatConfig: '3-Seater',
          fulfillmentMethod: 'Home Delivery',
          saleAmount: 0,
          deliveryCharge: 0,
          urgent: false,
          notes: '',
          cnNumber: '',
          invoiceNumber: '',
          collagePhotoUrl: '',
          collagePhotoFileName: '',
          socialProofUrl: '',
          socialProofFileName: '',
          extraDetails: '',
          factoryTag: ''
        });

        // Modals
        const activeModal = ref(null);
        const modalData = reactive({ title: '', order: null, user: null, factory: null, bill: null, expense: null, marketingSpend: { date: "", sellerId: "", amount: 0, history: [] }, selectedFactoryId: null, newStatus: '', url: '', confirmMessage: '', confirmButtonText: '', confirmButtonClass: '', onConfirm: null });
        const trackingData = ref(null);
        const isLoadingTracking = ref(false);

        const orderSuccessData = reactive({
          order: null,
          hasCopiedPhotos: false,
          compositePngUrl: '',
          previewPngUrl: '',
          compositePngBlob: null,
          previewBlob: null,
          waGroupLink: DEFAULT_WA_GROUP_LINK,
          formattedSummary: '',
          isCopiedText: false
        });

        const bulkDispatchData = reactive({
          selectedFactoryId: null,
          isGeneratingPng: false,
          isLoading: false,
          selectedOrdersList: [],
          orders: []
        });

        const bulkDispatchSuccessData = reactive({
          ordersCount: 0,
          count: 0,
          photoCount: 0,
          factoryName: '',
          waGroupLink: '',
          compositePngUrl: '',
          previewPngUrl: '',
          compositePngBlob: null,
          previewBlob: null,
          hasCopiedPhotos: false,
          manifestText: '',
          isCopiedText: false
        });

        const onDispatchFactoryChange = () => {
          // Reactive change handler for modal
        };

        const copyOrderWhatsAppText = async () => {
          if (!orderSuccessData.formattedSummary) return;
          try {
            await navigator.clipboard.writeText(orderSuccessData.formattedSummary);
            orderSuccessData.isCopiedText = true;
            setTimeout(() => { orderSuccessData.isCopiedText = false; }, 3000);
          } catch(e) {
            console.warn('Clipboard text copy warning:', e.message);
          }
        };

        const reCopySingleOrderPngToClipboard = async () => {
          const blobToCopy = orderSuccessData.previewBlob || orderSuccessData.compositePngBlob;
          if (!blobToCopy) {
            alert('No PNG image was generated for this order.');
            return;
          }
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blobToCopy })
            ]);
            orderSuccessData.hasCopiedPhotos = true;
            alert('✅ Single Order Collage PNG re-copied to clipboard!\n\nPress Ctrl+V (or Cmd+V) to paste in WhatsApp.');
          } catch (err) {
            console.warn('Re-copy PNG warning:', err.message);
            alert('Clipboard write was blocked by browser permissions. Please ensure the tab is active.');
          }
        };

        const copyBulkManifestText = async () => {
          if (!bulkDispatchSuccessData.manifestText) return;
          try {
            await navigator.clipboard.writeText(bulkDispatchSuccessData.manifestText);
            bulkDispatchSuccessData.isCopiedText = true;
            setTimeout(() => { bulkDispatchSuccessData.isCopiedText = false; }, 3000);
          } catch (e) {
            console.warn('Bulk manifest copy warning:', e.message);
          }
        };

        const reCopyBulkPngToClipboard = async () => {
          const blobToCopy = bulkDispatchSuccessData.previewBlob || bulkDispatchSuccessData.compositePngBlob;
          if (!blobToCopy) {
            alert('No composite PNG image available to copy.');
            return;
          }
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blobToCopy })
            ]);
            bulkDispatchSuccessData.hasCopiedPhotos = true;
            alert('✅ All Bulk Order Collages PNG re-copied to clipboard!\n\nPress Ctrl+V (or Cmd+V) to paste all collages in WhatsApp.');
          } catch (err) {
            console.warn('Re-copy bulk PNG warning:', err.message);
            alert('Clipboard write was blocked by browser permissions. Please ensure the tab is active.');
          }
        };

        const testOpenWaGroup = () => {
          const targetLink = (adminWaGroupLink.value || '').trim() || DEFAULT_WA_GROUP_LINK;
          try {
            const win = window.open(targetLink, '_blank');
            if (!win) {
              window.open(targetLink, '_blank');
            }
          } catch (e) {
            window.location.href = targetLink;
          }
        };

        const openOrderWaGroup = (url = null) => {
          const targetLink = url || (orderSuccessData.waGroupLink || adminWaGroupLink.value || '').trim() || DEFAULT_WA_GROUP_LINK;
          try {
            const win = window.open(targetLink, '_blank');
            if (!win) {
              window.open(targetLink, '_blank');
            }
          } catch (e) {
            window.location.href = targetLink;
          }
        };

        const copyOrderWaGroupLink = async () => {
          const targetLink = (orderSuccessData.waGroupLink || adminWaGroupLink.value || '').trim() || DEFAULT_WA_GROUP_LINK;
          try {
            await navigator.clipboard.writeText(targetLink);
            alert(`✅ WhatsApp Group Link copied to clipboard:\n${targetLink}\n\nYou can paste it directly in your browser or WhatsApp app.`);
          } catch (e) {
            prompt('Copy WhatsApp Group Link:', targetLink);
          }
        };

        // --- IMAGE ATTACHMENT HANDLERS ---

        const convertFileToPngBase64 = (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
              };
              img.onerror = reject;
              img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        };

        const processCollageFile = async (file, targetObj = intakeForm) => {
          if (!file || !file.type.startsWith('image/')) return;
          const sellerUsername = currentUser.value ? currentUser.value?.username : 'seller';
          const rawCn = targetObj.cnNumber || 'NOCN';
          const cleanCn = rawCn.replace(/[^a-zA-Z0-9-]/g, '');
          const dateStr = targetObj.timestamp ? targetObj.timestamp.slice(0, 10) : getBstIsoString().slice(0, 10);
          const fileName = `collage_${sellerUsername}_${cleanCn}_${dateStr}.png`;

          if (targetObj === intakeForm) {
            parseSuccessMsg.value = '⏳ Converting and uploading collage to Google Drive... Please wait.';
          }
          
          targetObj.collagePhotoLocalUrl = URL.createObjectURL(file);
          targetObj.collagePhotoUrl = '';
          targetObj.collagePhotoFileName = fileName;

          if (!appsScriptUrl.value) {
            if (targetObj === intakeForm) parseSuccessMsg.value = '⚠️ Collage attached locally (No Google Script URL set).';
            return;
          }

          try {
            const base64Data = await convertFileToPngBase64(file);
            const url = (appsScriptUrl.value || '').trim();
            if (!url || !url.startsWith('http')) return;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'upload_image',
                filename: fileName,
                base64: base64Data,
                folder: 'HomeAura_Collage_Photos'
              }),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            const result = await res.json();
                          if (result.status === 'success' && result.url) {
                targetObj.collagePhotoUrl = result.url;
                if (targetObj === intakeForm) {
                  parseSuccessMsg.value = '✅ Collage converted and securely uploaded to Google Drive!';
                  setTimeout(() => { parseSuccessMsg.value = ''; }, 4000);
                }
                if (targetObj.id) {
                  const realOrder = orders.value.find(o => o.id === targetObj.id);
                  if (realOrder) {
                    realOrder.collagePhotoUrl = result.url;
                    realOrder.collagePhotoFileName = fileName;
                    queueChange('orders', realOrder);
                    saveOrdersLocally();
                  }
                }
              }
          } catch (err) {
            console.error('Collage Upload Error:', err);
            if (targetObj === intakeForm) parseSuccessMsg.value = '❌ Failed to upload collage. Using local preview instead.';
          }
        };

        const handleCollageFileUpload = (event, targetObj = intakeForm) => {
          const file = event.target.files && event.target.files[0];
          if (!file) return;
          processCollageFile(file, targetObj);
        };
        
        const handleCollagePaste = (event, targetObj = intakeForm) => {
          const clipboardData = event.clipboardData || (event.originalEvent && event.originalEvent.clipboardData);
          if (!clipboardData || !clipboardData.items) return;
          const items = clipboardData.items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              const blob = items[i].getAsFile();
              if (blob) {
                processCollageFile(blob, targetObj);
                event.preventDefault();
                break;
              }
            }
          }
        };


        const handleCollageDrop = (event, targetObj = intakeForm) => {
          event.preventDefault();
          if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
            processCollageFile(event.dataTransfer.files[0], targetObj);
          }
        };

        const processProofFile = async (file, targetObj = intakeForm) => {
          if (!file || !file.type.startsWith('image/')) return;
          const sellerUsername = currentUser.value ? currentUser.value?.username : 'seller';
          const rawCn = targetObj.cnNumber || 'NOCN';
          const cleanCn = rawCn.replace(/[^a-zA-Z0-9-]/g, '');
          const dateStr = targetObj.timestamp ? targetObj.timestamp.slice(0, 10) : getBstIsoString().slice(0, 10);
          const fileName = `proof_${sellerUsername}_${cleanCn}_${dateStr}.png`;

          if (targetObj === intakeForm) {
            parseSuccessMsg.value = '⏳ Converting and uploading screenshot to Google Drive... Please wait.';
          }
          
          targetObj.socialProofLocalUrl = URL.createObjectURL(file);
          targetObj.socialProofUrl = '';
          targetObj.socialProofFileName = fileName;

          if (!appsScriptUrl.value) {
            if (targetObj === intakeForm) parseSuccessMsg.value = '⚠️ Proof attached locally (No Google Script URL set).';
            return;
          }

          try {
            const base64Data = await convertFileToPngBase64(file);
            const url = (appsScriptUrl.value || '').trim();
            if (!url || !url.startsWith('http')) return;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'upload_image',
                filename: fileName,
                base64: base64Data,
                folder: 'HomeAura_Screenshot_Proofs'
              }),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            const result = await res.json();
                          if (result.status === 'success' && result.url) {
                targetObj.socialProofUrl = result.url;
                if (targetObj === intakeForm) {
                  parseSuccessMsg.value = '✅ Screenshot converted and securely uploaded to Google Drive!';
                  setTimeout(() => { parseSuccessMsg.value = ''; }, 4000);
                }
                if (targetObj.id) {
                  const realOrder = orders.value.find(o => o.id === targetObj.id);
                  if (realOrder) {
                    realOrder.socialProofUrl = result.url;
                    realOrder.socialProofFileName = fileName;
                    queueChange('orders', realOrder);
                    saveOrdersLocally();
                  }
                }
              }
          } catch(err) {
            console.warn("Upload Notice (saved locally):", err.message);
            if (targetObj === intakeForm) parseSuccessMsg.value = '❌ Failed to upload screenshot. Using local preview instead.';
          }
        };


        const uploadCompositePngToDrive = async (base64Data, filename) => {
          const url = (appsScriptUrl.value || '').trim();
          if (!url || !url.startsWith('http')) return null;
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'upload_image',
                filename: filename,
                base64: base64Data,
                folder: 'HomeAura_Dispatch_Manifests'
              }),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            const result = await res.json();
            if (result.status === 'success' && result.url) {
              return result.url;
            }
          } catch(e) {
            console.error('Failed to upload composite PNG to drive:', e);
          }
          return null;
        };

        const handleProofFileUpload = (event, targetObj = intakeForm) => {
          const file = event.target.files && event.target.files[0];
          if (file) processProofFile(file, targetObj);
        };

        const handleProofPaste = (event, targetObj = intakeForm) => {
          const clipboardData = event.clipboardData || (event.originalEvent && event.originalEvent.clipboardData);
          if (!clipboardData || !clipboardData.items) return;
          const items = clipboardData.items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              const blob = items[i].getAsFile();
              if (blob) {
                processProofFile(blob, targetObj);
                event.preventDefault();
                break;
              }
            }
          }
        };

        const handleProofDrop = (event, targetObj = intakeForm) => {
          event.preventDefault();
          if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
            processProofFile(event.dataTransfer.files[0], targetObj);
          }
        };

        // --- SELLER ONE-WAY STATUS ALLOWED PIPELINE ---
        const getAllowedStatusesForUser = (currentStatus) => {
          if (!currentUser.value) return pipelineStages;
          if (currentUser.value.role === 'admin') return pipelineStages;
          const currIdx = pipelineStages.indexOf(currentStatus);
          if (currIdx === -1) return pipelineStages;
          return pipelineStages.slice(currIdx);
        };

        const advanceSellerStatus = (order) => {
          const currIdx = pipelineStages.indexOf(order.status);
          if (currIdx !== -1 && currIdx < pipelineStages.length - 1) {
            order.status = pipelineStages[currIdx + 1];
            order.updatedAt = getBstIsoString();
            order.updatedBy = currentUser.value?.username || 'seller';
            queueChange('orders', order);
            saveOrdersLocally();
          }
        };

        // --- DYNAMIC FACTORY PRIORITY ENGINE ---
        const rankedFactories = computed(() => {
          return factories.value.map(f => {
            const pendingCount = orders.value.filter(o => {
              const isThisFactory = o.factoryTag === f.name;
              const isPending = o.status !== 'Delivered' && o.status !== 'Returned Received';
              return isThisFactory && isPending;
            }).length;

            let stockScore = 30;
            if (f.stockStatus === 'Low Stock') stockScore = 15;
            if (f.stockStatus === 'Out of Stock') stockScore = -50;

            const qualityScore = (f.fabricQuality || 3) * 25;
            const priceFactor = Math.round((f.baseWholesaleCost || 35000) / 1000);
            const loadPenalty = pendingCount * 12;

            const totalScore = qualityScore + stockScore - priceFactor - loadPenalty;

            return {
              ...f,
              pendingCount,
              totalScore
            };
          }).sort((a, b) => b.totalScore - a.totalScore);
        });

        // --- CURRENCY FORMATTING ---
        const formatBDT = (amount) => {
          const val = Number(amount) || 0;
          return '৳' + val.toLocaleString('en-BD');
        };

        // --- AUTHENTICATION ---
        const handleLogin = () => {
          loginError.value = '';
          const user = users.value.find(u => u && String(u?.username) === String(loginForm?.username) && String(u.password) === String(loginForm.password));
          if (!user) {
            loginError.value = 'Invalid username or password.';
            return;
          }
          if (!user.active) {
            loginError.value = 'Account is suspended. Contact Administrator.';
            return;
          }
          currentUser.value = user;
          localStorage.setItem('homeaura_session', JSON.stringify(user));
          activeTab.value = (user.role === 'admin' || user.role === 'marketer' || user.role === 'moderator') ? 'dashboard' : 'intake';
          loginForm.username = '';
          loginForm.password = '';
        };

        const handleLogout = () => {
          currentUser.value = null;
          localStorage.removeItem('homeaura_session');
        };

        // --- COMPUTED METRICS ---
        
        const dashboardFilter = reactive({
          dateRange: 'all',
          sellerId: 'all'
        });

                const filterOrdersForDashboard = (orderList) => {
          return orderList.filter(o => {
            // Apply seller filter
            if (dashboardFilter.sellerId !== 'all') {
              if (o.merchantId !== dashboardFilter.sellerId) return false;
            } else {
              // Exclude isolated users when viewing 'all'
              const seller = users.value.find(u => u.id === o.merchantId);
              if (seller && seller.excludeFromGlobalAnalytics) return false;
            }
            
            // Apply date filter
            if (dashboardFilter.dateRange !== 'all' && o.createdAt) {
              const orderDate = new Date(o.createdAt);
              const now = new Date();
              const orderBst = getBstDateString(orderDate);
              const nowBst = getBstDateString(now);
              if (dashboardFilter.dateRange === 'today') {
                if (orderBst !== nowBst) return false;
              } else if (dashboardFilter.dateRange === 'week') {
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                if (orderDate < oneWeekAgo) return false;
              } else if (dashboardFilter.dateRange === 'month') {
                if (orderBst.substring(0, 7) !== nowBst.substring(0, 7)) return false;
              }
            }
            return true;
          });
        };

        const metrics = computed(() => {
          const filteredOrders = filterOrdersForDashboard(orders.value);
          const grossRevenue = filteredOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
          const deliveredProductsRevenue = filteredOrders.filter(o => o.status === 'Delivered' || o.status === 'Partial Delivered').reduce((acc, o) => acc + (o.saleAmount || 0), 0);
          const deliveredCount = filteredOrders.filter(o => o.status === 'Delivered').length;
          const pendingCount = filteredOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Returned Received').length;
          const urgentCount = filteredOrders.filter(o => o.urgent).length;
          return { grossRevenue, deliveredProductsRevenue, deliveredCount, pendingCount, urgentCount };
        });

        const sellersList = computed(() => users.value.filter(u => u && (u.role === 'seller' || u.role === 'moderator')));
        const globalSalesProgress = computed(() => {
          const allSellers = users.value.filter(u => u && u.role === 'seller');
          const target = allSellers.reduce((sum, u) => sum + (Number(u.target) || 0), 0);
          
          const now = new Date();
          // get current month using local Bangladesh time if possible, or just local ISO string
          const currentMonth = getBstIsoString().slice(0, 7); 
          const thisMonthOrders = orders.value.filter(o => o.timestamp && o.timestamp.startsWith(currentMonth) && o.status !== 'Void' && o.status !== 'Returned Received');
          
          const sales = thisMonthOrders.reduce((sum, o) => sum + (o.saleAmount || 0), 0);
          const percentage = target > 0 ? Math.min(100, Math.round((sales / target) * 100)) : 0;
          return { target, sales, percentage };
        });
        const dispatchDeskOrders = computed(() => {
          return orders.value.filter(o => o.status !== 'Delivered' && o.status !== 'Returned Received').sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        });

        
        const estimateSteadfastCharge = (order) => {
          let weight = 2; // Default for sofa covers
          const cat = (order.productCategory || '').toLowerCase();
          if (cat.includes('sofa') && !cat.includes('cover')) weight = 50;
          else if (cat.includes('bed')) weight = 80;
          else if (cat.includes('dining')) weight = 60;
          else if (cat.includes('wardrobe') || cat.includes('almirah')) weight = 70;
          
          const addr = (order.customerAddress || '').toLowerCase();
          let base = 130;
          let perKg = 20;
          if (addr.includes('dhaka') && !addr.includes('outside')) {
            if (addr.includes('savar') || addr.includes('gazipur') || addr.includes('keraniganj') || addr.includes('narayanganj')) {
              base = 100;
              perKg = 15;
            } else {
              base = 70;
              perKg = 10;
            }
          }
          
          return base + (weight - 1) * perKg;
        };

        const steadfastReport = computed(() => {
          let totalSales = 0;
          let totalDeliveryCollected = 0;
          let totalSteadfastCharge = 0;
          
          const filteredOrders = filterOrdersForDashboard(orders.value);
          const relevantOrders = filteredOrders.filter(o => o.status !== 'Void' && o.status !== 'Returned Received');
          
          relevantOrders.forEach(o => {
            totalSales += (Number(o.saleAmount) || 0);
            totalDeliveryCollected += (Number(o.deliveryCharge) || 0);
            totalSteadfastCharge += estimateSteadfastCharge(o);
          });
          
          return {
            totalSales,
            totalDeliveryCollected,
            totalSteadfastCharge,
            profitOnDelivery: totalDeliveryCollected - totalSteadfastCharge
          };
        });

                const merchantStats = computed(() => {
          let visibleSellersList = sellersList.value;
          if (currentUser.value?.role === 'marketer' && currentUser.value?.visibleSellers) {
              visibleSellersList = sellersList.value.filter(s => currentUser.value.visibleSellers.includes(s.id));
          }
          // Also apply the dashboard filter for specific user, if active
          if (dashboardFilter.sellerId !== 'all') {
             visibleSellersList = visibleSellersList.filter(s => s.id === dashboardFilter.sellerId);
          } else {
             visibleSellersList = visibleSellersList.filter(s => !s.excludeFromGlobalAnalytics);
          }
          const filteredOrders = filterOrdersForDashboard(orders.value);
          return visibleSellersList.map(seller => {
            const sellerOrders = filteredOrders.filter(o => o.merchantName === seller.name || o.merchantId === seller.id);
            const totalSales = sellerOrders.reduce((acc, o) => acc + (Number(o.saleAmount) || 0), 0);
            const target = seller.target || 300000;
            const percentage = target > 0 ? Math.round((totalSales / target) * 100) : 0;
            return {
              username: seller?.username,
              name: seller.name,
              totalOrders: sellerOrders.length,
              totalSales,
              target,
              percentage
            };
          });
        });

        const factoryBillStats = computed(() => {
          const stats = {};
          factoryBills.value.forEach(bill => {
            if (!stats[bill.factoryId]) {
              stats[bill.factoryId] = { factoryId: bill.factoryId, factoryName: getFactoryName(bill.factoryId), totalAmount: 0, billCount: 0, orderCount: 0 };
            }
            stats[bill.factoryId].totalAmount += Number(bill.amount) || 0;
            stats[bill.factoryId].billCount += 1;
            stats[bill.factoryId].orderCount += (bill.linkedOrderIds || []).length;
          });
          return Object.values(stats).sort((a, b) => b.totalAmount - a.totalAmount);
        });

        
                const totalFactoryBillsAmount = computed(() => {
          let bills = factoryBills.value;
          
          if (dashboardFilter.sellerId !== 'all') {
            bills = bills.filter(b => b.sellerId === dashboardFilter.sellerId);
          } else {
            bills = bills.filter(b => {
              if (b.sellerId) {
                const seller = users.value.find(u => u.id === b.sellerId);
                if (seller && seller.excludeFromGlobalAnalytics) return false;
              }
              return true;
            });
          }

          if (dashboardFilter.dateRange !== 'all') {
            bills = bills.filter(b => {
              if (!b.date) return true;
              const d = new Date(b.date);
              const now = new Date();
              const dBst = getBstDateString(d);
              const nowBst = getBstDateString(now);
              if (dashboardFilter.dateRange === 'today') return dBst === nowBst;
              if (dashboardFilter.dateRange === 'week') return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              if (dashboardFilter.dateRange === 'month') return dBst.substring(0, 7) === nowBst.substring(0, 7);
              return true;
            });
          }
          return bills.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
        });

        const totalOperationalExpenses = computed(() => {
          let exps = expenses.value;
          
          if (dashboardFilter.sellerId !== 'all') {
            exps = exps.filter(e => e.sellerId === dashboardFilter.sellerId);
          } else {
            exps = exps.filter(e => {
              if (e.sellerId) {
                const seller = users.value.find(u => u.id === e.sellerId);
                if (seller && seller.excludeFromGlobalAnalytics) return false;
              }
              return true;
            });
          }

          if (dashboardFilter.dateRange !== 'all') {
            exps = exps.filter(e => {
              if (!e.date) return true;
              const d = new Date(e.date);
              const now = new Date();
              const dBst = getBstDateString(d);
              const nowBst = getBstDateString(now);
              if (dashboardFilter.dateRange === 'today') return dBst === nowBst;
              if (dashboardFilter.dateRange === 'week') return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              if (dashboardFilter.dateRange === 'month') return dBst.substring(0, 7) === nowBst.substring(0, 7);
              return true;
            });
          }
          return exps.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        });

        const sellerBillStats = computed(() => {
          const stats = {};
          factoryBills.value.forEach(bill => {
            const linked = bill.linkedOrderIds || [];
            if (linked.length === 0) return;
            const costPerOrder = (Number(bill.amount) || 0) / linked.length;
            linked.forEach(oid => {
              const ord = orders.value.find(o => o.id === oid);
              if (ord) {
                if (!stats[ord.merchantId]) {
                  stats[ord.merchantId] = { merchantId: ord.merchantId, merchantName: ord.merchantName, totalCost: 0, linkedOrdersCount: 0 };
                }
                stats[ord.merchantId].totalCost += costPerOrder;
                stats[ord.merchantId].linkedOrdersCount += 1;
              }
            });
          });
          return Object.values(stats).sort((a, b) => b.totalCost - a.totalCost);
        });

        const myOrders = computed(() => {
          if (!currentUser.value) return [];
          return orders.value.filter(o => o.merchantName === currentUser.value.name || o.merchantId === currentUser.value.id);
        });

        const myOrdersCount = computed(() => myOrders.value.length);
        const myMonthlySales = computed(() => myOrders.value.reduce((acc, o) => acc + (o.saleAmount || 0), 0));
        const myTargetPercentage = computed(() => {
          const target = currentUser.value?.target || 300000;
          return target > 0 ? Math.round((myMonthlySales.value / target) * 100) : 0;
        });

        const filteredOrders = computed(() => {
          let result = orders.value.filter(o => {
            if (statusFilter.value !== 'ALL' && o.status !== statusFilter.value) return false;
            if (merchantFilter.value !== 'ALL' && o.merchantName !== merchantFilter.value) return false;
            if (factoryFilter.value !== 'ALL' && (o.factoryTag || '') !== factoryFilter.value) return false;
            if (urgentOnly.value && !o.urgent) return false;
            if (orderSearch.value) {
              const q = orderSearch.value.toLowerCase();
              return (
                o.id.toLowerCase().includes(q) ||
                o.customerName.toLowerCase().includes(q) ||
                o.customerPhone.includes(q) ||
                o.fabric.toLowerCase().includes(q)
              );
            }
            return true;
          });

          if (sortOption.value === 'NEWEST') {
            result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          } else if (sortOption.value === 'OLDEST') {
            result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          } else if (sortOption.value === 'FACTORY') {
            result.sort((a, b) => {
              const fA = a.factoryTag || 'Z_Unassigned';
              const fB = b.factoryTag || 'Z_Unassigned';
              return fA.localeCompare(fB);
            });
          }

          return result;
        });

        // --- OMNI-CLIPBOARD PARSER ENGINE ---
        const parseClipboard = () => {
          if (!clipboardRawText.value) return;
          const text = clipboardRawText.value;
          let parsedCount = 0;

          const phoneMatch = text.match(/(?:\+?88)?01[3-9]\d{8}/) || text.match(/01[3-9]\d{2}[-\s]?\d{6}/) || text.match(/[০-৯]{11}/);
          if (phoneMatch) {
            intakeForm.customerPhone = phoneMatch[0].replace(/[-\s]/g, '');
            parsedCount++;
          }

          const codeMatch = text.match(/RH-\d{3,4}/i);
          if (codeMatch) {
            // designCode extraction removed
            parsedCount++;
          }

          if (/messenger|fb|facebook/i.test(text)) {
            intakeForm.trafficSource = 'Messenger';
            parsedCount++;
          } else if (/whatsapp|wa/i.test(text)) {
            intakeForm.trafficSource = 'WhatsApp';
            parsedCount++;
          } else if (/call|phone|direct/i.test(text)) {
            intakeForm.trafficSource = 'Direct Call';
            parsedCount++;
          }

          // English Seat Configs
          if (/1-seater|1 seater/i.test(text)) intakeForm.seatConfig = '1-Seater';
          else if (/2-seater|2 seater/i.test(text)) intakeForm.seatConfig = '2-Seater';
          else if (/3-seater|3 seater/i.test(text)) intakeForm.seatConfig = '3-Seater';
          else if (/l-shape|l shape/i.test(text)) intakeForm.seatConfig = 'L-Shape';
          
          // Bengali Seat Configs (সোফা: ৩+১)
          const bnSofaMatch = text.match(/(?:সোফা|sofa)[:\s=]*([\u0980-\u09FF0-9+]+)/i);
          if (bnSofaMatch && !intakeForm.seatConfig) {
            intakeForm.seatConfig = bnSofaMatch[1].trim();
            parsedCount++;
          }

          const nameMatch = text.match(/(?:name|customer|client|নাম|নামঃ)[:\s=]+([A-Za-z\s\u0980-\u09FF]+)/i);
          if (nameMatch) {
            const cleanName = nameMatch[1].replace(/ফোন.*/i, '').trim();
            if (cleanName) {
              intakeForm.customerName = cleanName;
              parsedCount++;
            }
          }

          const addrMatch = text.match(/(?:address|location|ঠিকানা|ঠিকানাঃ)[:\s=]+(.+)/i);
          if (addrMatch) {
            intakeForm.customerAddress = addrMatch[1].trim();
            parsedCount++;
          }

          // Bengali numeral converter helper
          const bnToEn = (str) => {
            const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            return str.replace(/[০-৯]/g, (match) => bnDigits.indexOf(match));
          };

          const priceMatch = text.match(/(?:price|sale|cost|প্রাইস)[:\s=]*([0-9,\u09e6-\u09ef]+)/i) || text.match(/([0-9\u09e6-\u09ef]{4,6})\s*(?:tk|টাকা)/i);
          if (priceMatch) {
            const cleanPrice = bnToEn(priceMatch[1].replace(/,/g, ''));
            intakeForm.saleAmount = parseInt(cleanPrice, 10);
            parsedCount++;
          }

          const delMatch = text.match(/(?:del|delivery|charge|ডেলিভারি চার্জ|ডেলিভারি)[:\s=]*([0-9,\u09e6-\u09ef]+)/i);
          if (delMatch) {
            const cleanDel = bnToEn(delMatch[1].replace(/,/g, ''));
            intakeForm.deliveryCharge = parseInt(cleanDel, 10);
            parsedCount++;
          }

          const colorMatch = text.match(/(?:color|কালার|রং)[:\s=]+([A-Za-z\s\u0980-\u09FF]+)/i);
          if (colorMatch) {
            const cleanColor = colorMatch[1].replace(/প্রাইস.*/i, '').trim();
            if (cleanColor) {
               intakeForm.extraDetails = cleanColor;
               parsedCount++;
            }
          }

          const cnMatch = text.match(/(?:cn|consignment|courier id)[:\s=]*([A-Za-z0-9-]+)/i);
          if (cnMatch) {
            intakeForm.cnNumber = cnMatch[1].toUpperCase();
            parsedCount++;
          }

          const invMatch = text.match(/(?:inv|invoice|bill)[:\s=]*([A-Za-z0-9-]+)/i);
          if (invMatch) {
            intakeForm.invoiceNumber = invMatch[1].toUpperCase();
            parsedCount++;
          }
          
          if (/SFC|steadfast/i.test(text)) {
            intakeForm.fulfillmentMethod = 'Steadfast Courier';
          } else if (/redx/i.test(text)) {
            intakeForm.fulfillmentMethod = 'RedX Delivery';
          } else if (/pathao/i.test(text)) {
            intakeForm.fulfillmentMethod = 'Pathao';
          } else {
             intakeForm.fulfillmentMethod = 'Steadfast Courier'; // default fallback for their setup
          }

          parseSuccessMsg.value = `✨ Parsed ${parsedCount} fields automatically from pasted message!`;
          setTimeout(() => { parseSuccessMsg.value = ''; }, 4000);
        };

        // --- HIGH-PERFORMANCE PNG CONVERTER & CLIPBOARD ENGINE ---
        const loadImageSafe = (url) => {
          return new Promise((resolve) => {
            if (!url) return resolve(null);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => {
              const fallbackImg = new Image();
              fallbackImg.onload = () => resolve(fallbackImg);
              fallbackImg.onerror = () => resolve(null);
              fallbackImg.src = url;
            };
            img.src = url;
          });
        };

        const writePngBlobToClipboard = async (pngBlob, textMsg = '') => {
          if (!pngBlob) return false;
          try {
            if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
              const items = { 'image/png': pngBlob };
              if (textMsg) {
                items['text/plain'] = new Blob([textMsg], { type: 'text/plain' });
              }
              await navigator.clipboard.write([
                new ClipboardItem(items)
              ]);
              return true;
            }
            return false;
          } catch (err) {
            console.warn('Direct clipboard write failed:', err);
            return false;
          }
        };

        const generateOrdersCompositePng = async (ordersList, headerTitle = 'HOMEAURA PRODUCTION DISPATCH') => {
          if (!ordersList || ordersList.length === 0) return null;

          // SPECIAL HIGH-DEFINITION RENDERING FOR SINGLE ORDER SUBMISSION
          if (ordersList.length === 1) {
            const ord = ordersList[0];
            const collageImg = (ord.collagePhotoLocalUrl || ord.collagePhotoUrl) ? await loadImageSafe(ord.collagePhotoLocalUrl || ord.collagePhotoUrl) : null;
            const proofImg = (ord.socialProofLocalUrl || ord.socialProofUrl) ? await loadImageSafe(ord.socialProofLocalUrl || ord.socialProofUrl) : null;

            const canvasWidth = 1120;
            const padding = 28;
            const headerHeight = 96;
            const specHeight = 160;
            const footerHeight = 44;

            // Calculate height of image region
            let imageSectionHeight = 0;
            const hasBoth = !!(collageImg && proofImg);
            const hasAny = !!(collageImg || proofImg);

            if (hasBoth) {
              const halfWidth = (canvasWidth - padding * 3) / 2;
              const aspect1 = collageImg.height / collageImg.width;
              const aspect2 = proofImg.height / proofImg.width;
              const h1 = Math.min(Math.max(halfWidth * aspect1, 380), 750);
              const h2 = Math.min(Math.max(halfWidth * aspect2, 380), 750);
              imageSectionHeight = Math.max(h1, h2) + 50; // extra for photo titles
            } else if (hasAny) {
              const targetImg = collageImg || proofImg;
              const targetWidth = canvasWidth - padding * 2;
              const aspect = targetImg.height / targetImg.width;
              imageSectionHeight = Math.min(Math.max(targetWidth * aspect, 420), 850) + 50;
            } else {
              imageSectionHeight = 120;
            }

            const totalHeight = headerHeight + specHeight + imageSectionHeight + footerHeight + padding * 3;

            const canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = totalHeight;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Dark Luxury Background (#090d16)
            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, canvasWidth, totalHeight);

            // Top Gradient Accent Line
            const grad = ctx.createLinearGradient(0, 0, canvasWidth, 0);
            grad.addColorStop(0, '#6366f1');
            grad.addColorStop(0.5, '#06b6d4');
            grad.addColorStop(1, '#10b981');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvasWidth, 5);

            // Master Header Container
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.roundRect(padding, padding, canvasWidth - padding * 2, headerHeight, 14);
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#1e293b';
            ctx.stroke();

            // Brand & Order Badge
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText('✨ HOMEAURA LUXURY FURNITURE', padding + 20, padding + 38);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 13px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(`ORDER MANIFEST: ${ord.id} • ${ord.fabric || 'CUSTOM SPEC'}`, padding + 20, padding + 64);

            // Order ID / Urgent pill on right
            const pillX = canvasWidth - padding - 210;
            ctx.fillStyle = ord.urgent ? '#e11d48' : '#4f46e5';
            ctx.beginPath();
            ctx.roundRect(pillX, padding + 22, 190, 48, 10);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 15px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.textAlign = 'center';
            ctx.fillText(ord.id, pillX + 95, padding + 44);
            ctx.font = '10px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(ord.urgent ? '🚨 URGENT RUSH ORDER' : `MERCHANT: ${ord.merchantName || 'SELLER'}`, pillX + 95, padding + 60);
            ctx.textAlign = 'left';

            // Specification Grid Card
            const specY = padding + headerHeight + 16;
            ctx.fillStyle = '#111827';
            ctx.beginPath();
            ctx.roundRect(padding, specY, canvasWidth - padding * 2, specHeight, 14);
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#1e293b';
            ctx.stroke();

            const colWidth = (canvasWidth - padding * 2) / 4;

            // Column 1: Client
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 10px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText('👤 CUSTOMER INFORMATION', padding + 16, specY + 28);
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 14px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(ord.customerName || 'N/A', padding + 16, specY + 50);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '12px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(ord.customerPhone || 'N/A', padding + 16, specY + 70);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '11px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            const addr = ord.customerAddress || 'N/A';
            ctx.fillText(addr.length > 36 ? addr.slice(0, 34) + '...' : addr, padding + 16, specY + 92);
            ctx.fillStyle = '#64748b';
            ctx.font = '10px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(`Source: ${ord.trafficSource || 'Direct'}`, padding + 16, specY + 114);

            // Column 2: Product & Config
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 10px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText('🛋️ PRODUCT SPECIFICATION', padding + colWidth + 10, specY + 28);
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 14px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(`${ord.productCategory || 'Sofa'}`, padding + colWidth + 10, specY + 50);
            ctx.fillStyle = '#a78bfa';
            ctx.font = 'bold 12px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(`Fabric: ${ord.fabric || 'N/A'}`, padding + colWidth + 10, specY + 70);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '11px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(`Config: ${ord.seatConfig || 'Standard'}`, padding + colWidth + 10, specY + 92);
            ctx.fillStyle = '#64748b';
            ctx.font = '10px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(`Fulfillment: ${ord.fulfillmentMethod || 'Delivery'}`, padding + colWidth + 10, specY + 114);

            // Column 3: Pricing
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 10px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText('💵 FINANCIAL BREAKDOWN', padding + colWidth * 2 + 10, specY + 28);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '12px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(`Sale Price: ৳${(ord.saleAmount || 0).toLocaleString()}`, padding + colWidth * 2 + 10, specY + 50);
            ctx.fillText(`Delivery: ৳${(ord.deliveryCharge || 0).toLocaleString()}`, padding + colWidth * 2 + 10, specY + 70);
            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 16px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(`TOTAL: ৳${(ord.totalAmount || 0).toLocaleString()}`, padding + colWidth * 2 + 10, specY + 98);
            ctx.fillStyle = '#64748b';
            ctx.font = '10px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(`Status: ${ord.status || 'Active'}`, padding + colWidth * 2 + 10, specY + 120);

            // Column 4: Tracking & Notes
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 10px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText('📑 LOGISTICS & NOTES', padding + colWidth * 3 + 10, specY + 28);
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 11px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(`CN: ${ord.cnNumber || 'N/A'}`, padding + colWidth * 3 + 10, specY + 50);
            ctx.fillText(`Invoice: ${ord.invoiceNumber || 'N/A'}`, padding + colWidth * 3 + 10, specY + 68);
            if (ord.extraDetails) {
              ctx.fillStyle = '#fbbf24';
              ctx.font = '10px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
              ctx.fillText(`Specs: ${ord.extraDetails.slice(0, 30)}`, padding + colWidth * 3 + 10, specY + 88);
            }
            if (ord.notes) {
              ctx.fillStyle = '#94a3b8';
              ctx.font = 'italic 10px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
              ctx.fillText(`Note: ${ord.notes.slice(0, 30)}`, padding + colWidth * 3 + 10, specY + 108);
            }

            // Image Render Area
            const imgY = specY + specHeight + 16;

            if (hasBoth) {
              const cardW = (canvasWidth - padding * 3) / 2;
              const maxH = imageSectionHeight - 40;

              // Left: Product & Fabric Collage Photo
              ctx.fillStyle = '#1e293b';
              ctx.beginPath();
              ctx.roundRect(padding, imgY, cardW, imageSectionHeight, 14);
              ctx.fill();
              ctx.strokeStyle = '#334155';
              ctx.stroke();

              ctx.fillStyle = '#6366f1';
              ctx.beginPath();
              ctx.roundRect(padding + 12, imgY + 12, 170, 24, 6);
              ctx.fill();
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 11px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
              ctx.fillText('📸 PRODUCT COLLAGE', padding + 20, imgY + 28);

              ctx.save();
              ctx.beginPath();
              ctx.roundRect(padding + 10, imgY + 44, cardW - 20, maxH - 12, 10);
              ctx.clip();
              ctx.drawImage(collageImg, padding + 10, imgY + 44, cardW - 20, maxH - 12);
              ctx.restore();

              // Right: Social Proof Screenshot
              const rightX = padding * 2 + cardW;
              ctx.fillStyle = '#1e293b';
              ctx.beginPath();
              ctx.roundRect(rightX, imgY, cardW, imageSectionHeight, 14);
              ctx.fill();
              ctx.strokeStyle = '#334155';
              ctx.stroke();

              ctx.fillStyle = '#059669';
              ctx.beginPath();
              ctx.roundRect(rightX + 12, imgY + 12, 190, 24, 6);
              ctx.fill();
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 11px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
              ctx.fillText('💬 CHAT & SOCIAL PROOF', rightX + 20, imgY + 28);

              ctx.save();
              ctx.beginPath();
              ctx.roundRect(rightX + 10, imgY + 44, cardW - 20, maxH - 12, 10);
              ctx.clip();
              ctx.drawImage(proofImg, rightX + 10, imgY + 44, cardW - 20, maxH - 12);
              ctx.restore();

            } else if (hasAny) {
              const targetImg = collageImg || proofImg;
              const isCollage = !!collageImg;
              const cardW = canvasWidth - padding * 2;
              const maxH = imageSectionHeight - 40;

              ctx.fillStyle = '#1e293b';
              ctx.beginPath();
              ctx.roundRect(padding, imgY, cardW, imageSectionHeight, 14);
              ctx.fill();
              ctx.strokeStyle = '#334155';
              ctx.stroke();

              ctx.fillStyle = isCollage ? '#6366f1' : '#059669';
              ctx.beginPath();
              ctx.roundRect(padding + 14, imgY + 12, 200, 24, 6);
              ctx.fill();
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 11px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
              ctx.fillText(isCollage ? '📸 PRODUCT COLLAGE PHOTO' : '💬 SOCIAL PROOF SCREENSHOT', padding + 22, imgY + 28);

              ctx.save();
              ctx.beginPath();
              ctx.roundRect(padding + 10, imgY + 44, cardW - 20, maxH - 12, 10);
              ctx.clip();
              ctx.drawImage(targetImg, padding + 10, imgY + 44, cardW - 20, maxH - 12);
              ctx.restore();
            } else {
              // No image fallback container
              const cardW = canvasWidth - padding * 2;
              ctx.fillStyle = '#111827';
              ctx.beginPath();
              ctx.roundRect(padding, imgY, cardW, imageSectionHeight, 14);
              ctx.fill();
              ctx.fillStyle = '#94a3b8';
              ctx.font = 'italic 13px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
              ctx.fillText('ℹ️ No image attachments uploaded for this order manifest.', padding + 24, imgY + 65);
            }

            // Bottom Footer
            const footY = totalHeight - footerHeight;
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, footY, canvasWidth, footerHeight);

            ctx.fillStyle = '#64748b';
            ctx.font = '11px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
            ctx.fillText(`🕒 Verified Bangladesh Time (BST, UTC+6): ${formatBangladeshDisplayTime(new Date())} | HomeAura Production Hub`, padding, footY + 26);

            return new Promise((resolve) => {
              canvas.toBlob((blob) => {
                resolve({
                  blob,
                  dataUrl: canvas.toDataURL('image/png'),
                  itemsCount: (collageImg ? 1 : 0) + (proofImg ? 1 : 0)
                });
              }, 'image/png');
            });
          }

          // MULTI-ORDER BULK DISPATCH GRID RENDERING
          const items = [];
          for (const ord of ordersList) {
            const urls = [];
            // For Factory Bulk Dispatch, only include the Product Collage Photo
            // Exclude Social Proof to keep the factory manifest focused and clean
            if (ord.collagePhotoUrl) urls.push({ type: 'Collage Photo', url: ord.collagePhotoLocalUrl || ord.collagePhotoUrl, filename: ord.collagePhotoFileName });

            if (urls.length === 0) {
              items.push({
                order: ord,
                type: 'Order Spec Card',
                img: null
              });
            } else {
              for (const u of urls) {
                const loaded = await loadImageSafe(u.url);
                items.push({
                  order: ord,
                  type: u.type,
                  img: loaded
                });
              }
            }
          }

          if (items.length === 0) return null;

          const cardWidth = 600;
          const padding = 24;
          const masterHeaderHeight = 96;
          const cardHeaderHeight = 64;
          const numItems = items.length;

          let cols = 1;
          if (numItems >= 7) cols = 3;
          else if (numItems >= 3) cols = 2;
          else cols = numItems === 1 ? 1 : 2;

          const rows = Math.ceil(numItems / cols);

          const cardHeights = items.map(item => {
            if (!item.img) return 240;
            const aspect = item.img.height / item.img.width;
            const imgH = Math.min(Math.max(cardWidth * aspect, 280), 750);
            return imgH + cardHeaderHeight + 20;
          });

          const rowHeights = [];
          for (let r = 0; r < rows; r++) {
            let maxH = 0;
            for (let c = 0; c < cols; c++) {
              const idx = r * cols + c;
              if (idx < numItems) {
                maxH = Math.max(maxH, cardHeights[idx]);
              }
            }
            rowHeights.push(maxH);
          }

          const totalWidth = cols * cardWidth + (cols + 1) * padding;
          const totalHeight = masterHeaderHeight + rowHeights.reduce((a, b) => a + b, 0) + (rows + 1) * padding;

          const canvas = document.createElement('canvas');
          canvas.width = totalWidth;
          canvas.height = totalHeight;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Dark slate luxury canvas background
          ctx.fillStyle = '#090d16';
          ctx.fillRect(0, 0, totalWidth, totalHeight);

          // Master Banner Header
          ctx.fillStyle = '#111827';
          ctx.fillRect(0, 0, totalWidth, masterHeaderHeight);

          // Top Vibrant Accent Line
          const grad = ctx.createLinearGradient(0, 0, totalWidth, 0);
          grad.addColorStop(0, '#6366f1');
          grad.addColorStop(0.5, '#06b6d4');
          grad.addColorStop(1, '#10b981');
          ctx.fillStyle = grad;
          ctx.fillRect(0, masterHeaderHeight - 5, totalWidth, 5);

          // Master Header Text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
          ctx.fillText(`✨ ${headerTitle}`, padding + 4, 42);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '13px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
          const subText = `Batch: ${ordersList.length} Order(s) | Attached Collages: ${numItems} Image(s) | Bangladesh Time: ${formatBangladeshDisplayTime(new Date())}`;
          ctx.fillText(subText, padding + 4, 70);

          // Render Cards
          let currentY = masterHeaderHeight + padding;
          for (let r = 0; r < rows; r++) {
            const rowH = rowHeights[r];
            for (let c = 0; c < cols; c++) {
              const idx = r * cols + c;
              if (idx >= numItems) break;

              const item = items[idx];
              const cardX = padding + c * (cardWidth + padding);
              const cardY = currentY;
              const thisCardH = cardHeights[idx];
              const ord = item.order;

              // Card Background
              ctx.fillStyle = '#1e293b';
              ctx.beginPath();
              ctx.roundRect(cardX, cardY, cardWidth, thisCardH, 14);
              ctx.fill();
              ctx.lineWidth = 1.5;
              ctx.strokeStyle = '#334155';
              ctx.stroke();

              // Card Header Top Area
              ctx.fillStyle = '#0f172a';
              ctx.beginPath();
              ctx.roundRect(cardX, cardY, cardWidth, cardHeaderHeight, [14, 14, 0, 0]);
              ctx.fill();

              // Order ID & Design Code
              ctx.fillStyle = '#38bdf8';
              ctx.font = 'bold 15px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
              ctx.fillText(`📦 ${ord.id} - ${ord.fabric || 'No Fabric'}`, cardX + 16, cardY + 26);

              // Secondary details line
              ctx.fillStyle = '#cbd5e1';
              ctx.font = '12px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
              const detailStr = `Item: ${ord.productCategory || 'N/A'} (${ord.seatConfig || ''}) | Specs: ${ord.extraDetails || 'Standard'}`;
              ctx.fillText(detailStr.length > 50 ? detailStr.slice(0, 48) + '...' : detailStr, cardX + 16, cardY + 48);

              // Type Tag Badge
              ctx.fillStyle = item.type.includes('Collage') ? '#4f46e5' : (item.type.includes('Proof') ? '#059669' : '#475569');
              ctx.beginPath();
              ctx.roundRect(cardX + cardWidth - 120, cardY + 14, 106, 24, 6);
              ctx.fill();
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 11px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
              ctx.fillText(item.type, cardX + cardWidth - 110, cardY + 30);

              // Image Area
              const imgAreaX = cardX + 12;
              const imgAreaY = cardY + cardHeaderHeight + 8;
              const imgAreaW = cardWidth - 24;
              const imgAreaH = thisCardH - cardHeaderHeight - 20;

              if (item.img) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(imgAreaX, imgAreaY, imgAreaW, imgAreaH, 10);
                ctx.clip();
                ctx.drawImage(item.img, imgAreaX, imgAreaY, imgAreaW, imgAreaH);
                ctx.restore();
              } else {
                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                ctx.roundRect(imgAreaX, imgAreaY, imgAreaW, imgAreaH, 10);
                ctx.fill();
                ctx.fillStyle = '#94a3b8';
                ctx.font = 'italic 13px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
                ctx.fillText('No image attachment uploaded', imgAreaX + 18, imgAreaY + 36);
                ctx.fillStyle = '#e2e8f0';
                ctx.font = '12px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
                ctx.fillText(`Phone: ${ord.customerPhone || 'N/A'}`, imgAreaX + 18, imgAreaY + 66);
                ctx.fillText(`Address: ${ord.customerAddress || 'N/A'}`, imgAreaX + 18, imgAreaY + 90);
                if (ord.extraDetails) ctx.fillText(`Specs: ${ord.extraDetails}`, imgAreaX + 18, imgAreaY + 114);
              }
            }
            currentY += rowH + padding;
          }

          return new Promise((resolve) => {
            canvas.toBlob((blob) => {
              resolve({
                blob,
                dataUrl: canvas.toDataURL('image/png'),
                itemsCount: numItems
              });
            }, 'image/png');
          });
        };

        const copyBothPhotosToClipboard = async (url1, url2, orderObj = null) => {
          return { success: false, result: null };
        };
        const fetchImageAsBlob = async (url) => {
          if (!url) return null;
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Fetch failed");
            return await res.blob();
          } catch (e) {
            console.warn("Fetch failed, trying canvas fallback:", url);
            return new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(resolve, "image/png");
              };
              img.onerror = () => resolve(null);
              img.src = url;
            });
          }
        };

        const writeMultipleBlobsToClipboard = async (blobs, textMsg = '') => {
          const validBlobs = blobs.filter(b => b);
          if (validBlobs.length === 0) {
            if (textMsg) {
              await navigator.clipboard.writeText(textMsg);
              return true;
            }
            return false;
          }
          try {
            let copied = false;
            const copyHandler = (e) => {
              validBlobs.forEach((b, i) => {
                e.clipboardData.items.add(new File([b], `image_${i}.png`, { type: b.type || 'image/png' }));
              });
              if (textMsg) e.clipboardData.setData('text/plain', textMsg);
              e.preventDefault();
              copied = true;
            };
            document.addEventListener('copy', copyHandler, { once: true });
            document.execCommand('copy');
            if (copied) return true;
          } catch (e) {
            console.warn('execCommand copy failed, falling back to Clipboard API', e);
          }
          try {
            if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
               const b = validBlobs[0];
               const items = { [b.type || 'image/png']: b };
               if (textMsg) items['text/plain'] = new Blob([textMsg], { type: 'text/plain' });
               await navigator.clipboard.write([new ClipboardItem(items)]);
               return true;
            }
          } catch (e) {
            console.warn('Clipboard API write failed', e);
          }
          return false;
        };
        const submitNewOrder = async () => {
          let maxNum = 1000;
          orders.value.forEach(o => {
            if (o && o.id) {
              const m = String(o.id).match(/ORD-(\d+)/i);
              if (m) {
                const num = parseInt(m[1], 10);
                if (!isNaN(num) && num > maxNum) maxNum = num;
              }
            }
          });
          deletedOrders.value.forEach(o => {
            if (o && o.id) {
              const m = String(o.id).match(/ORD-(\d+)/i);
              if (m) {
                const num = parseInt(m[1], 10);
                if (!isNaN(num) && num > maxNum) maxNum = num;
              }
            }
          });
          const nextOrderNum = maxNum + 1;
          const newId = 'ORD-' + nextOrderNum;
          const timestamp = getBstIsoString();
          const sellerUsername = currentUser.value ? currentUser.value?.username : 'seller';
          const autoCn = intakeForm.cnNumber || ("CN-" + nextOrderNum);
          const autoInv = intakeForm.invoiceNumber || ("INV-" + nextOrderNum);
          const dateStr = getBangladeshDateString(new Date());
          const autoFileName = intakeForm.collagePhotoFileName || `collage_attachments/${sellerUsername}_${autoCn.replace(/[^a-zA-Z0-9-]/g, '')}_${autoInv.replace(/[^a-zA-Z0-9-]/g, '')}_${dateStr}.jpg`;
          
          const newOrder = {
            id: newId,
            timestamp,
            merchantId: currentUser.value.id,
            merchantName: currentUser.value.name,
            customerName: intakeForm.customerName,
            customerPhone: intakeForm.customerPhone,
            customerAddress: intakeForm.customerAddress,
            trafficSource: intakeForm.trafficSource,
            fabric: intakeForm.fabric,
            productCategory: intakeForm.productCategory,
            seatConfig: intakeForm.seatConfig,
            fulfillmentMethod: intakeForm.fulfillmentMethod,
            saleAmount: intakeForm.saleAmount || 0,
            deliveryCharge: intakeForm.deliveryCharge || 0,
            totalAmount: (intakeForm.saleAmount || 0) + (intakeForm.deliveryCharge || 0),
            status: 'Confirmation Call',
            urgent: intakeForm.urgent,
            notes: intakeForm.notes,
            cnNumber: autoCn,
            invoiceNumber: autoInv,
            collagePhotoUrl: intakeForm.collagePhotoUrl || '',
            collagePhotoLocalUrl: intakeForm.collagePhotoLocalUrl || '',
            collagePhotoFileName: autoFileName,
            socialProofUrl: intakeForm.socialProofUrl || '',
            socialProofLocalUrl: intakeForm.socialProofLocalUrl || '',
            socialProofFileName: intakeForm.socialProofFileName || '',
            extraDetails: intakeForm.extraDetails || '',
            factoryTag: intakeForm.factoryTag || '',
            updatedAt: getBstIsoString(),
            updatedBy: currentUser.value ? currentUser.value?.username : 'seller'
          };
          
          const proofUrlToCopy = intakeForm.socialProofUrl;
          const collageUrlToCopy = intakeForm.collagePhotoUrl;
          
          orders.value.unshift(newOrder);
          queueChange('orders', newOrder);
          saveOrdersLocally();

          // Reset intake form
          intakeForm.customerName = '';
          intakeForm.customerPhone = '';
          intakeForm.customerAddress = '';
          intakeForm.fabric = '';
          intakeForm.saleAmount = 0;
          intakeForm.deliveryCharge = 0;
          intakeForm.urgent = false;
          intakeForm.notes = '';
          intakeForm.cnNumber = '';
          intakeForm.invoiceNumber = '';
          intakeForm.collagePhotoUrl = '';
          intakeForm.collagePhotoLocalUrl = '';
          intakeForm.collagePhotoFileName = '';
          intakeForm.socialProofUrl = '';
          intakeForm.socialProofLocalUrl = '';
          intakeForm.socialProofFileName = '';
          intakeForm.extraDetails = '';
          intakeForm.factoryTag = '';
          clipboardRawText.value = '';
          activeTab.value = 'my_orders';
          
          let waText = `📦 *NEW HOMEAURA ORDER SUBMISSION*\n`;
          waText += `━━━━━━━━━━━━━━━━━━━━━\n`;
          waText += `🆔 *Order Ref:* ${newOrder.id}\n`;
          waText += `👤 *Merchant:* ${newOrder.merchantName}\n`;
          waText += `📞 *Customer:* ${newOrder.customerName} (${newOrder.customerPhone})\n`;
          waText += `📍 *Delivery Address:* ${newOrder.customerAddress}\n`;
          waText += `🛋️ *Item:* ${newOrder.productCategory} (${newOrder.fabric}) (${newOrder.seatConfig})\n`;
          waText += `🚚 *Fulfillment:* ${newOrder.fulfillmentMethod}\n`;
          waText += `💵 *Total Payable:* ৳${(newOrder.totalAmount || 0).toLocaleString()} (Sale: ৳${(newOrder.saleAmount || 0).toLocaleString()} + Del: ৳${(newOrder.deliveryCharge || 0).toLocaleString()})\n`;
          waText += `📑 *CN / Invoice:* ${newOrder.cnNumber || 'N/A'} / ${newOrder.invoiceNumber || 'N/A'}\n`;
          if (newOrder.notes) waText += `📝 *Notes:* ${newOrder.notes}\n`;
          if (newOrder.extraDetails) waText += `🔍 *Specs:* ${newOrder.extraDetails}\n`;
          if (newOrder.collagePhotoUrl) waText += `🖼️ *Product Photo:* ${newOrder.collagePhotoUrl}\n`;
          if (newOrder.socialProofUrl) waText += `📸 *Payment/Proof:* ${newOrder.socialProofUrl}\n`;
          waText += `━━━━━━━━━━━━━━━━━━━━━\n`;
          waText += `🕒 *Registered (BST):* ${formatBangladeshDisplayTime(new Date())}\n`;

          let hasCopiedPhotos = false;
          let generatedPngData = null;
          let hasCopiedTextAndImage = false;

          try {
            const blob1 = await fetchImageAsBlob(newOrder.collagePhotoUrl);
            const blob2 = await fetchImageAsBlob(newOrder.socialProofUrl);
            hasCopiedTextAndImage = await writeMultipleBlobsToClipboard([blob1, blob2], waText);
            hasCopiedPhotos = hasCopiedTextAndImage;
            if (!hasCopiedTextAndImage) {
              await navigator.clipboard.writeText(waText);
              hasCopiedTextAndImage = true;
            }
          } catch (err) {
            console.error("Clipboard copy failed:", err);
            try {
              await navigator.clipboard.writeText(waText);
              hasCopiedTextAndImage = true;
            } catch (e2) {}
          }
          orderSuccessData.order = newOrder;
          orderSuccessData.hasCopiedPhotos = hasCopiedPhotos;
          orderSuccessData.compositePngUrl = "";
          orderSuccessData.previewPngUrl = "";
          orderSuccessData.compositePngBlob = null;
          orderSuccessData.waGroupLink = (adminWaGroupLink.value || '').trim() || DEFAULT_WA_GROUP_LINK;
          orderSuccessData.formattedSummary = waText;
          orderSuccessData.isCopiedText = hasCopiedTextAndImage;

          activeModal.value = 'orderSuccessModal';

          // Attempt pop-up opening if configured
          const targetWaUrl = orderSuccessData.waGroupLink;
          if (targetWaUrl) {
            try {
              window.open(targetWaUrl, '_blank');
            } catch (e) {}
          }
        };

        const quickStatusChange = (order, newStatus) => {
          if (currentUser.value?.role === 'seller' && order.merchantName !== currentUser.value?.name && order.merchantId !== currentUser.value?.id) {
            alert("⚠️ Security restriction: You cannot update status of orders assigned to other merchants.");
            return;
          }
          order.status = newStatus;
          order.updatedAt = getBstIsoString();
          order.updatedBy = currentUser.value?.username || 'seller';
          queueChange('orders', order);
          saveOrdersLocally();
        };

        const toggleUrgent = (order) => {
          if (currentUser.value?.role === 'seller' && order.merchantName !== currentUser.value?.name && order.merchantId !== currentUser.value?.id) {
            alert("⚠️ Security restriction: You cannot update orders assigned to other merchants.");
            return;
          }
          order.urgent = !order.urgent;
          order.updatedAt = getBstIsoString();
          order.updatedBy = currentUser.value?.username || 'seller';
          queueChange('orders', order);
          saveOrdersLocally();
        };

        // --- FACTORY BILLS AND EXPENSES ---
        const openAddBillModal = () => {
          modalData.title = 'Add Factory Bill & Payment';
          modalData.bill = reactive({ factoryId: '', sellerId: '', amount: '', overcharge: '', date: getBangladeshDateString(new Date()), notes: '', linkedOrderIds: [], photoUrl: '' });
          selectedProofTile.value = 'modal';
          activeModal.value = 'factoryBillModal';
        };

        const openEditBillModal = (bill) => {
          modalData.title = 'Edit Factory Bill & Linked Orders';
          modalData.bill = reactive({ ...bill, linkedOrderIds: bill.linkedOrderIds || [], overcharge: bill.overcharge || '' });
          selectedProofTile.value = 'modal';
          activeModal.value = 'factoryBillModal';
        };

        const saveBillModal = () => {
          if (!modalData.bill.factoryId || !modalData.bill.amount) {
            alert('Factory and Amount are required.');
            return;
          }
          
          const factoryName = getFactoryName(modalData.bill.factoryId);
          const allOrders = [...orders.value, ...deletedOrders.value];
          modalData.bill.linkedOrderIds = (modalData.bill.linkedOrderIds || []).filter(id => {
            const o = allOrders.find(ord => ord.id === id);
            if (!o) return false;
            if (o.factoryTag !== factoryName) return false;
            if (modalData.bill.sellerId && o.merchantId !== modalData.bill.sellerId) return false;
            return true;
          });

          let billToSave;
          if (modalData.bill.id) {
            const idx = factoryBills.value.findIndex(b => b.id === modalData.bill.id);
            if (idx !== -1) {
              factoryBills.value[idx] = { ...modalData.bill };
              billToSave = factoryBills.value[idx];
            } else {
              billToSave = { ...modalData.bill };
              factoryBills.value.push(billToSave);
            }
          } else {
            modalData.bill.id = 'FB-' + Date.now().toString().slice(-6);
            billToSave = { ...modalData.bill };
            factoryBills.value.push(billToSave);
          }

          billToSave.updatedAt = getBstIsoString();
          billToSave.updatedBy = currentUser.value?.username || 'admin';
          queueChange('factoryBills', billToSave);
          saveFactoryBillsLocally();
          closeModal();
        };

        const deleteBill = (id) => {
          openGlobalConfirm('Are you sure you want to delete this bill?', 'Delete Bill', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
            factoryBills.value = factoryBills.value.filter(b => b.id !== id);
            queueDelete('factoryBills', id);
            saveFactoryBillsLocally();
            closeModal();
          });
        };

        const openAddExpenseModal = () => {
          modalData.title = 'Record Operating Expense';
          modalData.expense = reactive({ date: getBangladeshDateString(new Date()), category: 'Other', amount: '', description: '' });
          activeModal.value = 'expenseModal';
        };

        const saveExpenseModal = () => {
          if (!modalData.expense.amount || !modalData.expense.category) {
            alert('Category and Amount are required.');
            return;
          }
          modalData.expense.id = 'EXP-' + Date.now().toString().slice(-6);
          modalData.expense.updatedAt = getBstIsoString();
          modalData.expense.updatedBy = currentUser.value?.username || 'admin';
          const savedExp = { ...modalData.expense };
          expenses.value.push(savedExp);
          queueChange('expenses', savedExp);
          saveExpensesLocally();
          closeModal();
        };

        const deleteExpense = (id) => {
          openGlobalConfirm('Are you sure you want to delete this expense record?', 'Delete Expense', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
            expenses.value = expenses.value.filter(e => e.id !== id);
            queueDelete('expenses', id);
            saveExpensesLocally();
            closeModal();
          });
        };

        const getExpenseCategoryClass = (cat) => {
          switch(cat) {
            case 'Salary': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Rent': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'Electricity': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Factory Payment': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
            case 'Marketing': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
          }
        };

        const getOrdersByIds = (ids) => {
          if (!ids || !ids.length) return [];
          return orders.value.filter(o => ids.includes(o.id));
        };

        const getBillOrdersTotalSale = (ids) => {
          const linked = getOrdersByIds(ids);
          return linked.reduce((sum, ord) => sum + (Number(ord.saleAmount) || 0), 0);
        };

        const getFactoryName = (id) => {
          const f = factories.value.find(fac => fac.id === id);
          return f ? f.name : 'Unknown Factory';
        };

        const openAddFactoryModal = () => {
          modalData.title = 'Register New Manufacturing Partner';
          modalData.factory = reactive({
            id: 'f' + (factories.value.length + 1),
            name: '',
            phone: '',
            waGroupLink: '',
            fabricQuality: 4,
            stockStatus: 'In Stock',
            baseWholesaleCost: 35000,
            notes: ''
          });
          activeModal.value = 'factoryModal';
        };

        const openEditFactoryModal = (factory) => {
          modalData.title = `Edit Factory: ${factory.name}`;
          modalData.factory = reactive({ ...factory });
          activeModal.value = 'factoryModal';
        };

        const saveFactoryModal = () => {
          const idx = factories.value.findIndex(f => f.id === modalData.factory.id);
          let facToSave;
          if (idx !== -1) {
            factories.value[idx] = { ...modalData.factory };
            facToSave = factories.value[idx];
          } else {
            facToSave = { ...modalData.factory };
            factories.value.push(facToSave);
          }
          facToSave.updatedAt = getBstIsoString();
          facToSave.updatedBy = currentUser.value?.username || 'admin';
          queueChange('factories', facToSave);
          saveFactoriesLocally();
          closeModal();
        };

        // --- WHATSAPP FACTORY DISPATCH ---
        const openDispatchModal = (order) => {
          modalData.title = `WhatsApp Factory Dispatch (Order ${order.id})`;
          modalData.order = reactive({ ...order });
          modalData.selectedFactoryId = rankedFactories.value.length > 0 ? rankedFactories.value[0].id : '';
          activeModal.value = 'dispatchModal';
        };

        const getWhatsAppPayloadText = (order, factoryId) => {
          if (!order) return "";
          const targetFactory = factories.value.find(f => f.id === factoryId) || factories.value[0];
          const factoryName = targetFactory ? targetFactory.name : "Factory Partner";
          let payload = `🏭 *HOMEAURA PRODUCTION ORDER DISPATCH*\n`;
          payload += `━━━━━━━━━━━━━━━━━━━━━\n`;
          payload += `🏭 *Target Factory:* ${factoryName}\n`;
          payload += `🆔 *Order Ref:* ${order.id}\n`;
          payload += `📑 *Consignment No (CN):* ${order.cnNumber || "N/A"}\n`;
          payload += `🧾 *Factory Invoice No:* ${order.invoiceNumber || "N/A"}\n`;
          payload += `📅 *Date:* ${order.timestamp}\n`;
          payload += `🛋️ *Product:* ${order.productCategory} (${order.seatConfig})\n`;
          payload += `🧵 *Fabric:* ${order.fabric}\n`;
          payload += `👤 *Client Name:* ${order.customerName}\n`;
          payload += `📞 *Client Contact:* ${order.customerPhone}\n`;
          payload += `📍 *Delivery Address:* ${order.customerAddress}\n`;
          if (order.extraDetails) payload += `🔍 *Fabric & Specs:* ${order.extraDetails}\n`;
          if (order.notes) payload += `📝 *Special Notes:* ${order.notes}\n`;
          if (order.collagePhotoFileName) payload += `🖼️ *Local Attachment:* ${order.collagePhotoFileName}\n`;
          if (order.collagePhotoUrl && !order.collagePhotoUrl.startsWith("data:")) payload += `🖼️ *Collage Photo Link:* ${order.collagePhotoUrl}\n`;
          if (order.socialProofUrl && !order.socialProofUrl.startsWith("data:")) payload += `📸 *Payment Proof Link:* ${order.socialProofUrl}\n`;
          payload += `━━━━━━━━━━━━━━━━━━━━━\n`;
          return payload;
        };

        const executeWhatsAppDispatch = async () => {
          if (!modalData.order || !modalData.selectedFactoryId) return;
          const targetFactory = factories.value.find(f => f.id === modalData.selectedFactoryId);
          if (!targetFactory) return;

          const order = modalData.order;
          const realOrder = orders.value.find(o => o.id === order.id);
          if (realOrder) {
            realOrder.factoryTag = targetFactory.name;
            realOrder.status = 'Factory Submit';
            realOrder.updatedAt = getBstIsoString();
            realOrder.updatedBy = currentUser.value?.username || 'user';
            queueChange('orders', realOrder);
            saveOrdersLocally();
          }

          const messageText = getWhatsAppPayloadText(order, modalData.selectedFactoryId);
          const encodedMessage = encodeURIComponent(messageText);

          let waUrl = '';
          if (targetFactory.waGroupLink) {
            waUrl = targetFactory.waGroupLink;
          } else {
            const cleanPhone = (targetFactory.phone || '').replace(/[^0-9]/g, '');
            waUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
          }

          let hasCopiedTextAndImage = false;
          try {
            const blob1 = await fetchImageAsBlob(order.collagePhotoUrl);
            const blob2 = await fetchImageAsBlob(order.socialProofUrl);
            hasCopiedTextAndImage = await writeMultipleBlobsToClipboard([blob1, blob2], messageText);
            if (!hasCopiedTextAndImage) {
              await navigator.clipboard.writeText(messageText);
              hasCopiedTextAndImage = true;
            }
          } catch (err) {
            console.error("Clipboard copy failed:", err);
            try {
              await navigator.clipboard.writeText(messageText);
              hasCopiedTextAndImage = true;
            } catch (e2) {}
          }
          bulkDispatchSuccessData.ordersCount = 1;
          bulkDispatchSuccessData.count = 1;
          bulkDispatchSuccessData.photoCount = (order.collagePhotoUrl ? 1 : 0) + (order.socialProofUrl ? 1 : 0);
          bulkDispatchSuccessData.factoryName = targetFactory.name;
          bulkDispatchSuccessData.waGroupLink = waUrl;
          bulkDispatchSuccessData.previewPngUrl = "";
          bulkDispatchSuccessData.compositePngBlob = null;
          bulkDispatchSuccessData.previewBlob = null;
          bulkDispatchSuccessData.hasCopiedPhotos = hasCopiedTextAndImage;
          bulkDispatchSuccessData.manifestText = messageText;
          bulkDispatchSuccessData.isCopiedText = false;

          activeModal.value = 'bulkDispatchSuccessModal';

          if (waUrl) {
            try {
              window.open(waUrl, '_blank');
            } catch (e) {}
          }
        };

        // --- BULK FACTORY DISPATCH ENGINE ---
        const openBulkFactoryDispatchModal = () => {
          if (selectedOrders.value.size === 0) {
            alert('⚠️ Please select at least one order using the checkboxes.');
            return;
          }
          if (currentUser.value?.role === 'seller') {
            const toDispatchIds = Array.from(selectedOrders.value);
            const hasOthers = orders.value.some(o => toDispatchIds.includes(o.id) && o.merchantName !== currentUser.value?.name && o.merchantId !== currentUser.value?.id);
            if (hasOthers) {
              alert("⚠️ Security restriction: You cannot dispatch orders assigned to other merchants.");
              return;
            }
          }

          const selectedList = orders.value.filter(o => selectedOrders.value.has(o.id));
          bulkDispatchData.selectedOrdersList = selectedList;
          bulkDispatchData.orders = selectedList;
          bulkDispatchData.selectedFactoryId = rankedFactories.value[0]?.id || (factories.value[0]?.id || null);
          bulkDispatchData.isGeneratingPng = false;
          bulkDispatchData.isLoading = false;
          activeModal.value = 'bulkDispatchModal';
        };

        const executeBulkFactoryDispatch = async () => {
          if (!bulkDispatchData.selectedFactoryId) {
            alert('⚠️ Please select a target factory.');
            return;
          }
          const targetFactory = factories.value.find(f => f.id === bulkDispatchData.selectedFactoryId);
          if (!targetFactory) {
            alert('⚠️ Selected factory not found.');
            return;
          }

          bulkDispatchData.isGeneratingPng = true;
          bulkDispatchData.isLoading = true;

          const selectedList = orders.value.filter(o => selectedOrders.value.has(o.id));
          if (selectedList.length === 0) {
            bulkDispatchData.isGeneratingPng = false;
            bulkDispatchData.isLoading = false;
            closeModal();
            return;
          }

          // Build consolidated manifest text for WhatsApp
          let manifestText = `🏭 *HOMEAURA BULK FACTORY DISPATCH MANIFEST*\n`;
          manifestText += `━━━━━━━━━━━━━━━━━━━━━\n`;
          manifestText += `🏭 *Factory:* ${targetFactory.name}\n`;
          manifestText += `📦 *Total Batched Orders:* ${selectedList.length} Order(s)\n`;
          manifestText += `📅 *Dispatch Date (BST):* ${formatBangladeshDisplayTime(new Date())}\n`;
          manifestText += `👤 *Dispatched By:* ${currentUser.value?.name || 'Administrator'}\n`;
          manifestText += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

          selectedList.forEach((ord, index) => {
            manifestText += `*#${index + 1} | Order ID:* ${ord.id}\n`;
            manifestText += `🛋️ *Item:* ${ord.productCategory} (${ord.fabric || 'N/A'}) (${ord.seatConfig || ''})\n`;
            if (ord.extraDetails) manifestText += `🔍 *Specs:* ${ord.extraDetails}\n`;
            if (ord.notes) manifestText += `📝 *Notes:* ${ord.notes}\n`;
            if (ord.collagePhotoUrl) manifestText += `🖼️ Product Photo: ${ord.collagePhotoUrl}\n`;
            manifestText += `------------------------------------\n`;
          });
          manifestText += `\n*Please confirm fabric availability & production queue for the attached order collages.*`;

          // Generate composite PNG containing all collages
          let hasCopiedPhotos = false;
          let pngResult = null;
          try {
            const allUrls = [];
            selectedList.forEach(o => {
               if(o.collagePhotoUrl) allUrls.push(o.collagePhotoUrl);
               if(o.socialProofUrl) allUrls.push(o.socialProofUrl);
            });
            const blobs = await Promise.all(allUrls.map(url => fetchImageAsBlob(url)));
            hasCopiedPhotos = await writeMultipleBlobsToClipboard(blobs);
          } catch (err) {
            console.warn("Notice fetching bulk images:", err.message);
          }
          // Update status of all selected orders in local state and queue for delta sync
          const nowIso = getBstIsoString();
          selectedList.forEach(ord => {
            ord.factoryTag = targetFactory.name;
            ord.status = 'Factory Submit';
            ord.updatedAt = nowIso;
            ord.updatedBy = currentUser.value?.username || 'user';
            queueChange('orders', ord);
          });
          saveOrdersLocally();

          // Calculate WA URL
          const encodedMessage = encodeURIComponent(manifestText);
          let waUrl = '';
          if (targetFactory.waGroupLink) {
            waUrl = targetFactory.waGroupLink;
          } else {
            const cleanPhone = (targetFactory.phone || '').replace(/[^0-9]/g, '');
            waUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
          }

          // Setup success modal state
          bulkDispatchSuccessData.ordersCount = selectedList.length;
          bulkDispatchSuccessData.count = selectedList.length;
          bulkDispatchSuccessData.photoCount = pngResult ? pngResult.itemsCount : 0;
          bulkDispatchSuccessData.factoryName = targetFactory.name;
          bulkDispatchSuccessData.waGroupLink = waUrl;
          bulkDispatchSuccessData.compositePngUrl = pngResult ? pngResult.dataUrl : '';
          bulkDispatchSuccessData.previewPngUrl = pngResult ? pngResult.dataUrl : '';
          bulkDispatchSuccessData.compositePngBlob = pngResult ? pngResult.blob : null;
          bulkDispatchSuccessData.previewBlob = pngResult ? pngResult.blob : null;
          bulkDispatchSuccessData.hasCopiedPhotos = hasCopiedPhotos;
          bulkDispatchSuccessData.manifestText = manifestText;
          try {
            await navigator.clipboard.writeText(manifestText);
            bulkDispatchSuccessData.isCopiedText = true;
            bulkDispatchSuccessData.compositePngUrl = "";
            bulkDispatchSuccessData.compositePngBlob = null;
          } catch(e) {
            console.error("Bulk Clipboard write error:", e);
            bulkDispatchSuccessData.isCopiedText = false;
          }
          // Clear selection
          selectedOrders.value.clear();
          bulkDispatchData.isGeneratingPng = false;
          bulkDispatchData.isLoading = false;

          // Show success modal
          activeModal.value = 'bulkDispatchSuccessModal';

          // Open WhatsApp group/chat
          if (waUrl) {
            try {
              window.open(waUrl, '_blank');
            } catch (e) {}
          }
        };

        // --- COURIER TRACKING MODAL ---
        const openCourierModal = (order) => {
          modalData.title = `Courier Site Verification: Order ${order.id}`;
          modalData.order = reactive({ ...order });
          modalData.newStatus = order.status;
          activeModal.value = 'courierModal';
        };

        const updateCourierStatus = () => {
          if (!modalData.order) return;
          const realOrder = orders.value.find(o => o.id === modalData.order.id);
          if (realOrder) {
            realOrder.status = modalData.newStatus;
            realOrder.updatedAt = getBstIsoString();
            realOrder.updatedBy = currentUser.value?.username || 'user';
            queueChange('orders', realOrder);
            saveOrdersLocally();
          }
          closeModal();
        };

        // --- PHOTO LIGHTBOX METHOD ---
        const openPhotoModal = (url, id) => {
          modalData.title = `Collage Photo Attachment - Order ${id || ''}`;
          modalData.url = url;
          activeModal.value = 'photoModal';
        };

        const openInspectModal = (order) => {
          modalData.title = `Full Order & Attachments: ${order.id}`;
          modalData.order = reactive({ ...order });
          activeModal.value = 'inspectModal';
        };

        // --- STATUS STYLING HELPER ---
        const getStatusStyle = (status) => {
          switch (status) {
            case 'Confirmation Call': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'Courier Booking': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Factory Submit': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Courier Pending': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
            case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Partial Delivered': return 'bg-teal-50 text-teal-700 border-teal-200';
            case 'Returned from Customer': return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'Returned Received': return 'bg-slate-100 text-slate-700 border-slate-300';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
          }
        };

        // --- CATEGORIES ---
        const addCategory = () => {
          if (newCategoryName.value && !categories.value.includes(newCategoryName.value)) {
            categories.value.push(newCategoryName.value);
            queueChange('categories', categories.value);
            saveCategoriesLocally();
            newCategoryName.value = '';
          }
        };

        const removeCategory = (index) => {
          categories.value.splice(index, 1);
          queueChange('categories', categories.value);
          saveCategoriesLocally();
        };

        // --- CSV EXPORT ---
        const exportCSV = () => {
          const headers = ['Order ID', 'CN Number', 'Invoice Number', 'Timestamp', 'Merchant', 'Customer Name', 'Phone', 'Shipping Address', 'Source', 'Design Code', 'Product', 'Seat Config', 'Fulfillment', 'Sale Price (BDT)', 'Delivery Charge (BDT)', 'Total Price (BDT)', 'Pipeline Status', 'Urgent Flag', 'Local Attachment Path', 'Notes'];
          
          const rows = orders.value.map(o => [
            `"${o.id}"`,
            `"${o.cnNumber || ''}"`,
            `"${o.invoiceNumber || ''}"`,
            `"${o.timestamp}"`,
            `"${o.merchantName}"`,
            `"${o.customerName.replace(/"/g, '""')}"`,
            `"${o.customerPhone}"`,
            `"${o.customerAddress.replace(/"/g, '""')}"`,
            `"${o.trafficSource}"`,
            `"${o.designCode}"`,
            `"${o.productCategory}"`,
            `"${o.seatConfig}"`,
            `"${o.fulfillmentMethod}"`,
            o.saleAmount,
            o.deliveryCharge,
            o.totalAmount,
            `"${o.status}"`,
            o.urgent ? 'YES' : 'NO',
            `"${o.collagePhotoFileName || ''}"`,
            `"${(o.notes || '').replace(/"/g, '""')}"`
          ]);

          const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', `HomeAura_Master_Ledger_Export_${getBangladeshDateString(new Date())}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        // --- ORDER EDITING ---
        const openEditOrderModal = (order) => {
          if (currentUser.value?.role === 'seller' && order.merchantName !== currentUser.value?.name && order.merchantId !== currentUser.value?.id) {
            alert("⚠️ Security restriction: You cannot edit orders assigned to other merchants/sellers.");
            return;
          }
          modalData.title = `Edit Order: ${order.id}`;
          modalData.order = reactive({ ...order });
          activeModal.value = 'editOrder';
        };

        const saveEditedOrder = () => {
          const idx = orders.value.findIndex(o => o.id === modalData.order.id);
          if (idx !== -1) {
            if (currentUser.value.role === 'seller') {
              const oldStatus = orders.value[idx].status;
              const newStatus = modalData.order.status;
              const oldIdx = pipelineStages.indexOf(oldStatus);
              const newIdx = pipelineStages.indexOf(newStatus);
              if (newIdx < oldIdx) {
                alert('⚠️ Sellers can only update order status in one way (forward pipeline stages). Backwards status updates are restricted to Admins.');
                modalData.order.status = oldStatus;
                return;
              }
            }
            modalData.order.totalAmount = (modalData.order.saleAmount || 0) + (modalData.order.deliveryCharge || 0);
            modalData.order.updatedAt = getBstIsoString();
            modalData.order.updatedBy = currentUser.value?.username || 'user';
            orders.value[idx] = { ...modalData.order };
            queueChange('orders', orders.value[idx]);
            saveOrdersLocally();
          }
          closeModal();
        };

        // --- VOID AND TRASH ---
        const confirmVoidOrder = (order) => {
          if (currentUser.value?.role === 'seller' && order.merchantName !== currentUser.value?.name && order.merchantId !== currentUser.value?.id) {
            alert("⚠️ Security restriction: You cannot void orders assigned to other merchants.");
            return;
          }
          modalData.title = 'Confirm Void Order';
          modalData.order = order;
          activeModal.value = 'confirmVoid';
        };

        const executeVoidOrder = () => {
          const orderToVoid = orders.value.find(o => o.id === modalData.order.id);
          if (orderToVoid) {
            orderToVoid.deletedAt = getBstIsoString();
            orderToVoid.updatedAt = getBstIsoString();
            orderToVoid.updatedBy = currentUser.value?.username || 'user';
            deletedOrders.value.unshift(orderToVoid);
            orders.value = orders.value.filter(o => o.id !== modalData.order.id);
            queueChange('deletedOrders', orderToVoid);
            queueDelete('orders', modalData.order.id);
            saveOrdersLocally();
            saveDeletedOrdersLocally();
            selectedOrders.value.delete(modalData.order.id);
          }
          closeModal();
        };

        const restoreOrder = (order) => {
          if (currentUser.value?.role === 'seller' && order.merchantName !== currentUser.value?.name && order.merchantId !== currentUser.value?.id) {
            alert("⚠️ Security restriction: You cannot restore orders assigned to other merchants.");
            return;
          }
          deletedOrders.value = deletedOrders.value.filter(o => o.id !== order.id);
          delete order.deletedAt;
          order.updatedAt = getBstIsoString();
          order.updatedBy = currentUser.value?.username || 'user';
          orders.value.push(order);
          queueChange('orders', order);
          queueDelete('deletedOrders', order.id);
          saveOrdersLocally();
          saveDeletedOrdersLocally();
        };

        const emptyTrash = () => {
          openGlobalConfirm('Are you sure you want to permanently delete all items in the trash? This action cannot be undone.', 'Empty Trash', 'bg-rose-600 hover:bg-rose-500 text-white', () => {
            const permanentlyDeletedIds = deletedOrders.value.map(o => o.id);
            deletedOrders.value = [];
            permanentlyDeletedIds.forEach(id => queueDelete('deletedOrders', id));
            saveDeletedOrdersLocally();
            
            let billsChanged = false;
            factoryBills.value.forEach(bill => {
              if (bill.linkedOrderIds) {
                const originalLength = bill.linkedOrderIds.length;
                bill.linkedOrderIds = bill.linkedOrderIds.filter(id => !permanentlyDeletedIds.includes(id));
                if (bill.linkedOrderIds.length !== originalLength) {
                  billsChanged = true;
                  queueChange('factoryBills', bill);
                }
              }
            });
            if (billsChanged) saveFactoryBillsLocally();
            closeModal();
          });
        };

        // --- BULK SELECTION ACTIONS ---
        const toggleOrderSelection = (id) => {
          if (selectedOrders.value.has(id)) {
            selectedOrders.value.delete(id);
          } else {
            selectedOrders.value.add(id);
          }
        };

        const toggleAllSelection = (filteredArray) => {
          if (selectedOrders.value.size === filteredArray.length) {
            selectedOrders.value.clear();
          } else {
            filteredArray.forEach(o => selectedOrders.value.add(o.id));
          }
        };

        const bulkDispatchSelected = () => {
          if (selectedOrders.value.size === 0) return;
          if (currentUser.value?.role === 'seller') {
            const toDispatchIds = Array.from(selectedOrders.value);
            const hasOthers = orders.value.some(o => toDispatchIds.includes(o.id) && o.merchantName !== currentUser.value?.name && o.merchantId !== currentUser.value?.id);
            if (hasOthers) {
              alert("⚠️ Security restriction: You cannot modify orders assigned to other merchants.");
              return;
            }
          }
          openGlobalConfirm(`Are you sure you want to mark ${selectedOrders.value.size} selected order(s) as Dispatched?`, 'Dispatch Selected', 'bg-emerald-600 hover:bg-emerald-500 text-white', () => {
            const toDispatchIds = Array.from(selectedOrders.value);
            orders.value.forEach(o => {
              if (toDispatchIds.includes(o.id)) {
                o.status = 'Dispatched';
                o.updatedAt = getBstIsoString();
                o.updatedBy = currentUser.value?.username || 'user';
                queueChange('orders', o);
              }
            });
            saveOrdersLocally();
            selectedOrders.value.clear();
            closeModal();
          });
        };

        const bulkDeleteSelected = () => {
          if (selectedOrders.value.size === 0) return;
          if (currentUser.value?.role === 'seller') {
            const toDeleteIds = Array.from(selectedOrders.value);
            const hasOthers = orders.value.some(o => toDeleteIds.includes(o.id) && o.merchantName !== currentUser.value?.name && o.merchantId !== currentUser.value?.id);
            if (hasOthers) {
              alert("⚠️ Security restriction: You cannot void orders assigned to other merchants.");
              return;
            }
          }
          if (!confirm(`Are you sure you want to void ${selectedOrders.value.size} selected order(s)?`)) return;

          const toDeleteIds = Array.from(selectedOrders.value);
          const ordersToMove = orders.value.filter(o => toDeleteIds.includes(o.id));
          
          const now = getBstIsoString();
          ordersToMove.forEach(o => {
            o.deletedAt = now;
            o.updatedAt = getBstIsoString();
            o.updatedBy = currentUser.value?.username || 'user';
            deletedOrders.value.unshift(o);
            queueChange('deletedOrders', o);
            queueDelete('orders', o.id);
          });
          
          orders.value = orders.value.filter(o => !toDeleteIds.includes(o.id));
          saveOrdersLocally();
          saveDeletedOrdersLocally();
          selectedOrders.value.clear();
        };

        // --- SETTINGS AND DIAGNOSTICS ---
        const saveAppsScriptUrl = () => {
          localStorage.setItem('homeaura_apps_script_url', appsScriptUrl.value);
          alert('Google Apps Script URL saved! Automatic background synchronization is active.');
          triggerAutoSync(true);
        };

                const updateBackupFrequency = async () => {
          if (!appsScriptUrl.value) {
            alert('Please configure the Apps Script URL first.');
            return;
          }
          try {
            const url = appsScriptUrl.value.trim();
            localStorage.setItem('homeaura_backup_frequency', backupFrequency.value);
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({ action: 'setup_backup', hours: parseInt(backupFrequency.value) })
            });
            const data = await res.json();
            if (data && data.status === 'success') {
              alert(data.message || 'Backup schedule updated successfully!');
            } else {
              throw new Error(data.error || 'Unknown error');
            }
          } catch(err) {
            alert('Failed to update backup schedule: ' + err.message);
          }
        };

        const instantBackupToDrive = async () => {
          if (!appsScriptUrl.value) {
            alert("Please configure the Apps Script URL first.");
            return;
          }
          try {
            const url = appsScriptUrl.value.trim();
            isBackingUp.value = true;
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "text/plain;charset=utf-8" },
              body: JSON.stringify({ action: "manual_backup" })
            });
            const text = await res.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch (e) {
              throw new Error("Server returned invalid JSON. Did you re-deploy as a NEW Web App and grant Drive permissions?");
            }
            if (data && data.status === "success") {
              if (data.mode === "full") {
                 alert("⚠️ Backup ignored! You are using an OLD version of the Apps Script.\n\nPlease click \"Copy Apps Script Code (V4)\", paste it in the Apps Script editor, and create a NEW deployment.");
              } else {
                 alert(data.message || "✅ Manual backup completed successfully!");
              }
            } else {
              throw new Error(data.error || "Unknown error");
            }
          } catch(err) {
            let msg = err.message;
            if (msg.includes("permission") || msg.includes("DriveApp") || msg.includes("invalid JSON")) {
                msg += "\n\n💡 FIX: Open your Google Sheet > Extensions > Apps Script. Select \"backupSpreadsheet\" from the top toolbar and click \"Run\" to trigger the Google Drive permission prompt. After granting access, click Deploy > New Deployment!";
            }
            alert("❌ Backup Failed:\n" + msg);
          } finally {
            isBackingUp.value = false;
          }
        };

        const saveAdminWaGroupLink = async () => {
          const linkToSave = (adminWaGroupLink.value || '').trim() || DEFAULT_WA_GROUP_LINK;
          adminWaGroupLink.value = linkToSave;
          localStorage.setItem('homeaura_admin_wa', linkToSave);
          queueChange('settings', { id: 'adminWaGroupLink', value: linkToSave });
          alert('✅ WhatsApp Group Link saved & queued for sync!\n\nPushing to Google Sheets so all sellers sync this link automatically.');
          await pushToGoogleSheets(false);
        };

        const testSyncConnection = async () => {
          if (!appsScriptUrl.value) {
            syncStatusMsg.value = 'No URL provided!';
            syncStatusColor.value = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800';
            return;
          }
          isTestingSync.value = true;
          syncStatusMsg.value = 'Testing network connection to Google Apps Script...';
          syncStatusColor.value = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800';
          try {
            const url = (appsScriptUrl.value || '').trim();
            if (!url || !url.startsWith('http')) {
              throw new Error('Invalid URL format. Must begin with https://');
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);

            const testPayload = { _connectionTest: [{ timestamp: getBstIsoString(), message: "HomeAura multi-user sync engine is online!" }] };
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(testPayload),
              signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) {
              throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            if (data && data.status === 'success') {
              syncStatusMsg.value = '✅ Google Apps Script V4 connection verified successfully! Ready for multi-user sync.';
              syncStatusColor.value = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
            } else {
              throw new Error(data?.error || 'Unknown script response');
            }
          } catch (err) {
            console.warn('Sync connection test warning:', err.message);
            syncStatusMsg.value = '⚠️ Connection note: ' + (err.name === 'AbortError' ? 'Connection timed out. Check Apps Script URL & access settings.' : err.message);
            syncStatusColor.value = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800';
          } finally {
            isTestingSync.value = false;
          }
        };

        // --- APPS SCRIPT V4 MODAL & COPY ---
        const openAppsScriptModal = () => {
          activeModal.value = 'appsScriptModal';
        };

        const copyAppsScriptV4Code = async () => {
          const code = `// ==============================================================================
// HOMEAURA MULTI-USER OPTIMAL SYNC SCRIPT (VERSION 4.0)
// High-Performance Bidirectional Delta Sync with Last-Write-Wins (LWW)
// ==============================================================================

function doGet(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'busy', error: 'Server lock timeout' })).setMimeType(ContentService.MimeType.JSON);
  }
  try {
    var rawCategories = sheetToObjects("categories");
    var categories = rawCategories.map(function(c) {
      return typeof c === 'object' && c !== null ? (c.name || Object.values(c).join('')) : String(c);
    });
    var data = {
      status: 'success',
      serverTimestamp: new Date().toISOString(),
      users: sheetToObjects("users"),
      orders: sheetToObjects("orders"),
      deletedOrders: sheetToObjects("deletedOrders"),
      categories: categories,
      factories: sheetToObjects("factories"),
      factoryBills: sheetToObjects("factoryBills"),
      expenses: sheetToObjects("expenses"),
      settings: sheetToObjects("settings")
    };
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch(e) {}
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'busy', error: 'Database lock timeout' })).setMimeType(ContentService.MimeType.JSON);
  }
  try {
    var payloadObj;
    try { payloadObj = JSON.parse(e.postData.contents); } catch(err) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: 'Invalid JSON' })).setMimeType(ContentService.MimeType.JSON);
    }
    if (payloadObj._connectionTest) {
      objectsToSheetAtomic("connectionTest", payloadObj._connectionTest);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', serverTimestamp: new Date().toISOString() })).setMimeType(ContentService.MimeType.JSON);
    }
    if (payloadObj.action === 'upload_image' && payloadObj.base64) {
      return ContentService.createTextOutput(JSON.stringify(handleDriveImageUpload(payloadObj.filename || 'attachment.jpg', payloadObj.base64))).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (payloadObj.action === 'setup_backup') {
      try {
        setupBackupTrigger(payloadObj.hours);
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Backup frequency set to ' + payloadObj.hours + ' hour(s).' })).setMimeType(ContentService.MimeType.JSON);
      } catch(err) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    if (payloadObj.action === 'manual_backup') {
      try {
        backupSpreadsheet();
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Manual backup completed successfully!' })).setMimeType(ContentService.MimeType.JSON);
      } catch(err) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    var stats = { updatedRecords: 0, deletedRecords: 0 };
    if (payloadObj.action === 'sync_delta' || payloadObj.delta === true) {
      var changes = payloadObj.changes || {};
      var deletes = payloadObj.deletes || {};
      if (changes.users && changes.users.length) stats.updatedRecords += mergeObjectsByIdLWW("users", changes.users);
      if (changes.orders && changes.orders.length) stats.updatedRecords += mergeObjectsByIdLWW("orders", changes.orders);
      if (changes.deletedOrders && changes.deletedOrders.length) stats.updatedRecords += mergeObjectsByIdLWW("deletedOrders", changes.deletedOrders);
      if (changes.factories && changes.factories.length) stats.updatedRecords += mergeObjectsByIdLWW("factories", changes.factories);
      if (changes.factoryBills && changes.factoryBills.length) stats.updatedRecords += mergeObjectsByIdLWW("factoryBills", changes.factoryBills);
      if (changes.expenses && changes.expenses.length) stats.updatedRecords += mergeObjectsByIdLWW("expenses", changes.expenses);
      if (changes.settings && changes.settings.length) stats.updatedRecords += mergeObjectsByIdLWW("settings", changes.settings);
      if (changes.categories && Array.isArray(changes.categories)) {
        var catObjs = changes.categories.map(function(c) { return { name: typeof c === 'object' && c !== null ? (c.name || Object.values(c).join('')) : String(c) }; });
        objectsToSheetAtomic("categories", catObjs);
        stats.updatedRecords += catObjs.length;
      }
      Object.keys(deletes).forEach(function(sheetName) {
        var idsToDelete = deletes[sheetName];
        if (idsToDelete && idsToDelete.length > 0) stats.deletedRecords += deleteObjectsById(sheetName, idsToDelete);
      });
      logHistory(payloadObj, stats);
      try { distributeOrdersBySeller(); } catch(e) {}
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', mode: 'delta', stats: stats, serverTimestamp: new Date().toISOString() })).setMimeType(ContentService.MimeType.JSON);
    }
    if (payloadObj.users) stats.updatedRecords += mergeObjectsByIdLWW("users", payloadObj.users);
    if (payloadObj.orders) stats.updatedRecords += mergeObjectsByIdLWW("orders", payloadObj.orders);
    if (payloadObj.deletedOrders) stats.updatedRecords += mergeObjectsByIdLWW("deletedOrders", payloadObj.deletedOrders);
    if (payloadObj.factories) stats.updatedRecords += mergeObjectsByIdLWW("factories", payloadObj.factories);
    if (payloadObj.factoryBills) stats.updatedRecords += mergeObjectsByIdLWW("factoryBills", payloadObj.factoryBills);
    if (payloadObj.expenses) stats.updatedRecords += mergeObjectsByIdLWW("expenses", payloadObj.expenses);
    if (payloadObj.settings) stats.updatedRecords += mergeObjectsByIdLWW("settings", payloadObj.settings);
    if (payloadObj.categories && Array.isArray(payloadObj.categories)) {
      var catObjs2 = payloadObj.categories.map(function(c) { return { name: typeof c === 'object' && c !== null ? (c.name || Object.values(c).join('')) : String(c) }; });
      objectsToSheetAtomic("categories", catObjs2);
    }
    logHistory(payloadObj, stats);
    try { distributeOrdersBySeller(); } catch(e) {}
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', mode: 'full', stats: stats, serverTimestamp: new Date().toISOString() })).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch(e) {}
  }
}

function mergeObjectsByIdLWW(sheetName, incomingObjects) {
  if (!incomingObjects || incomingObjects.length === 0) return 0;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  var existingObjects = sheetToObjects(sheetName);
  var map = {}, order = [];
  existingObjects.forEach(function(obj) {
    if (obj && obj.id !== undefined && obj.id !== '') {
      var key = String(obj.id);
      map[key] = obj;
      order.push(key);
    }
  });
  var updatedCount = 0;
  incomingObjects.forEach(function(incObj) {
    if (!incObj || incObj.id === undefined || incObj.id === '') return;
    var key = String(incObj.id);
    var existing = map[key];
    if (!existing) {
      map[key] = incObj;
      order.push(key);
      updatedCount++;
    } else {
      var incTime = incObj.updatedAt ? new Date(incObj.updatedAt).getTime() : 0;
      var extTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
      if (incTime >= extTime || !extTime) {
        map[key] = Object.assign({}, existing, incObj);
        updatedCount++;
      }
    }
  });
  var merged = order.map(function(key) { return map[key]; });
  objectsToSheetAtomic(sheetName, merged);
  return updatedCount;
}

function deleteObjectsById(sheetName, idsToDelete) {
  if (!idsToDelete || idsToDelete.length === 0) return 0;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return 0;
  var existingObjects = sheetToObjects(sheetName);
  var idMap = {};
  idsToDelete.forEach(function(id) { idMap[String(id)] = true; });
  var keptObjects = [], deleteCount = 0;
  existingObjects.forEach(function(obj) {
    if (obj && obj.id !== undefined && idMap[String(obj.id)]) { deleteCount++; } else { keptObjects.push(obj); }
  });
  if (deleteCount > 0) objectsToSheetAtomic(sheetName, keptObjects);
  return deleteCount;
}

function sheetToObjects(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  var headers = data[0], result = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var isEmpty = row.every(function(cell) { return cell === '' || cell === null; });
    if (isEmpty) continue;
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var header = String(headers[j]).trim();
      if (header) {
        var cellVal = row[j];
        if (typeof cellVal === 'string' && (cellVal.startsWith('[') || cellVal.startsWith('{'))) {
          try { cellVal = JSON.parse(cellVal); } catch(e) {}
        }
        obj[header] = cellVal;
      }
    }
    result.push(obj);
  }
  return result;
}

function objectsToSheetAtomic(sheetName, objects) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  if (!objects || objects.length === 0) { sheet.clearContents(); return; }
  var headersMap = {};
  objects.forEach(function(obj) {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(function(key) { headersMap[key] = true; });
    }
  });
  var headers = Object.keys(headersMap);
  if (headers.length === 0) return;
  var rows = [headers];
  objects.forEach(function(obj) {
    var row = [];
    headers.forEach(function(header) {
      var val = obj ? obj[header] : '';
      if (val === undefined || val === null) val = '';
      else if (typeof val === 'object') val = JSON.stringify(val);
      row.push(val);
    });
    rows.push(row);
  });
  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
}

function handleDriveImageUpload(filename, base64Data) {
  try {
    var cleanBase64 = base64Data;
    var contentType = "image/jpeg";
    if (cleanBase64.indexOf(",") > -1) {
      var parts = cleanBase64.split(",");
      var mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) contentType = mimeMatch[1];
      cleanBase64 = parts[1];
    }
    var decodedBlob = Utilities.newBlob(Utilities.base64Decode(cleanBase64), contentType, filename);
    var folderName = "HomeAura_Order_Attachments";
    var folders = DriveApp.getFoldersByName(folderName);
    var targetFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    var file = targetFolder.createFile(decodedBlob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return { status: 'success', url: "https://drive.google.com/uc?export=view&id=" + file.getId(), fileId: file.getId(), filename: filename };
  } catch(err) {
    return { status: 'error', error: err.toString() };
  }
}

function logHistory(payload, stats) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var historySheet = ss.getSheetByName("History_Log");
    if (!historySheet) {
      historySheet = ss.insertSheet("History_Log");
      historySheet.appendRow(["Timestamp", "Action/Mode", "Updated", "Deleted", "Sender"]);
    }
    historySheet.appendRow([
      new Date().toISOString(),
      payload.delta ? "delta" : (payload.action || "full"),
      (stats && stats.updatedRecords) || 0,
      (stats && stats.deletedRecords) || 0,
      payload.sender || "app_client"
    ]);
    if (historySheet.getLastRow() > 1000) historySheet.deleteRows(2, 200);
  } catch(e) {}
}

function distributeOrdersBySeller() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var orders = sheetToObjects("orders");
  var users = sheetToObjects("users");
  
  var idToUsername = {};
  var validSellerUsernames = {};
  
  users.forEach(function(u) {
    if (u && u.id && u?.username) {
      idToUsername[u.id] = u?.username;
      // Only allocate individual sheets for sellers and moderators
      if (u.role === 'seller' || u.role === 'moderator') {
        validSellerUsernames[u?.username] = true;
      }
    }
  });
  
  if (Object.keys(validSellerUsernames).length === 0) return;
  
  var sellerOrders = {};
  Object.keys(validSellerUsernames).forEach(function(username) {
    sellerOrders[username] = [];
  });
  
  orders.forEach(function(o) {
    if (o && o.merchantId) {
      var username = idToUsername[o.merchantId];
      if (username && validSellerUsernames[username]) {
        sellerOrders[username].push(o);
      }
    }
  });
  
  Object.keys(sellerOrders).forEach(function(username) {
    var sheetName = "Orders_" + username;
    var userOrders = sellerOrders[username];
    objectsToSheetAtomic(sheetName, userOrders);
  });
  
  // Cleanup orphaned/stale sheets (e.g., if a username changes or role changes)
  var allSheets = ss.getSheets();
  allSheets.forEach(function(sheet) {
    var sName = sheet.getName();
    if (sName.indexOf("Orders_") === 0) {
      var sUser = sName.substring(7);
      if (!validSellerUsernames[sUser]) {
        ss.deleteSheet(sheet);
      }
    }
  });
}

function setupBackupTrigger(hours) {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'backupSpreadsheet') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  if (hours > 0) {
    ScriptApp.newTrigger('backupSpreadsheet')
             .timeBased()
             .everyHours(hours)
             .create();
  }
}

function backupSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var formattedDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  var name = ss.getName() + " Backup " + formattedDate;
  var destFolder = DriveApp.getFoldersByName("HomeAura_Backups");
  var folder;
  if (destFolder.hasNext()) {
    folder = destFolder.next();
  } else {
    folder = DriveApp.createFolder("HomeAura_Backups");
  }
  DriveApp.getFileById(ss.getId()).makeCopy(name, folder);
}
`;
          try {
            await navigator.clipboard.writeText(code);
            alert('✅ Google Apps Script V4 code copied to clipboard!\n\nOpen your Google Sheet > Extensions > Apps Script, paste the code, click Deploy > New Deployment (Web App, Who has access: Anyone), and copy the resulting Web App URL.');
          } catch(e) {
            alert('Please select and copy the code manually from the window.');
          }
        };

        // --- SNAPSHOT BACKUP IMPORT / EXPORT ---
        const exportSnapshot = () => {
          const password = prompt('Enter a password to encrypt this backup file (leave blank for no encryption):');
          const snapshot = {
            users: users.value,
            orders: orders.value,
            deletedOrders: deletedOrders.value,
            categories: categories.value,
            factories: factories.value,
            factoryBills: factoryBills.value,
            expenses: expenses.value,
            timestamp: getBstIsoString()
          };
          let dataToExport = JSON.stringify(snapshot, null, 2);
          let fileExt = 'json';
          let mimeType = 'application/json';
          
          if (password) {
            dataToExport = CryptoJS.AES.encrypt(dataToExport, password).toString();
            fileExt = 'enc';
            mimeType = 'text/plain';
          }

          const blob = new Blob([dataToExport], { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `homeaura_snapshot_${getBangladeshDateString(new Date())}.${fileExt}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        };
        
        const importSnapshot = (event) => {
          const file = event.target.files[0];
          if (!file) return;
          
          if (!confirm('Warning: Restoring from a snapshot will completely overwrite the current system data. Proceed?')) {
            event.target.value = '';
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              let fileContent = e.target.result;
              let snapshot;
              
              if (file.name.endsWith('.enc')) {
                const password = prompt('This backup is encrypted. Please enter the password to decrypt:');
                if (!password) {
                  alert('Password is required to decrypt this file.');
                  event.target.value = '';
                  return;
                }
                const bytes = CryptoJS.AES.decrypt(fileContent, password);
                const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                if (!decryptedData) {
                  throw new Error('Incorrect password or corrupted file.');
                }
                snapshot = JSON.parse(decryptedData);
              } else {
                snapshot = JSON.parse(fileContent);
              }

              if (snapshot.users && snapshot.orders) {
                users.value = snapshot.users;
                orders.value = snapshot.orders;
                deletedOrders.value = snapshot.deletedOrders || [];
                categories.value = snapshot.categories || [];
                factories.value = snapshot.factories || [];
                factoryBills.value = snapshot.factoryBills || [];
                expenses.value = snapshot.expenses || [];
                
                saveUsersLocally();
                saveOrdersLocally();
                saveDeletedOrdersLocally();
                saveCategoriesLocally();
                saveFactoriesLocally();
                saveFactoryBillsLocally();
                saveExpensesLocally();
                
                pushToGoogleSheets(true);
                
                alert('Snapshot restored successfully! The application will now reload to apply changes.');
                window.location.reload();
                event.target.value = '';
              } else {
                alert('Invalid snapshot file format.');
              }
            } catch (err) {
              alert('Error parsing snapshot file.');
            }
          };
          reader.readAsText(file);
        };

        // --- USER PROFILE MANAGEMENT ---
        const openAddUserModal = () => {
          modalData.title = 'Register New User Profile';
          modalData.user = reactive({ name: '', username: '', password: '1234', role: 'seller', active: true, target: 300000, visibleSellers: [] });
          activeModal.value = 'userModal';
        };

        const openEditUserModal = (user) => {
          modalData.title = `Edit Profile: @${user?.username}`;
          modalData.user = reactive({ ...user, visibleSellers: user.visibleSellers || [] });
          activeModal.value = 'userModal';
        };

        const saveUserModal = () => {
          const idx = users.value.findIndex(u => u && u?.username === modalData.user?.username);
          let userToSave;
          if (idx !== -1) {
            users.value[idx] = { ...modalData.user };
            userToSave = users.value[idx];
          } else {
            modalData.user.id = 'u' + (users.value.length + 1);
            userToSave = { ...modalData.user };
            users.value.push(userToSave);
          }
          userToSave.updatedAt = getBstIsoString();
          userToSave.updatedBy = currentUser.value?.username || 'admin';
          queueChange('users', userToSave);
          saveUsersLocally();
          closeModal();
        };

        const toggleUserActive = (user) => {
          user.active = !user.active;
          user.updatedAt = getBstIsoString();
          user.updatedBy = currentUser.value?.username || 'admin';
          queueChange('users', user);
          saveUsersLocally();
        };

        const openGlobalConfirm = (message, confirmText, confirmClass, onConfirm) => {
          modalData.title = 'Confirmation Required';
          modalData.confirmMessage = message;
          modalData.confirmButtonText = confirmText || 'Confirm';
          modalData.confirmButtonClass = confirmClass || 'bg-rose-600 hover:bg-rose-500 text-white';
          modalData.onConfirm = onConfirm;
          activeModal.value = 'globalConfirm';
        };

        const closeModal = () => {
          activeModal.value = null;
          modalData.order = null;
          modalData.user = null;
          modalData.factory = null;
          modalData.bill = null;
          modalData.expense = null;
        };

        // --- DASHBOARD CHARTS ---
        let chartInstance = null;
        let pieChartInstance = null;

        const renderChart = () => {
          const canvas = document.getElementById('revenueChartCanvas');
          if (!canvas) return;
          if (chartInstance) chartInstance.destroy();
          
          const daysMap = {};
          const currentMonthStr = getBangladeshDateString(new Date()).slice(0, 7);
          const monthName = getBangladeshDate(new Date()).toLocaleString('default', { month: 'short' });
          
          orders.value.forEach(o => {
            if (o.timestamp && String(o.timestamp).startsWith(currentMonthStr)) {
              const day = String(o.timestamp).slice(8, 10);
              daysMap[day] = (daysMap[day] || 0) + (Number(o.totalAmount) || 0);
            }
          });
          
          const labels = Object.keys(daysMap).sort();
          const data = labels.map(day => daysMap[day]);
          const isDark = document.body.classList.contains('dark');
          const gridColor = isDark ? '#334155' : '#e2e8f0';
          const textColor = isDark ? '#94a3b8' : '#64748b';
          
          chartInstance = new Chart(canvas, {
            type: 'line',
            data: {
              labels: labels.map(l => l + ' ' + monthName),
              datasets: [{
                label: 'Revenue (BDT)',
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6366f1',
                pointBorderWidth: 2,
                pointRadius: 4,
                fill: true,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: gridColor, drawBorder: false },
                  ticks: { color: textColor, callback: val => '৳' + val.toLocaleString() }
                },
                x: {
                  grid: { display: false },
                  ticks: { color: textColor }
                }
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  titleColor: isDark ? '#f8fafc' : '#0f172a',
                  bodyColor: isDark ? '#cbd5e1' : '#475569',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  borderWidth: 1,
                  callbacks: {
                    label: (context) => '৳' + context.raw.toLocaleString()
                  }
                }
              }
            }
          });
        };

        const renderPieChart = () => {
          const canvas = document.getElementById('statusPieChartCanvas');
          if (!canvas) return;
          if (pieChartInstance) pieChartInstance.destroy();

          const statusCounts = {};
          orders.value.forEach(o => {
            statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
          });

          const sortedStatuses = Object.keys(statusCounts).sort((a, b) => statusCounts[b] - statusCounts[a]);
          const data = sortedStatuses.map(status => statusCounts[status]);
          const isDark = document.body.classList.contains('dark');
          const textColor = isDark ? '#94a3b8' : '#64748b';

          const backgroundColors = sortedStatuses.map(status => {
            if (status === 'Delivered') return isDark ? '#059669' : '#10b981';
            if (status === 'Confirmation Call') return isDark ? '#4338ca' : '#6366f1';
            if (status === 'Courier Booking') return isDark ? '#2563eb' : '#3b82f6';
            if (status === 'Factory Submit') return isDark ? '#d97706' : '#f59e0b';
            if (status === 'Courier Pending') return isDark ? '#0891b2' : '#06b6d4';
            if (status === 'Partial Delivered') return isDark ? '#0d9488' : '#14b8a6';
            if (status === 'Returned Received') return isDark ? '#e11d48' : '#f43f5e';
            if (status === 'Returned from Customer') return isDark ? '#be123c' : '#e11d48';
            return isDark ? '#475569' : '#94a3b8';
          });

          pieChartInstance = new Chart(canvas, {
            type: 'doughnut',
            data: {
              labels: sortedStatuses,
              datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: isDark ? 2 : 1,
                borderColor: isDark ? '#0f172a' : '#ffffff',
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '65%',
              animation: {
                animateScale: true,
                animateRotate: true,
                duration: 800,
                easing: 'easeOutQuart'
              },
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    color: textColor,
                    usePointStyle: true,
                    padding: 12,
                    font: { size: 11 }
                  }
                },
                tooltip: {
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  titleColor: isDark ? '#f8fafc' : '#0f172a',
                  bodyColor: isDark ? '#cbd5e1' : '#475569',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  borderWidth: 1,
                  callbacks: {
                    label: (context) => {
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const value = context.raw;
                      const percentage = Math.round((value / total) * 100);
                      return ` ${context.label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }
          });
        };

        
        // Browser Notifications for new tasks
        watch(tasks, (newTasks, oldTasks) => {
          if (!currentUser.value) return;
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            const oldIds = new Set((oldTasks || []).map(t => t.id));
            const newAssignedTasks = newTasks.filter(t => !oldIds.has(t.id) && t.status === 'pending' && (t.assigneeId === currentUser.value.id || t.assigneeRole === currentUser.value.role || t.assigneeRole === 'all'));
            
            newAssignedTasks.forEach(task => {
              new Notification('HomeAura Task Assigned', {
                body: task.title + '\n' + task.description,
                icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png'
              });
            });
          }
        }, { deep: true });

        const requestNotificationPermission = () => {
          if (typeof Notification !== 'undefined' && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
          }
        };
        onMounted(() => {
          requestNotificationPermission();
        });

        // Watchers for Charts
        watch([activeTab, isSidebarCollapsed], () => {
          if (activeTab.value === 'dashboard') {
            setTimeout(() => { // ensure DOM layout is updated
              renderChart();
              renderPieChart();
            }, 50);
          }
        });
        
        watch(isDarkMode, () => {
          if (activeTab.value === 'dashboard') {
            Vue.nextTick(() => {
              renderChart();
              renderPieChart();
            });
          }
        });

        // --- LIFECYCLE & POLLING ENGINE ---
        onMounted(() => {
          applyDarkMode();
          loadInitialData();
          
          // Initial non-destructive background pull
          syncFromGoogleSheets();

          if (activeTab.value === 'dashboard') {
            Vue.nextTick(() => {
              renderChart();
              renderPieChart();
            });
          }

          // Dynamic polling (12s when visible, 60s when hidden)
          let pollInterval = setInterval(() => {
            if (appsScriptUrl.value && !document.hidden && navigator.onLine) {
              syncFromGoogleSheets();
            }
          }, 12000);

          // Visibility change listener
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
              syncFromGoogleSheets();
            }
          });

          // Window Focus listener
          window.addEventListener('focus', () => {
            if (navigator.onLine) {
              syncFromGoogleSheets();
            }
          });

          // Online / Offline handlers
          window.addEventListener('online', () => {
            syncStatus.value = 'synced';
            syncNotice.value = '🌐 Connection restored! Syncing data...';
            setTimeout(() => { syncNotice.value = ''; }, 3000);
            triggerAutoSync(true);
            syncFromGoogleSheets();
          });

          window.addEventListener('offline', () => {
            syncStatus.value = 'offline';
          });

          // Paste handler for screenshots
          window.addEventListener('paste', (e) => {
            if (!selectedProofTile.value) return;

            const activeElem = document.activeElement;
            const tag = activeElem ? activeElem.tagName.toLowerCase() : '';
            const isTextInput = tag === 'textarea' || (tag === 'input' && activeElem.type === 'text');

            if (isTextInput) {
              const items = e.clipboardData && e.clipboardData.items;
              let hasImage = false;
              if (items) {
                for (let i = 0; i < items.length; i++) {
                  if (items[i].type.indexOf('image') !== -1) {
                    hasImage = true;
                    break;
                  }
                }
              }
              if (!hasImage) return;
            }

            if (selectedCollageTile.value === 'modal') {
              if (modalData.order) handleCollagePaste(e, modalData.order);
            } else if (selectedCollageTile.value === 'terminal') {
              handleCollagePaste(e, intakeForm);
            } else if (selectedProofTile.value === 'terminal') {
              handleProofPaste(e, intakeForm);
            } else if (selectedProofTile.value === 'modal') {
              if (modalData.order) handleProofPaste(e, modalData.order);
              if (modalData.bill) handleProofPaste(e, modalData.bill);
            }
          });
        });

        const saveMarketingSpendsLocally = () => {
          localStorage.setItem('homeaura_marketing_spends', JSON.stringify(marketingSpends.value));
        };
        const filteredMarketingSpends = computed(() => {
          let list = marketingSpends.value.filter(s => s.date === marketingSpendFilterDate.value);
          if (currentUser.value && currentUser.value.role === 'marketer' && currentUser.value.visibleSellers && currentUser.value.visibleSellers.length > 0) {
            list = list.filter(s => currentUser.value.visibleSellers.includes(s.sellerId));
          }
          return list;
        });

        const openMarketingSpendModal = (spend = null) => {
          if (spend) {
            modalData.marketingSpend = { ...spend };
          } else {
            modalData.marketingSpend = {
              date: marketingSpendFilterDate.value,
              sellerId: '',
              amount: 0,
              history: []
            };
          }
          activeModal.value = 'marketingSpendModal';
        };

        const openMarketingSpendHistory = (spend) => {
          modalData.marketingSpend = { ...spend };
          activeModal.value = 'marketingSpendHistoryModal';
        };

        const saveMarketingSpend = () => {
          const spend = modalData.marketingSpend;
          if (!spend.date || !spend.sellerId) return;
          const ts = Date.now();
          const recordHistory = {
            timestamp: ts,
            amount: spend.amount,
            updatedBy: currentUser.value ? currentUser.value?.username : 'system'
          };
          if (spend.id) {
            const idx = marketingSpends.value.findIndex(s => s.id === spend.id);
            if (idx !== -1) {
              const target = marketingSpends.value[idx];
              target.amount = spend.amount;
              target.updatedBy = recordHistory.updatedBy;
              target.history = target.history || [];
              target.history.unshift(recordHistory);
            }
          } else {
            const existing = marketingSpends.value.find(s => s.date === spend.date && s.sellerId === spend.sellerId);
            if (existing) {
              existing.amount = spend.amount;
              existing.updatedBy = recordHistory.updatedBy;
              existing.history = existing.history || [];
              existing.history.unshift(recordHistory);
            } else {
              spend.id = 'ms_' + ts + Math.random().toString(36).substr(2, 5);
              spend.updatedBy = recordHistory.updatedBy;
              spend.history = [recordHistory];
              marketingSpends.value.push(spend);
            }
          }
          saveMarketingSpendsLocally();
          closeModal();
        };

        const totalMarketingSpendToday = computed(() => {
          const today = new Date().toISOString().split('T')[0];
          return marketingSpends.value.filter(s => s.date === today).reduce((sum, s) => sum + s.amount, 0);
        });
        return {
          formatBangladeshDisplayTime,
          marketingSpends, marketingSpendFilterDate, filteredMarketingSpends,
          openMarketingSpendModal, openMarketingSpendHistory, saveMarketingSpend, totalMarketingSpendToday,
          getBillOrdersTotalSale,
          getOrdersByIds,
          factoryBills, isTasksPanelOpen, openTasksPanel, isUserOnline, newTask, createNewTask, markTaskDone, unreadNotificationsCount, tasks, notifications,
          openAddBillModal,
          openEditBillModal,
          saveBillModal,
          deleteBill,
          getFactoryName,
          pipelineStages,
          users,
          orders,
          categories,
          factories,
          sampleCollagePresets,
          rankedFactories,
          currentUser,
          isDarkMode,
          toggleDarkMode,
          openInspectModal,
          selectedProofTile,
          selectedCollageTile,
          selectCollageTile,
          handleCollagePaste,
          handleCollageDrop,
          selectProofTile,
          activeTab, isSidebarCollapsed,
          loginForm,
          loginError,
          lastSyncTimestamp,
          lastPullTimestamp,
          deletedOrders,
          selectedOrders,
          restoreOrder,
          emptyTrash,
          toggleOrderSelection,
          toggleAllSelection,
          bulkDeleteSelected,
          bulkDispatchSelected,
          updateBackupFrequency, instantBackupToDrive,
          backupFrequency,
          appsScriptUrl,
          isBackingUp,
          isPushing,
          isPulling,
          isTestingSync,
          syncStatus,
          syncNotice,
          syncStatusMsg,
          syncStatusColor,
          pendingSyncCount,
          syncQueue,
          triggerAutoSync,
          pushToGoogleSheets,
          syncFromGoogleSheets,
          testSyncConnection,
          saveAppsScriptUrl,
          saveAdminWaGroupLink,
          backupToGoogleSheets,
          openAppsScriptModal,
          copyAppsScriptV4Code,
          exportSnapshot,
          importSnapshot,
          orderSearch,
          statusFilter,
          merchantFilter,
          factoryFilter,
          sortOption,
          urgentOnly,
          newCategoryName,
          clipboardRawText,
          parseSuccessMsg,
          intakeForm,
          activeModal,
          modalData,
          metrics, globalSalesProgress,
          sellersList,
          merchantStats, steadfastReport, dashboardFilter,
          factoryBillStats,
          sellerBillStats,
          totalFactoryBillsAmount,
          totalOperationalExpenses,
          expenses,
          openAddExpenseModal,
          saveExpenseModal,
          deleteExpense,
          getExpenseCategoryClass,
          myOrders,
          myOrdersCount,
          myMonthlySales,
          myTargetPercentage,
          dispatchDeskOrders,
          filteredOrders,
          formatBDT,
          handleLogin,
          handleLogout,
          parseClipboard,
          submitNewOrder,
          quickStatusChange,
          toggleUrgent,
          handleCollageFileUpload,
          handleProofFileUpload,
          handleProofPaste,
          handleProofDrop,
          getAllowedStatusesForUser,
          advanceSellerStatus,
          getStatusStyle,
          addCategory,
          removeCategory,
          exportCSV,
          openEditOrderModal,
          saveEditedOrder,
          confirmVoidOrder,
          executeVoidOrder,
          openAddUserModal,
          openEditUserModal,
          saveUserModal,
          toggleUserActive,
          openAddFactoryModal,
          openEditFactoryModal,
          saveFactoryModal,
          openDispatchModal,
          getWhatsAppPayloadText,
          executeWhatsAppDispatch,
          openCourierModal,
          updateCourierStatus,
          trackingData,
          isLoadingTracking,
          openPhotoModal,
          closeModal,
          openGlobalConfirm,
          adminWaGroupLink,
          DEFAULT_WA_GROUP_LINK,
          orderSuccessData,
          copyOrderWhatsAppText,
          reCopySingleOrderPngToClipboard,
          testOpenWaGroup,
          openOrderWaGroup,
          copyOrderWaGroupLink,
          bulkDispatchData,
          bulkDispatchSuccessData,
          openBulkFactoryDispatchModal,
          executeBulkFactoryDispatch,
          copyBulkManifestText,
          reCopyBulkPngToClipboard,
          marketingSpends, marketingSpendFilterDate, filteredMarketingSpends,
          openMarketingSpendModal, openMarketingSpendHistory, saveMarketingSpend, totalMarketingSpendToday,
        };
      }
    }).mount('#app');
