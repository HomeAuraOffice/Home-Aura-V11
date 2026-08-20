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
        const defaultFactories = [
          { id: 'f1', name: 'Apex Crafting Hub', phone: '01711002233', waGroupLink: 'https://chat.whatsapp.com/sample-apex-hub', fabricQuality: 5, stockStatus: 'In Stock', baseWholesaleCost: 40000, notes: 'Premium velvet upholstery specialist with fast turnarounds.' },
          { id: 'f2', name: 'Royal Heritage Workshop', phone: '01819001122', waGroupLink: 'https://chat.whatsapp.com/sample-royal-heritage', fabricQuality: 4, stockStatus: 'In Stock', baseWholesaleCost: 38000, notes: 'Teak wood frames and linen couch sets.' },
          { id: 'f3', name: 'Standard Guild Factory', phone: '01912003344', waGroupLink: 'https://chat.whatsapp.com/sample-standard-guild', fabricQuality: 3, stockStatus: 'Low Stock', baseWholesaleCost: 32000, notes: 'Budget commercial grade furniture.' }
        ];

        const sampleCollagePresets = [
          { name: 'Royal Velvet Sofa', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80' },
          { name: 'Modern Leatherette', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80' },
          { name: 'Minimalist Dining', url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80' },
          { name: 'Chesterfield Armchair', url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80' }
        ];

        // --- SEEDING 9 REAL-WORLD BOOTSTRAP ORDERS ---
        const defaultOrders = [
          { id: 'ORD-1001', timestamp: '2026-08-01 10:15', merchantId: 'u2', merchantName: 'Tanvir Hossain', customerName: 'Far Ha Na', customerPhone: '01711223344', customerAddress: 'Apt 4B, Green Road, Dhanmondi, Dhaka', trafficSource: 'Messenger', designCode: 'RH-336', productCategory: 'L-Shape Sofa', seatConfig: 'L-Shape', fulfillmentMethod: 'Home Delivery', saleAmount: 65000, deliveryCharge: 2500, totalAmount: 67500, status: 'Delivered', urgent: false, notes: 'Navy blue velvet fabric.', cnNumber: '276331879', invoiceNumber: 'INV-1001', collagePhotoFileName: 'collage_attachments/seller1_CN-1001_INV-1001_2026-08-01.jpg', updatedAt: '2026-08-01T10:15:00.000Z' },
          { id: 'ORD-1002', timestamp: '2026-08-02 11:30', merchantId: 'u2', merchantName: 'Tanvir Hossain', customerName: 'Muslim Wddin Piyash', customerPhone: '01819876543', customerAddress: 'House 12, Road 4, Sector 7, Uttara, Dhaka', trafficSource: 'WhatsApp', designCode: 'RH-337', productCategory: 'Sofa Set', seatConfig: '3-Seater', fulfillmentMethod: 'Home Delivery', saleAmount: 48000, deliveryCharge: 2000, totalAmount: 50000, status: 'Courier Booking', urgent: true, notes: 'Requested delivery before weekend.', cnNumber: '278097551', invoiceNumber: 'INV-1002', collagePhotoFileName: 'collage_attachments/seller1_CN-1002_INV-1002_2026-08-02.jpg', updatedAt: '2026-08-02T11:30:00.000Z' },
          { id: 'ORD-1003', timestamp: '2026-08-03 14:20', merchantId: 'u3', merchantName: 'Ariful Ahmed', customerName: 'Rayhan Kabir', customerPhone: '01912345678', customerAddress: 'GEC Circle, Nasirabad, Chattogram', trafficSource: 'Direct Call', designCode: 'RH-338', productCategory: 'Recliner Chair', seatConfig: '1-Seater', fulfillmentMethod: 'Courier Service', saleAmount: 28000, deliveryCharge: 1500, totalAmount: 29500, status: 'Courier Pending', urgent: false, notes: 'Tagged via Sundarban Courier.', cnNumber: '279816167', invoiceNumber: 'INV-1003', collagePhotoFileName: 'collage_attachments/seller2_CN-1003_INV-1003_2026-08-03.jpg', updatedAt: '2026-08-03T14:20:00.000Z' },
          { id: 'ORD-1004', timestamp: '2026-08-04 09:45', merchantId: 'u4', merchantName: 'Farah Naz', customerName: 'Anisur Rahman', customerPhone: '01715556677', customerAddress: 'Zindabazar, Sylhet Sadar, Sylhet', trafficSource: 'Walk-in', designCode: 'RH-339', productCategory: 'Dining Table', seatConfig: 'Custom Set', fulfillmentMethod: 'Courier Service', saleAmount: 85000, deliveryCharge: 3500, totalAmount: 88500, status: 'Factory Submit', urgent: false, notes: '6-seater in Teak wood finish.', cnNumber: '279818987', invoiceNumber: 'INV-1004', collagePhotoFileName: 'collage_attachments/seller3_CN-1004_INV-1004_2026-08-04.jpg', updatedAt: '2026-08-04T09:45:00.000Z' },
          { id: 'ORD-1005', timestamp: '2026-08-05 16:10', merchantId: 'u2', merchantName: 'Tanvir Hossain', customerName: 'Tahmina Begum', customerPhone: '01611224455', customerAddress: 'Block C, Bashundhara R/A, Dhaka', trafficSource: 'Messenger', designCode: 'RH-340', productCategory: 'L-Shape Sofa', seatConfig: 'L-Shape', fulfillmentMethod: 'Home Delivery', saleAmount: 72000, deliveryCharge: 3000, totalAmount: 75000, status: 'Confirmation Call', urgent: true, notes: 'Verify color swatch.', cnNumber: '281926578', invoiceNumber: 'INV-1005', collagePhotoFileName: 'collage_attachments/seller1_CN-1005_INV-1005_2026-08-05.jpg', updatedAt: '2026-08-05T16:10:00.000Z' },
          { id: 'ORD-1006', timestamp: '2026-08-06 13:05', merchantId: 'u3', merchantName: 'Ariful Ahmed', customerName: 'Kazi Shakil', customerPhone: '01812334455', customerAddress: 'College Road, Mymensingh Sadar', trafficSource: 'WhatsApp', designCode: 'RH-342', productCategory: 'Sofa Set', seatConfig: '2-Seater', fulfillmentMethod: 'Courier Service', saleAmount: 36000, deliveryCharge: 1800, totalAmount: 37800, status: 'Delivered', urgent: false, notes: 'Full payment cleared.', cnNumber: '281927672', invoiceNumber: 'INV-1006', collagePhotoFileName: 'collage_attachments/seller2_CN-1006_INV-1006_2026-08-06.jpg', updatedAt: '2026-08-06T13:05:00.000Z' },
          { id: 'ORD-1007', timestamp: '2026-08-07 10:50', merchantId: 'u4', merchantName: 'Farah Naz', customerName: 'Nusrat Jahan', customerPhone: '01799887766', customerAddress: 'Chashara, Narayanganj', trafficSource: 'Messenger', designCode: 'RH-343', productCategory: 'Custom Bed', seatConfig: 'Custom Set', fulfillmentMethod: 'Home Delivery', saleAmount: 95000, deliveryCharge: 2500, totalAmount: 97500, status: 'Partial Delivered', urgent: false, notes: 'Frame delivered, mattress pending.', cnNumber: '282095540', invoiceNumber: 'INV-1007', collagePhotoFileName: 'collage_attachments/seller3_CN-1007_INV-1007_2026-08-07.jpg', updatedAt: '2026-08-07T10:50:00.000Z' },
          { id: 'ORD-1008', timestamp: '2026-08-08 15:30', merchantId: 'u2', merchantName: 'Tanvir Hossain', customerName: 'Mahfuzur Rahman', customerPhone: '01552345678', customerAddress: 'Main Road, Rajshahi Sadar', trafficSource: 'Direct Call', designCode: 'RH-345', productCategory: 'Recliner Chair', seatConfig: '1-Seater', fulfillmentMethod: 'Courier Service', saleAmount: 30000, deliveryCharge: 1500, totalAmount: 31500, status: 'Returned from Customer', urgent: true, notes: 'Color mismatch claim.', cnNumber: '282403020', invoiceNumber: 'INV-1008', collagePhotoFileName: 'collage_attachments/seller1_CN-1008_INV-1008_2026-08-08.jpg', updatedAt: '2026-08-08T15:30:00.000Z' },
          { id: 'ORD-1009', timestamp: '2026-08-09 11:15', merchantId: 'u3', merchantName: 'Ariful Ahmed', customerName: 'Sultana Razia', customerPhone: '01733445566', customerAddress: 'Shibbari More, Khulna', trafficSource: 'WhatsApp', designCode: 'RH-346', productCategory: 'Sofa Set', seatConfig: '3-Seater', fulfillmentMethod: 'Courier Service', saleAmount: 52000, deliveryCharge: 2200, totalAmount: 54200, status: 'Returned Received', urgent: false, notes: 'Returned to warehouse.', cnNumber: '282531127', invoiceNumber: 'INV-1009', collagePhotoFileName: 'collage_attachments/seller2_CN-1009_INV-1009_2026-08-09.jpg', updatedAt: '2026-08-09T11:15:00.000Z' }
        ];

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
        const currentUser = ref(null);
        const activeTab = ref('dashboard');

        // WhatsApp Submission Group Default Link
        const DEFAULT_WA_GROUP_LINK = 'https://chat.whatsapp.com/LStonFBgIe67wTqWx9f1dw';
        const LEGACY_BAD_LINK = 'https://chat.whatsapp.com/HomeAuraOfficialTeam';

        // Apps Script Endpoint URL
        const appsScriptUrl = ref(localStorage.getItem('homeaura_apps_script_url') || 'https://script.google.com/macros/s/AKfycbzLixNthxgqReboKXMfkLJSAz1baSXPw69ed9Lf2WxJBKtCrUzeOUzqawMf_tbn-da74Q/exec');
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
              expenses: []
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
          entity.updatedAt = new Date().toISOString();
          if (currentUser.value?.username) {
            entity.updatedBy = currentUser.value.username;
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

        const pushToGoogleSheets = async (forceFull = false) => {
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
              clientTimestamp: new Date().toISOString(),
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
              clientTimestamp: new Date().toISOString(),
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

            // 1. Orders Smart Merge (LWW per record)
            if (Array.isArray(data.orders)) {
              const remoteOrderMap = new Map();
              data.orders.forEach(ro => { if (ro && ro.id) remoteOrderMap.set(String(ro.id), ro); });

              orders.value.forEach(localOrd => {
                const remoteOrd = remoteOrderMap.get(String(localOrd.id));
                if (remoteOrd) {
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
                  remoteOrderMap.delete(String(localOrd.id));
                }
              });

              // Add newly created remote orders
              remoteOrderMap.forEach(newRemoteOrd => {
                const wasDeletedLocally = deletedOrders.value.some(d => d.id === newRemoteOrd.id) ||
                  (syncQueue.value.deletes.orders && syncQueue.value.deletes.orders.includes(newRemoteOrd.id));
                if (!wasDeletedLocally) {
                  orders.value.unshift(newRemoteOrd);
                  updatedCount++;
                }
              });

              localStorage.setItem('homeaura_orders', JSON.stringify(orders.value));
            }

            // 2. Deleted Orders Merge
            if (Array.isArray(data.deletedOrders)) {
              data.deletedOrders.forEach(remDel => {
                if (remDel && remDel.id && !deletedOrders.value.some(ld => ld.id === remDel.id)) {
                  deletedOrders.value.unshift(remDel);
                  orders.value = orders.value.filter(o => o.id !== remDel.id);
                }
              });
              localStorage.setItem('homeaura_deleted_orders', JSON.stringify(deletedOrders.value));
            }

            // 3. Users Merge
            if (Array.isArray(data.users) && data.users.length > 0) {
              const userMap = new Map();
              data.users.forEach(u => { if (u && u.username) userMap.set(String(u.username), u); });
              users.value.forEach(localU => {
                const remoteU = userMap.get(String(localU.username));
                if (remoteU && (!syncQueue.value.changes.users || !syncQueue.value.changes.users[localU.id])) {
                  Object.assign(localU, remoteU);
                  userMap.delete(String(localU.username));
                }
              });
              userMap.forEach(newU => users.value.push(newU));
              localStorage.setItem('homeaura_users', JSON.stringify(users.value));
            }

            // 4. Factories Merge
            if (Array.isArray(data.factories)) {
              const facMap = new Map();
              data.factories.forEach(f => { if (f && f.id) facMap.set(String(f.id), f); });
              factories.value.forEach(localF => {
                const remoteF = facMap.get(String(localF.id));
                if (remoteF && (!syncQueue.value.changes.factories || !syncQueue.value.changes.factories[localF.id])) {
                  Object.assign(localF, remoteF);
                  facMap.delete(String(localF.id));
                }
              });
              facMap.forEach(newF => factories.value.push(newF));
              localStorage.setItem('homeaura_factories', JSON.stringify(factories.value));
            }

            // 5. Factory Bills Merge
            if (Array.isArray(data.factoryBills)) {
              const billMap = new Map();
              data.factoryBills.forEach(b => { if (b && b.id) billMap.set(String(b.id), b); });
              factoryBills.value.forEach(localB => {
                const remoteB = billMap.get(String(localB.id));
                if (remoteB && (!syncQueue.value.changes.factoryBills || !syncQueue.value.changes.factoryBills[localB.id])) {
                  Object.assign(localB, remoteB);
                  billMap.delete(String(localB.id));
                }
              });
              billMap.forEach(newB => {
                if (!syncQueue.value.deletes.factoryBills || !syncQueue.value.deletes.factoryBills.includes(newB.id)) {
                  factoryBills.value.unshift(newB);
                }
              });
              localStorage.setItem('homeaura_factory_bills', JSON.stringify(factoryBills.value));
            }

            // 6. Expenses Merge
            if (Array.isArray(data.expenses)) {
              const expMap = new Map();
              data.expenses.forEach(e => { if (e && e.id) expMap.set(String(e.id), e); });
              expenses.value.forEach(localE => {
                const remoteE = expMap.get(String(localE.id));
                if (remoteE && (!syncQueue.value.changes.expenses || !syncQueue.value.changes.expenses[localE.id])) {
                  Object.assign(localE, remoteE);
                  expMap.delete(String(localE.id));
                }
              });
              expMap.forEach(newE => {
                if (!syncQueue.value.deletes.expenses || !syncQueue.value.deletes.expenses.includes(newE.id)) {
                  expenses.value.unshift(newE);
                }
              });
              localStorage.setItem('homeaura_expenses', JSON.stringify(expenses.value));
            }

            // 7. Categories Merge
            if (Array.isArray(data.categories) && data.categories.length > 0 && !syncQueue.value.changes.categories) {
              categories.value = data.categories.map(c => typeof c === 'object' && c !== null ? (c.name || Object.values(c).join('')) : String(c));
              localStorage.setItem('homeaura_categories', JSON.stringify(categories.value));
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

          const storedOrders = localStorage.getItem('homeaura_orders');
          orders.value = storedOrders ? JSON.parse(storedOrders) : defaultOrders;
          if (!storedOrders) localStorage.setItem('homeaura_orders', JSON.stringify(defaultOrders));

          const storedDeletedOrders = localStorage.getItem('homeaura_deleted_orders');
          deletedOrders.value = storedDeletedOrders ? JSON.parse(storedDeletedOrders) : [];

          const storedCats = localStorage.getItem('homeaura_categories');
          let parsedCats = storedCats ? JSON.parse(storedCats) : null;
          if (!parsedCats || parsedCats.length === 0) parsedCats = defaultCategories;
          categories.value = parsedCats;
          if (!storedCats) localStorage.setItem('homeaura_categories', JSON.stringify(defaultCategories));

          const storedFactories = localStorage.getItem('homeaura_factories');
          let parsedFacs = storedFactories ? JSON.parse(storedFactories) : null;
          if (!parsedFacs || parsedFacs.length === 0) parsedFacs = defaultFactories;
          factories.value = parsedFacs;
          if (!storedFactories) localStorage.setItem('homeaura_factories', JSON.stringify(defaultFactories));

          const storedFactoryBills = localStorage.getItem('homeaura_factory_bills');
          factoryBills.value = storedFactoryBills ? JSON.parse(storedFactoryBills) : [];

          const storedExpenses = localStorage.getItem('homeaura_expenses');
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
              const freshUser = users.value.find(u => u.username === user.username);
              if (freshUser && freshUser.active) {
                currentUser.value = freshUser;
                activeTab.value = freshUser.role === 'admin' ? 'dashboard' : 'intake';
              } else {
                localStorage.removeItem('homeaura_session');
              }
            } catch (e) {}
          }
        };

        const saveOrdersLocally = () => {
          localStorage.setItem("homeaura_orders", JSON.stringify(orders.value));
        };
        const saveDeletedOrdersLocally = () => {
          localStorage.setItem("homeaura_deleted_orders", JSON.stringify(deletedOrders.value));
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
          designCode: '',
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
        const modalData = reactive({ title: '', order: null, user: null, factory: null, bill: null, expense: null, selectedFactoryId: null, newStatus: '', url: '', confirmMessage: '', confirmButtonText: '', confirmButtonClass: '', onConfirm: null });
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
        const handleCollageFileUpload = (event, targetObj = intakeForm) => {
          const file = event.target.files && event.target.files[0];
          if (!file) return;

          const sellerUsername = currentUser.value ? currentUser.value.username : 'seller';
          const rawCn = targetObj.cnNumber || 'NOCN';
          const rawInv = targetObj.invoiceNumber || 'NOINV';
          const cleanCn = rawCn.replace(/[^a-zA-Z0-9-]/g, '');
          const cleanInv = rawInv.replace(/[^a-zA-Z0-9-]/g, '');
          const dateStr = targetObj.timestamp ? targetObj.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10);
          const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();

          const fileName = `${sellerUsername}_${cleanCn}_${cleanInv}_${dateStr}.${ext}`;
          const relativePath = `collage_attachments/${fileName}`;

          const reader = new FileReader();
          reader.onload = (e) => {
            targetObj.collagePhotoUrl = e.target.result;
            targetObj.collagePhotoFileName = relativePath;
          };
          reader.readAsDataURL(file);
        };

        const processProofFile = (file, targetObj = intakeForm) => {
          if (!file || !file.type.startsWith('image/')) return;
          const sellerUsername = currentUser.value ? currentUser.value.username : 'seller';
          const rawCn = targetObj.cnNumber || 'NOCN';
          const cleanCn = rawCn.replace(/[^a-zA-Z0-9-]/g, '');
          const dateStr = targetObj.timestamp ? targetObj.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10);
          const ext = (file.name ? file.name.split('.').pop() : 'png').toLowerCase();
          const fileName = `proof_${sellerUsername}_${cleanCn}_${dateStr}.${ext}`;
          
          if (targetObj === intakeForm) {
            parseSuccessMsg.value = '⏳ Uploading screenshot to Google Drive... Please wait.';
          }

          const reader = new FileReader();
          reader.onload = async (e) => {
            const base64Data = e.target.result;
            targetObj.socialProofUrl = base64Data;
            
            if (!appsScriptUrl.value) {
              if (targetObj === intakeForm) parseSuccessMsg.value = '⚠️ Proof attached locally (No Google Script URL set).';
              return;
            }

            try {
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
                  base64: base64Data
                }),
                signal: controller.signal
              });
              clearTimeout(timeoutId);

              const result = await res.json();
              if (result.status === 'success' && result.url) {
                targetObj.socialProofUrl = result.url;
                if (targetObj === intakeForm) {
                  parseSuccessMsg.value = '✅ Screenshot securely uploaded to Google Drive!';
                  setTimeout(() => { parseSuccessMsg.value = ''; }, 4000);
                }
                if (targetObj.id) {
                  queueChange('orders', targetObj);
                }
              }
            } catch(err) {
              console.warn("Upload Notice (saved locally):", err.message);
            }
          };
          reader.readAsDataURL(file);
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
            order.updatedAt = new Date().toISOString();
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
          const user = users.value.find(u => String(u.username) === String(loginForm.username) && String(u.password) === String(loginForm.password));
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
          activeTab.value = user.role === 'admin' ? 'dashboard' : 'intake';
          loginForm.username = '';
          loginForm.password = '';
        };

        const handleLogout = () => {
          currentUser.value = null;
          localStorage.removeItem('homeaura_session');
        };

        // --- COMPUTED METRICS ---
        const metrics = computed(() => {
          const grossRevenue = orders.value.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
          const deliveredProductsRevenue = orders.value.filter(o => o.status === 'Delivered' || o.status === 'Partial Delivered').reduce((acc, o) => acc + (o.saleAmount || 0), 0);
          const deliveredCount = orders.value.filter(o => o.status === 'Delivered').length;
          const pendingCount = orders.value.filter(o => o.status !== 'Delivered' && o.status !== 'Returned Received').length;
          const urgentCount = orders.value.filter(o => o.urgent).length;
          return { grossRevenue, deliveredProductsRevenue, deliveredCount, pendingCount, urgentCount };
        });

        const sellersList = computed(() => users.value.filter(u => u.role === 'seller'));
        const dispatchDeskOrders = computed(() => {
          return orders.value.filter(o => o.status !== 'Delivered' && o.status !== 'Returned Received').sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        });

        const merchantStats = computed(() => {
          return sellersList.value.map(seller => {
            const sellerOrders = orders.value.filter(o => o.merchantName === seller.name || o.merchantId === seller.id);
            const totalSales = sellerOrders.reduce((acc, o) => acc + (o.saleAmount || 0), 0);
            const target = seller.target || 300000;
            const percentage = target > 0 ? Math.round((totalSales / target) * 100) : 0;
            return {
              username: seller.username,
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
          return factoryBills.value.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
        });

        const totalOperationalExpenses = computed(() => {
          return expenses.value.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
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
                o.designCode.toLowerCase().includes(q)
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
            intakeForm.designCode = codeMatch[0].toUpperCase();
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

        const writePngBlobToClipboard = async (pngBlob) => {
          if (!pngBlob) return false;
          try {
            if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': pngBlob })
              ]);
              return true;
            }
            return false;
          } catch (err) {
            console.warn('Direct clipboard write failed (will allow manual copy):', err);
            return false;
          }
        };

        const generateOrdersCompositePng = async (ordersList, headerTitle = 'HOMEAURA PRODUCTION DISPATCH') => {
          if (!ordersList || ordersList.length === 0) return null;

          // SPECIAL HIGH-DEFINITION RENDERING FOR SINGLE ORDER SUBMISSION
          if (ordersList.length === 1) {
            const ord = ordersList[0];
            const collageImg = ord.collagePhotoUrl ? await loadImageSafe(ord.collagePhotoUrl) : null;
            const proofImg = ord.socialProofUrl ? await loadImageSafe(ord.socialProofUrl) : null;

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
            ctx.font = 'bold 22px Inter, system-ui, sans-serif';
            ctx.fillText('✨ HOMEAURA LUXURY FURNITURE', padding + 20, padding + 38);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 13px Inter, system-ui, sans-serif';
            ctx.fillText(`ORDER MANIFEST: ${ord.id} • ${ord.designCode || 'CUSTOM SPEC'}`, padding + 20, padding + 64);

            // Order ID / Urgent pill on right
            const pillX = canvasWidth - padding - 210;
            ctx.fillStyle = ord.urgent ? '#e11d48' : '#4f46e5';
            ctx.beginPath();
            ctx.roundRect(pillX, padding + 22, 190, 48, 10);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 15px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(ord.id, pillX + 95, padding + 44);
            ctx.font = '10px Inter, system-ui, sans-serif';
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
            ctx.font = 'bold 10px Inter, system-ui, sans-serif';
            ctx.fillText('👤 CUSTOMER INFORMATION', padding + 16, specY + 28);
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 14px Inter, system-ui, sans-serif';
            ctx.fillText(ord.customerName || 'N/A', padding + 16, specY + 50);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '12px Inter, system-ui, sans-serif';
            ctx.fillText(ord.customerPhone || 'N/A', padding + 16, specY + 70);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '11px Inter, system-ui, sans-serif';
            const addr = ord.customerAddress || 'N/A';
            ctx.fillText(addr.length > 36 ? addr.slice(0, 34) + '...' : addr, padding + 16, specY + 92);
            ctx.fillStyle = '#64748b';
            ctx.font = '10px Inter, system-ui, sans-serif';
            ctx.fillText(`Source: ${ord.trafficSource || 'Direct'}`, padding + 16, specY + 114);

            // Column 2: Product & Config
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 10px Inter, system-ui, sans-serif';
            ctx.fillText('🛋️ PRODUCT SPECIFICATION', padding + colWidth + 10, specY + 28);
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 14px Inter, system-ui, sans-serif';
            ctx.fillText(`${ord.productCategory || 'Sofa'}`, padding + colWidth + 10, specY + 50);
            ctx.fillStyle = '#a78bfa';
            ctx.font = 'bold 12px Inter, system-ui, sans-serif';
            ctx.fillText(`Design: ${ord.designCode || 'N/A'}`, padding + colWidth + 10, specY + 70);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '11px Inter, system-ui, sans-serif';
            ctx.fillText(`Config: ${ord.seatConfig || 'Standard'}`, padding + colWidth + 10, specY + 92);
            ctx.fillStyle = '#64748b';
            ctx.font = '10px Inter, system-ui, sans-serif';
            ctx.fillText(`Fulfillment: ${ord.fulfillmentMethod || 'Delivery'}`, padding + colWidth + 10, specY + 114);

            // Column 3: Pricing
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 10px Inter, system-ui, sans-serif';
            ctx.fillText('💵 FINANCIAL BREAKDOWN', padding + colWidth * 2 + 10, specY + 28);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '12px Inter, system-ui, sans-serif';
            ctx.fillText(`Sale Price: ৳${(ord.saleAmount || 0).toLocaleString()}`, padding + colWidth * 2 + 10, specY + 50);
            ctx.fillText(`Delivery: ৳${(ord.deliveryCharge || 0).toLocaleString()}`, padding + colWidth * 2 + 10, specY + 70);
            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 16px Inter, system-ui, sans-serif';
            ctx.fillText(`TOTAL: ৳${(ord.totalAmount || 0).toLocaleString()}`, padding + colWidth * 2 + 10, specY + 98);
            ctx.fillStyle = '#64748b';
            ctx.font = '10px Inter, system-ui, sans-serif';
            ctx.fillText(`Status: ${ord.status || 'Active'}`, padding + colWidth * 2 + 10, specY + 120);

            // Column 4: Tracking & Notes
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 10px Inter, system-ui, sans-serif';
            ctx.fillText('📑 LOGISTICS & NOTES', padding + colWidth * 3 + 10, specY + 28);
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 11px Inter, system-ui, sans-serif';
            ctx.fillText(`CN: ${ord.cnNumber || 'N/A'}`, padding + colWidth * 3 + 10, specY + 50);
            ctx.fillText(`Invoice: ${ord.invoiceNumber || 'N/A'}`, padding + colWidth * 3 + 10, specY + 68);
            if (ord.extraDetails) {
              ctx.fillStyle = '#fbbf24';
              ctx.font = '10px Inter, system-ui, sans-serif';
              ctx.fillText(`Specs: ${ord.extraDetails.slice(0, 30)}`, padding + colWidth * 3 + 10, specY + 88);
            }
            if (ord.notes) {
              ctx.fillStyle = '#94a3b8';
              ctx.font = 'italic 10px Inter, system-ui, sans-serif';
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
              ctx.font = 'bold 11px Inter, system-ui, sans-serif';
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
              ctx.font = 'bold 11px Inter, system-ui, sans-serif';
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
              ctx.font = 'bold 11px Inter, system-ui, sans-serif';
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
              ctx.font = 'italic 13px Inter, system-ui, sans-serif';
              ctx.fillText('ℹ️ No image attachments uploaded for this order manifest.', padding + 24, imgY + 65);
            }

            // Bottom Footer
            const footY = totalHeight - footerHeight;
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, footY, canvasWidth, footerHeight);

            ctx.fillStyle = '#64748b';
            ctx.font = '11px Inter, system-ui, sans-serif';
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
            if (ord.collagePhotoUrl) urls.push({ type: 'Collage Photo', url: ord.collagePhotoUrl, filename: ord.collagePhotoFileName });

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
          ctx.font = 'bold 24px Inter, system-ui, sans-serif';
          ctx.fillText(`✨ ${headerTitle}`, padding + 4, 42);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '13px Inter, system-ui, sans-serif';
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
              ctx.font = 'bold 15px Inter, system-ui, sans-serif';
              ctx.fillText(`📦 ${ord.id} - ${ord.designCode || 'No Code'}`, cardX + 16, cardY + 26);

              // Secondary details line
              ctx.fillStyle = '#cbd5e1';
              ctx.font = '12px Inter, system-ui, sans-serif';
              const detailStr = `Item: ${ord.productCategory || 'N/A'} (${ord.seatConfig || ''}) | Specs: ${ord.extraDetails || 'Standard'}`;
              ctx.fillText(detailStr.length > 50 ? detailStr.slice(0, 48) + '...' : detailStr, cardX + 16, cardY + 48);

              // Type Tag Badge
              ctx.fillStyle = item.type.includes('Collage') ? '#4f46e5' : (item.type.includes('Proof') ? '#059669' : '#475569');
              ctx.beginPath();
              ctx.roundRect(cardX + cardWidth - 120, cardY + 14, 106, 24, 6);
              ctx.fill();
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 11px Inter, system-ui, sans-serif';
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
                ctx.font = 'italic 13px Inter, system-ui, sans-serif';
                ctx.fillText('No image attachment uploaded', imgAreaX + 18, imgAreaY + 36);
                ctx.fillStyle = '#e2e8f0';
                ctx.font = '12px Inter, system-ui, sans-serif';
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
          try {
            const targetOrders = orderObj ? [orderObj] : [{
              id: 'NEW-ORDER',
              designCode: intakeForm.designCode || 'Design Spec',
              productCategory: intakeForm.productCategory || 'Item',
              seatConfig: intakeForm.seatConfig || '',
              customerName: intakeForm.customerName || 'Customer',
              customerPhone: intakeForm.customerPhone || '',
              customerAddress: intakeForm.customerAddress || '',
              collagePhotoUrl: url2 || '',
              socialProofUrl: url1 || ''
            }];

            const pngResult = await generateOrdersCompositePng(targetOrders, 'HOMEAURA ORDER ATTACHMENT');
            if (pngResult && pngResult.blob) {
              const copied = await writePngBlobToClipboard(pngResult.blob);
              return { success: copied, result: pngResult };
            }
            return { success: false, result: null };
          } catch (err) {
            console.error("Clipboard copy failed:", err);
            return { success: false, result: null };
          }
        };

        const submitNewOrder = async () => {
          const newId = 'ORD-' + (1000 + orders.value.length + 1);
          const timestamp = getBangladeshTimeString(new Date());
          const sellerUsername = currentUser.value ? currentUser.value.username : 'seller';
          const autoCn = intakeForm.cnNumber || ('CN-' + (1000 + orders.value.length + 1));
          const autoInv = intakeForm.invoiceNumber || ('INV-' + (1000 + orders.value.length + 1));
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
            designCode: intakeForm.designCode,
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
            collagePhotoFileName: autoFileName,
            socialProofUrl: intakeForm.socialProofUrl || '',
            socialProofFileName: intakeForm.socialProofFileName || '',
            extraDetails: intakeForm.extraDetails || '',
            factoryTag: intakeForm.factoryTag || '',
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser.value ? currentUser.value.username : 'seller'
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
          intakeForm.designCode = '';
          intakeForm.saleAmount = 0;
          intakeForm.deliveryCharge = 0;
          intakeForm.urgent = false;
          intakeForm.notes = '';
          intakeForm.cnNumber = '';
          intakeForm.invoiceNumber = '';
          intakeForm.collagePhotoUrl = '';
          intakeForm.collagePhotoFileName = '';
          intakeForm.socialProofUrl = '';
          intakeForm.socialProofFileName = '';
          intakeForm.extraDetails = '';
          intakeForm.factoryTag = '';
          clipboardRawText.value = '';
          activeTab.value = 'my_orders';
          
          let hasCopiedPhotos = false;
          let generatedPngData = null;
          if (proofUrlToCopy || collageUrlToCopy) {
            const pngRes = await copyBothPhotosToClipboard(proofUrlToCopy, collageUrlToCopy, newOrder);
            hasCopiedPhotos = pngRes.success;
            generatedPngData = pngRes.result;
          }

          let waText = `📦 *NEW HOMEAURA ORDER SUBMISSION*\n`;
          waText += `━━━━━━━━━━━━━━━━━━━━━\n`;
          waText += `🆔 *Order Ref:* ${newOrder.id}\n`;
          waText += `👤 *Merchant:* ${newOrder.merchantName}\n`;
          waText += `📞 *Customer:* ${newOrder.customerName} (${newOrder.customerPhone})\n`;
          waText += `📍 *Delivery Address:* ${newOrder.customerAddress}\n`;
          waText += `🛋️ *Item:* ${newOrder.productCategory} - ${newOrder.designCode} (${newOrder.seatConfig})\n`;
          waText += `🚚 *Fulfillment:* ${newOrder.fulfillmentMethod}\n`;
          waText += `💵 *Total Payable:* ৳${(newOrder.totalAmount || 0).toLocaleString()} (Sale: ৳${(newOrder.saleAmount || 0).toLocaleString()} + Del: ৳${(newOrder.deliveryCharge || 0).toLocaleString()})\n`;
          waText += `📑 *CN / Invoice:* ${newOrder.cnNumber || 'N/A'} / ${newOrder.invoiceNumber || 'N/A'}\n`;
          if (newOrder.notes) waText += `📝 *Notes:* ${newOrder.notes}\n`;
          if (newOrder.extraDetails) waText += `🔍 *Specs:* ${newOrder.extraDetails}\n`;
          waText += `━━━━━━━━━━━━━━━━━━━━━\n`;
          waText += `🕒 *Registered (BST):* ${formatBangladeshDisplayTime(new Date())}\n`;

          orderSuccessData.order = newOrder;
          orderSuccessData.hasCopiedPhotos = hasCopiedPhotos;
          orderSuccessData.compositePngUrl = generatedPngData ? generatedPngData.dataUrl : '';
          orderSuccessData.previewPngUrl = generatedPngData ? generatedPngData.dataUrl : '';
          orderSuccessData.compositePngBlob = generatedPngData ? generatedPngData.blob : null;
          orderSuccessData.previewBlob = generatedPngData ? generatedPngData.blob : null;
          orderSuccessData.waGroupLink = (adminWaGroupLink.value || '').trim() || DEFAULT_WA_GROUP_LINK;
          orderSuccessData.formattedSummary = waText;
          orderSuccessData.isCopiedText = false;

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
          order.updatedAt = new Date().toISOString();
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
          order.updatedAt = new Date().toISOString();
          order.updatedBy = currentUser.value?.username || 'seller';
          queueChange('orders', order);
          saveOrdersLocally();
        };

        // --- FACTORY BILLS AND EXPENSES ---
        const openAddBillModal = () => {
          modalData.title = 'Add Factory Bill & Payment';
          modalData.bill = reactive({ factoryId: '', amount: '', overcharge: '', date: getBangladeshDateString(new Date()), notes: '', linkedOrderIds: [], photoUrl: '' });
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
            return o && o.factoryTag === factoryName;
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

          billToSave.updatedAt = new Date().toISOString();
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
          modalData.expense.updatedAt = new Date().toISOString();
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
          facToSave.updatedAt = new Date().toISOString();
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
          if (!order) return '';
          const targetFactory = factories.value.find(f => f.id === factoryId) || factories.value[0];
          const factoryName = targetFactory ? targetFactory.name : 'Factory Partner';

          let payload = `🏭 *HOMEAURA PRODUCTION ORDER DISPATCH*\n`;
          payload += `------------------------------------\n`;
          payload += `*Target Factory:* ${factoryName}\n`;
          payload += `*Order Ref:* ${order.id}\n`;
          payload += `*Consignment No (CN):* ${order.cnNumber || 'N/A'}\n`;
          payload += `*Factory Invoice No:* ${order.invoiceNumber || 'N/A'}\n`;
          payload += `*Date:* ${order.timestamp}\n`;
          payload += `*Product:* ${order.productCategory} (${order.seatConfig})\n`;
          payload += `*Design Code:* ${order.designCode}\n`;
          payload += `*Client Name:* ${order.customerName}\n`;
          payload += `*Client Contact:* ${order.customerPhone}\n`;
          payload += `*Delivery Address:* ${order.customerAddress}\n`;
          if (order.extraDetails) payload += `*Fabric & Specs:* ${order.extraDetails}\n`;
          if (order.notes) payload += `*Special Notes:* ${order.notes}\n`;
          if (order.collagePhotoFileName) payload += `*Local Attachment:* ${order.collagePhotoFileName}\n`;
          if (order.collagePhotoUrl && !order.collagePhotoUrl.startsWith('data:')) payload += `*Collage Photo Link:* ${order.collagePhotoUrl}\n`;
          payload += `------------------------------------\n`;
          payload += `Please confirm fabric stock & production timeline.`;

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
            realOrder.updatedAt = new Date().toISOString();
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

          let hasCopied = false;
          let generatedPng = null;
          try {
            if (order.collagePhotoUrl || order.socialProofUrl) {
              const pngRes = await copyBothPhotosToClipboard(order.socialProofUrl, order.collagePhotoUrl, order);
              hasCopied = pngRes.success;
              generatedPng = pngRes.result;
            } else {
              await navigator.clipboard.writeText(messageText);
            }
          } catch (err) {
            console.error('Clipboard copy failed:', err);
          }

          bulkDispatchSuccessData.ordersCount = 1;
          bulkDispatchSuccessData.count = 1;
          bulkDispatchSuccessData.photoCount = (order.collagePhotoUrl ? 1 : 0) + (order.socialProofUrl ? 1 : 0);
          bulkDispatchSuccessData.factoryName = targetFactory.name;
          bulkDispatchSuccessData.waGroupLink = waUrl;
          bulkDispatchSuccessData.compositePngUrl = generatedPng ? generatedPng.dataUrl : '';
          bulkDispatchSuccessData.previewPngUrl = generatedPng ? generatedPng.dataUrl : '';
          bulkDispatchSuccessData.compositePngBlob = generatedPng ? generatedPng.blob : null;
          bulkDispatchSuccessData.previewBlob = generatedPng ? generatedPng.blob : null;
          bulkDispatchSuccessData.hasCopiedPhotos = hasCopied;
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
            manifestText += `🛋️ *Item:* ${ord.productCategory} - ${ord.designCode || 'N/A'} (${ord.seatConfig || ''})\n`;
            if (ord.extraDetails) manifestText += `🔍 *Specs:* ${ord.extraDetails}\n`;
            if (ord.notes) manifestText += `📝 *Notes:* ${ord.notes}\n`;
            manifestText += `------------------------------------\n`;
          });
          manifestText += `\n*Please confirm fabric availability & production queue for the attached order collages.*`;

          // Generate composite PNG containing all collages
          let hasCopiedPhotos = false;
          let pngResult = null;
          try {
            pngResult = await generateOrdersCompositePng(selectedList, `BULK DISPATCH: ${targetFactory.name.toUpperCase()}`);
            if (pngResult && pngResult.blob) {
              hasCopiedPhotos = await writePngBlobToClipboard(pngResult.blob);
            }
          } catch (err) {
            console.warn('Notice generating bulk composite PNG:', err.message);
          }

          // Update status of all selected orders in local state and queue for delta sync
          const nowIso = new Date().toISOString();
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
          bulkDispatchSuccessData.isCopiedText = false;

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
            realOrder.updatedAt = new Date().toISOString();
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
            modalData.order.updatedAt = new Date().toISOString();
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
            orderToVoid.deletedAt = getBangladeshTimeString(new Date());
            orderToVoid.updatedAt = new Date().toISOString();
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
          order.updatedAt = new Date().toISOString();
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
                o.updatedAt = new Date().toISOString();
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
          
          const now = getBangladeshTimeString(new Date());
          ordersToMove.forEach(o => {
            o.deletedAt = now;
            o.updatedAt = new Date().toISOString();
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

            const testPayload = { _connectionTest: [{ timestamp: new Date().toISOString(), message: "HomeAura multi-user sync engine is online!" }] };
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
}`;
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
            timestamp: new Date().toISOString()
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
          modalData.user = reactive({ name: '', username: '', password: '1234', role: 'seller', active: true, target: 300000 });
          activeModal.value = 'userModal';
        };

        const openEditUserModal = (user) => {
          modalData.title = `Edit Profile: @${user.username}`;
          modalData.user = reactive({ ...user });
          activeModal.value = 'userModal';
        };

        const saveUserModal = () => {
          const idx = users.value.findIndex(u => u.username === modalData.user.username);
          let userToSave;
          if (idx !== -1) {
            users.value[idx] = { ...modalData.user };
            userToSave = users.value[idx];
          } else {
            modalData.user.id = 'u' + (users.value.length + 1);
            userToSave = { ...modalData.user };
            users.value.push(userToSave);
          }
          userToSave.updatedAt = new Date().toISOString();
          userToSave.updatedBy = currentUser.value?.username || 'admin';
          queueChange('users', userToSave);
          saveUsersLocally();
          closeModal();
        };

        const toggleUserActive = (user) => {
          user.active = !user.active;
          user.updatedAt = new Date().toISOString();
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

        // Watchers for Charts
        watch(activeTab, (val) => {
          if (val === 'dashboard') {
            Vue.nextTick(() => {
              renderChart();
              renderPieChart();
            });
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

            if (selectedProofTile.value === 'terminal') {
              handleProofPaste(e, intakeForm);
            } else if (selectedProofTile.value === 'modal') {
              if (modalData.order) handleProofPaste(e, modalData.order);
              if (modalData.bill) handleProofPaste(e, modalData.bill);
            }
          });
        });

        return {
          getBillOrdersTotalSale,
          getOrdersByIds,
          factoryBills,
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
          selectProofTile,
          activeTab,
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
          metrics,
          sellersList,
          merchantStats,
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
          reCopyBulkPngToClipboard
        };
      }
    }).mount('#app');
