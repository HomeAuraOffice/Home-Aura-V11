    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          colors: {
            brand: {
              50: '#f0f3ff',
              100: '#e0e7ff',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
            }
          }
        }
      }
    }
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

        // --- SEEDING DEFAULT USERS (Must be changed immediately) ---
        const defaultUsers = [
          { id: 'u1', username: 'admin', password: 'changeme123', name: 'Master Admin', role: 'admin', active: true, target: 0 },
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

        // --- SEEDING 13 BOOTSTRAP REAL-WORLD ORDERS ---
        const defaultOrders = [
          { id: 'ORD-1001', timestamp: '2026-08-01 10:15', merchantId: 'u2', merchantName: 'Tanvir Hossain', customerName: 'Far Ha Na', customerPhone: '01711223344', customerAddress: 'Apt 4B, Green Road, Dhanmondi, Dhaka', trafficSource: 'Messenger', designCode: 'RH-336', productCategory: 'L-Shape Sofa', seatConfig: 'L-Shape', fulfillmentMethod: 'Home Delivery', saleAmount: 65000, deliveryCharge: 2500, totalAmount: 67500, status: 'Delivered', urgent: false, notes: 'Navy blue velvet fabric.', cnNumber: '276331879', invoiceNumber: 'INV-1001', collagePhotoFileName: 'collage_attachments/seller1_CN-1001_INV-1001_2026-08-01.jpg' },
          { id: 'ORD-1002', timestamp: '2026-08-02 11:30', merchantId: 'u2', merchantName: 'Tanvir Hossain', customerName: 'Muslim Wddin Piyash', customerPhone: '01819876543', customerAddress: 'House 12, Road 4, Sector 7, Uttara, Dhaka', trafficSource: 'WhatsApp', designCode: 'RH-337', productCategory: 'Sofa Set', seatConfig: '3-Seater', fulfillmentMethod: 'Home Delivery', saleAmount: 48000, deliveryCharge: 2000, totalAmount: 50000, status: 'Courier Booking', urgent: true, notes: 'Requested delivery before weekend.', cnNumber: '278097551', invoiceNumber: 'INV-1002', collagePhotoFileName: 'collage_attachments/seller1_CN-1002_INV-1002_2026-08-02.jpg' },
          { id: 'ORD-1003', timestamp: '2026-08-03 14:20', merchantId: 'u3', merchantName: 'Ariful Ahmed', customerName: 'Rayhan Kabir', customerPhone: '01912345678', customerAddress: 'GEC Circle, Nasirabad, Chattogram', trafficSource: 'Direct Call', designCode: 'RH-338', productCategory: 'Recliner Chair', seatConfig: '1-Seater', fulfillmentMethod: 'Courier Service', saleAmount: 28000, deliveryCharge: 1500, totalAmount: 29500, status: 'Courier Pending', urgent: false, notes: 'Tagged via Sundarban Courier.', cnNumber: '279816167', invoiceNumber: 'INV-1003', collagePhotoFileName: 'collage_attachments/seller2_CN-1003_INV-1003_2026-08-03.jpg' },
          { id: 'ORD-1004', timestamp: '2026-08-04 09:45', merchantId: 'u4', merchantName: 'Farah Naz', customerName: 'Anisur Rahman', customerPhone: '01715556677', customerAddress: 'Zindabazar, Sylhet Sadar, Sylhet', trafficSource: 'Walk-in', designCode: 'RH-339', productCategory: 'Dining Table', seatConfig: 'Custom Set', fulfillmentMethod: 'Courier Service', saleAmount: 85000, deliveryCharge: 3500, totalAmount: 88500, status: 'Factory Submit', urgent: false, notes: '6-seater in Teak wood finish.', cnNumber: '279818987', invoiceNumber: 'INV-1004', collagePhotoFileName: 'collage_attachments/seller3_CN-1004_INV-1004_2026-08-04.jpg' },
          { id: 'ORD-1005', timestamp: '2026-08-05 16:10', merchantId: 'u2', merchantName: 'Tanvir Hossain', customerName: 'Tahmina Begum', customerPhone: '01611224455', customerAddress: 'Block C, Bashundhara R/A, Dhaka', trafficSource: 'Messenger', designCode: 'RH-340', productCategory: 'L-Shape Sofa', seatConfig: 'L-Shape', fulfillmentMethod: 'Home Delivery', saleAmount: 72000, deliveryCharge: 3000, totalAmount: 75000, status: 'Confirmation Call', urgent: true, notes: 'Verify color swatch.', cnNumber: '281926578', invoiceNumber: 'INV-1005', collagePhotoFileName: 'collage_attachments/seller1_CN-1005_INV-1005_2026-08-05.jpg' },
          { id: 'ORD-1006', timestamp: '2026-08-06 13:05', merchantId: 'u3', merchantName: 'Ariful Ahmed', customerName: 'Kazi Shakil', customerPhone: '01812334455', customerAddress: 'College Road, Mymensingh Sadar', trafficSource: 'WhatsApp', designCode: 'RH-342', productCategory: 'Sofa Set', seatConfig: '2-Seater', fulfillmentMethod: 'Courier Service', saleAmount: 36000, deliveryCharge: 1800, totalAmount: 37800, status: 'Delivered', urgent: false, notes: 'Full payment cleared.', cnNumber: '281927672', invoiceNumber: 'INV-1006', collagePhotoFileName: 'collage_attachments/seller2_CN-1006_INV-1006_2026-08-06.jpg' },
          { id: 'ORD-1007', timestamp: '2026-08-07 10:50', merchantId: 'u4', merchantName: 'Farah Naz', customerName: 'Nusrat Jahan', customerPhone: '01799887766', customerAddress: 'Chashara, Narayanganj', trafficSource: 'Messenger', designCode: 'RH-343', productCategory: 'Custom Bed', seatConfig: 'Custom Set', fulfillmentMethod: 'Home Delivery', saleAmount: 95000, deliveryCharge: 2500, totalAmount: 97500, status: 'Partial Delivered', urgent: false, notes: 'Frame delivered, mattress pending.', cnNumber: '282095540', invoiceNumber: 'INV-1007', collagePhotoFileName: 'collage_attachments/seller3_CN-1007_INV-1007_2026-08-07.jpg' },
          { id: 'ORD-1008', timestamp: '2026-08-08 15:30', merchantId: 'u2', merchantName: 'Tanvir Hossain', customerName: 'Mahfuzur Rahman', customerPhone: '01552345678', customerAddress: 'Main Road, Rajshahi Sadar', trafficSource: 'Direct Call', designCode: 'RH-345', productCategory: 'Recliner Chair', seatConfig: '1-Seater', fulfillmentMethod: 'Courier Service', saleAmount: 30000, deliveryCharge: 1500, totalAmount: 31500, status: 'Returned from Customer', urgent: true, notes: 'Color mismatch claim.', cnNumber: '282403020', invoiceNumber: 'INV-1008', collagePhotoFileName: 'collage_attachments/seller1_CN-1008_INV-1008_2026-08-08.jpg' },
          { id: 'ORD-1009', timestamp: '2026-08-09 11:15', merchantId: 'u3', merchantName: 'Ariful Ahmed', customerName: 'Sultana Razia', customerPhone: '01733445566', customerAddress: 'Shibbari More, Khulna', trafficSource: 'WhatsApp', designCode: 'RH-346', productCategory: 'Sofa Set', seatConfig: '3-Seater', fulfillmentMethod: 'Courier Service', saleAmount: 52000, deliveryCharge: 2200, totalAmount: 54200, status: 'Returned Received', urgent: false, notes: 'Returned to warehouse.', cnNumber: '282531127', invoiceNumber: 'INV-1009', collagePhotoFileName: 'collage_attachments/seller2_CN-1009_INV-1009_2026-08-09.jpg' }
];

        const defaultCategories = ['L-Shape Sofa', 'Sofa Set', 'Recliner Chair', 'Dining Table', 'Custom Bed', 'Living Room Accessories'];

        // --- STATE MANAGEMENT ---
        const users = ref([]);
        const orders = ref([]);
        const deletedOrders = ref([]);
        const selectedOrders = ref(new Set());
        const categories = ref([]);
        const factories = ref([]);
        const factoryBills = ref([]);
        const expenses = ref([]);
        const appsScriptUrl = ref('https://script.google.com/macros/s/AKfycbzLixNthxgqReboKXMfkLJSAz1baSXPw69ed9Lf2WxJBKtCrUzeOUzqawMf_tbn-da74Q/exec');
        const isBackingUp = ref(false);
        const isTestingSync = ref(false);
        const syncStatusMsg = ref('');
        const syncStatusColor = ref('');
        const currentUser = ref(null);
        
        const adminWaGroupLink = ref(localStorage.getItem('homeaura_admin_wa') || '');
        watch(adminWaGroupLink, (val) => localStorage.setItem('homeaura_admin_wa', val));

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

        const openInspectModal = (order) => {
          modalData.title = `Full Order & Attachments: ${order.id}`;
          modalData.order = reactive({ ...order });
          activeModal.value = 'inspectModal';
        };

        // --- SOCIAL PROOF TILE SELECTION & CTRL+V PASTE LISTENER ---
        const selectedProofTile = ref('terminal'); // Default selection on terminal load

        const selectProofTile = (tileKey) => {
          selectedProofTile.value = tileKey;
        };

        const activeTab = ref('dashboard');
        const loginForm = reactive({ username: '', password: '' });
        const loginError = ref('');
        const lastSyncTimestamp = ref('');

        // Filtering
        const orderSearch = ref('');
        const sortOption = ref('NEWEST');
        const statusFilter = ref('ALL');
        const merchantFilter = ref('ALL');
        const factoryFilter = ref('ALL');
        const urgentOnly = ref(false);

        // Category Creation
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
        const modalData = reactive({ title: '', order: null, user: null, factory: null, selectedFactoryId: null, newStatus: '', url: '' });
        
        // Tracking State
        const trackingData = ref(null);
        const isLoadingTracking = ref(false);

        // --- COLLAGE FILE ATTACHMENT & NAMING ENGINE ---
        // Format: sellerUsername_cnNumber_invoiceNumber_date.ext
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

        // --- SOCIAL MEDIA CHAT PROOF SCREENSHOT ENGINE ---
        // Supports clipboard paste (Ctrl+V), drag-and-drop, and file upload
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
            // Temporarily show the local image for instant feedback
            targetObj.socialProofUrl = base64Data;
            
            if (!appsScriptUrl.value) {
              if (targetObj === intakeForm) parseSuccessMsg.value = '⚠️ Proof attached locally (No Google Script URL set).';
              return;
            }

            try {
              const res = await fetch(appsScriptUrl.value, {
                method: 'POST',
                body: JSON.stringify({
                  action: 'upload_image',
                  filename: fileName,
                  base64: base64Data
                })
              });
              const result = await res.json();
              if (result.status === 'success' && result.url) {
                targetObj.socialProofUrl = result.url;
                if (targetObj === intakeForm) {
                  parseSuccessMsg.value = '✅ Screenshot securely uploaded to Google Drive!';
                  setTimeout(() => { parseSuccessMsg.value = ''; }, 4000);
                }
                triggerAutoSync();
              } else {
                if (targetObj === intakeForm) parseSuccessMsg.value = '⚠️ Upload failed: ' + (result.error || 'Unknown error');
              }
            } catch(err) {
              console.error("Upload Error:", err);
              if (targetObj === intakeForm) parseSuccessMsg.value = '⚠️ Upload failed. Retained local copy.';
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
            saveOrders();
          }
        };

        // --- LOCAL STORAGE PERSISTENCE ---
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

          const storedSession = localStorage.getItem('homeaura_session');
          if (storedSession) {
            const user = JSON.parse(storedSession);
            // Verify active status
            const freshUser = users.value.find(u => u.username === user.username);
            if (freshUser && freshUser.active) {
              currentUser.value = freshUser;
              activeTab.value = freshUser.role === 'admin' ? 'dashboard' : 'intake';
            } else {
              localStorage.removeItem('homeaura_session');
            }
          }
        };

        const saveOrders = () => {
          localStorage.setItem("homeaura_orders", JSON.stringify(orders.value)); triggerAutoSync();
        };
        const saveDeletedOrders = () => {
          localStorage.setItem("homeaura_deleted_orders", JSON.stringify(deletedOrders.value)); triggerAutoSync();
        };

        const saveUsers = () => {
          localStorage.setItem("homeaura_users", JSON.stringify(users.value)); triggerAutoSync();
        };

        const saveCategories = () => {
          localStorage.setItem("homeaura_categories", JSON.stringify(categories.value)); triggerAutoSync();
        };

        const saveFactoryBills = () => {
          localStorage.setItem("homeaura_factory_bills", JSON.stringify(factoryBills.value)); triggerAutoSync();
        };
        const saveExpenses = () => {
          localStorage.setItem("homeaura_expenses", JSON.stringify(expenses.value)); triggerAutoSync();
        };
        const saveFactories = () => {
          localStorage.setItem("homeaura_factories", JSON.stringify(factories.value)); triggerAutoSync();
        };

        // --- DYNAMIC FACTORY PRIORITY ENGINE ---
        const rankedFactories = computed(() => {
          return factories.value.map(f => {
            // Count pending orders assigned to this factory tag OR in workflow pending stages
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
            const loadPenalty = pendingCount * 12; // More pending orders = drop down in priority

            const totalScore = qualityScore + stockScore - priceFactor - loadPenalty;

                        return {
              ...f,
              pendingCount,
              totalScore
            };
          }).sort((a, b) => b.totalScore - a.totalScore);
        });

        // --- CURRENCY LOCALIZATION (en-BD / BDT) ---
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
            stats[bill.factoryId].totalAmount += bill.amount;
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
             const costPerOrder = bill.amount / linked.length;
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

        const myMonthlySales = computed(() => {
          return myOrders.value.reduce((acc, o) => acc + (o.saleAmount || 0), 0);
        });

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

        // --- OMNI-CLIPBOARD HEURISTIC PARSER ENGINE ---
        const parseClipboard = () => {
          if (!clipboardRawText.value) return;
          const text = clipboardRawText.value;
          let parsedCount = 0;

          // 1. Phone extraction
          const phoneMatch = text.match(/(?:\+?88)?01[3-9]\d{8}/) || text.match(/01[3-9]\d{2}[-\s]?\d{6}/);
          if (phoneMatch) {
            intakeForm.customerPhone = phoneMatch[0].replace(/[-\s]/g, '');
            parsedCount++;
          }

          // 2. Design code extraction (RH- prefixed)
          const codeMatch = text.match(/RH-\d{3,4}/i);
          if (codeMatch) {
            intakeForm.designCode = codeMatch[0].toUpperCase();
            parsedCount++;
          }

          // 3. Traffic Source extraction
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

          // 4. Seat configuration extraction
          if (/1-seater|1 seater/i.test(text)) intakeForm.seatConfig = '1-Seater';
          else if (/2-seater|2 seater/i.test(text)) intakeForm.seatConfig = '2-Seater';
          else if (/3-seater|3 seater/i.test(text)) intakeForm.seatConfig = '3-Seater';
          else if (/l-shape|l shape/i.test(text)) intakeForm.seatConfig = 'L-Shape';

          // 5. Customer Name heuristic
          const nameMatch = text.match(/(?:name|customer|client)[:\s=]+([A-Za-z\s]+)/i);
          if (nameMatch) {
            intakeForm.customerName = nameMatch[1].trim();
            parsedCount++;
          }

          // 6. Address heuristic
          const addrMatch = text.match(/(?:address|location)[:\s=]+(.+)/i);
          if (addrMatch) {
            intakeForm.customerAddress = addrMatch[1].trim();
            parsedCount++;
          }

          // 7. Pricing extraction
          const priceMatch = text.match(/(?:price|sale|cost)[:\s=]*(\d[\d,.]*)/i) || text.match(/(\d{4,6})\s*tk/i);
          if (priceMatch) {
            intakeForm.saleAmount = parseInt(priceMatch[1].replace(/,/g, ''), 10);
            parsedCount++;
          }

          const delMatch = text.match(/(?:del|delivery|charge)[:\s=]*(\d[\d,.]*)/i);
          if (delMatch) {
            intakeForm.deliveryCharge = parseInt(delMatch[1].replace(/,/g, ''), 10);
            parsedCount++;
          }

          // 8. CN Number extraction
          const cnMatch = text.match(/(?:cn|consignment|courier id)[:\s=]*([A-Za-z0-9-]+)/i);
          if (cnMatch) {
            intakeForm.cnNumber = cnMatch[1].toUpperCase();
            parsedCount++;
          }

          // 9. Factory Invoice extraction
          const invMatch = text.match(/(?:inv|invoice|bill)[:\s=]*([A-Za-z0-9-]+)/i);
          if (invMatch) {
            intakeForm.invoiceNumber = invMatch[1].toUpperCase();
            parsedCount++;
          }

          parseSuccessMsg.value = `✨ Parsed ${parsedCount} fields automatically from pasted message!`;
          setTimeout(() => { parseSuccessMsg.value = ''; }, 4000);
        };

        // --- ORDER SUBMISSION ---
        const copyBothPhotosToClipboard = async (url1, url2) => {
          try {
            const loadImage = (url) => {
              return new Promise((resolve, reject) => {
                if (!url) return resolve(null);
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
              });
            };

            const img1 = await loadImage(url1);
            const img2 = await loadImage(url2);

            if (!img1 && !img2) return false;

            const padding = 20;
            const canvas = document.createElement('canvas');
            let totalWidth = 0;
            let maxHeight = 0;

            if (img1 && img2) {
              totalWidth = img1.width + img2.width + padding;
              maxHeight = Math.max(img1.height, img2.height);
            } else if (img1) {
              totalWidth = img1.width;
              maxHeight = img1.height;
            } else {
              totalWidth = img2.width;
              maxHeight = img2.height;
            }

            canvas.width = totalWidth;
            canvas.height = maxHeight;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (img1 && img2) {
              ctx.drawImage(img1, 0, 0);
              ctx.drawImage(img2, img1.width + padding, 0);
            } else if (img1) {
              ctx.drawImage(img1, 0, 0);
            } else if (img2) {
              ctx.drawImage(img2, 0, 0);
            }

            const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': pngBlob })
            ]);
            return true;
          } catch (err) {
            console.error("Clipboard copy failed:", err);
            return false;
          }
        };

        const submitNewOrder = async () => {
          const newId = 'ORD-' + (1000 + orders.value.length + 1);
          const now = new Date();
          const timestamp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
          const sellerUsername = currentUser.value ? currentUser.value.username : 'seller';
          const autoCn = intakeForm.cnNumber || ('CN-' + (1000 + orders.value.length + 1));
          const autoInv = intakeForm.invoiceNumber || ('INV-' + (1000 + orders.value.length + 1));
          const dateStr = timestamp.slice(0, 10);
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
            factoryTag: intakeForm.factoryTag || ''
          };
          
          const proofUrlToCopy = intakeForm.socialProofUrl;
          const collageUrlToCopy = intakeForm.collagePhotoUrl;
          
          orders.value.unshift(newOrder);
          saveOrders();
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
          
          if (adminWaGroupLink.value || proofUrlToCopy || collageUrlToCopy) {
            const hasCopied = await copyBothPhotosToClipboard(proofUrlToCopy, collageUrlToCopy);
            let alertMsg = '✅ Order successfully created!\n\n';
            if (hasCopied) {
               alertMsg += '📸 Both attached photos (Social Proof + Collage) have been securely copied to your clipboard as a PNG image.\n\n';
            }
            if (adminWaGroupLink.value) {
               alertMsg += 'Opening the WhatsApp Group. Please paste (Ctrl+V or Cmd+V) to share the photos with the team!';
            } else {
               alertMsg += 'Setup your "Order Submission WhatsApp Group" in Settings to auto-open it upon submission!';
            }
            alert(alertMsg);

            if (adminWaGroupLink.value) {
              window.open(adminWaGroupLink.value, '_blank');
            }
          }
        };
        const quickStatusChange = (order, newStatus) => {
          if (currentUser.value?.role === 'seller' && order.merchantName !== currentUser.value?.name && order.merchantId !== currentUser.value?.id) {
            alert("⚠️ Security restriction: You cannot update status of orders assigned to other merchants.");
            return;
          }
          order.status = newStatus;
          saveOrders();
        };

        const toggleUrgent = (order) => {
          if (currentUser.value?.role === 'seller' && order.merchantName !== currentUser.value?.name && order.merchantId !== currentUser.value?.id) {
            alert("⚠️ Security restriction: You cannot update orders assigned to other merchants.");
            return;
          }
          order.urgent = !order.urgent;
          saveOrders();
        };

        // --- FACTORY MANAGEMENT & DISPATCH METHODS ---
        
        const openAddBillModal = () => {
          modalData.title = 'Add Factory Bill & Payment';
          modalData.bill = reactive({ factoryId: '', amount: '', overcharge: '', date: new Date().toISOString().substring(0,10), notes: '', linkedOrderIds: [], photoUrl: '' });
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
          
          // Cleanup linked orders that don't belong to the newly selected factory
          const factoryName = getFactoryName(modalData.bill.factoryId);
          const allOrders = [...orders.value, ...deletedOrders.value];
          modalData.bill.linkedOrderIds = (modalData.bill.linkedOrderIds || []).filter(id => {
            const o = allOrders.find(ord => ord.id === id);
            return o && o.factoryTag === factoryName;
          });
          if (modalData.bill.id) {
            const idx = factoryBills.value.findIndex(b => b.id === modalData.bill.id);
            if (idx !== -1) {
              factoryBills.value[idx] = { ...modalData.bill };
            } else {
              factoryBills.value.push({ ...modalData.bill });
            }
          } else {
            modalData.bill.id = 'FB-' + Date.now().toString().slice(-6);
            factoryBills.value.push({ ...modalData.bill });
          }
          saveFactoryBills();
          closeModal();
        };

        const deleteBill = (id) => {
          if (confirm('Are you sure you want to delete this bill?')) {
            factoryBills.value = factoryBills.value.filter(b => b.id !== id);
            saveFactoryBills();
          }
        };

        const openAddExpenseModal = () => {
          modalData.title = 'Record Operating Expense';
          modalData.expense = reactive({ date: new Date().toISOString().substring(0,10), category: 'Other', amount: '', description: '' });
          activeModal.value = 'expenseModal';
        };

        const saveExpenseModal = () => {
          if (!modalData.expense.amount || !modalData.expense.category) {
            alert('Category and Amount are required.');
            return;
          }
          modalData.expense.id = 'EXP-' + Date.now().toString().slice(-6);
          expenses.value.push({ ...modalData.expense });
          saveExpenses();
          closeModal();
        };

        const deleteExpense = (id) => {
          if (confirm('Are you sure you want to delete this expense record?')) {
            expenses.value = expenses.value.filter(e => e.id !== id);
            saveExpenses();
          }
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
          if (idx !== -1) {
            factories.value[idx] = { ...modalData.factory };
          } else {
            factories.value.push({ ...modalData.factory });
          }
          saveFactories();
          closeModal();
        };

        // --- WHATSAPP DISPATCH METHODS ---
        const openDispatchModal = (order) => {
          modalData.title = `WhatsApp Factory Dispatch (Order ${order.id})`;
          modalData.order = reactive({ ...order });
          // Default to highest ranked factory
          modalData.selectedFactoryId = rankedFactories.value.length > 0 ? rankedFactories.value[0].id : '';
          activeModal.value = 'dispatchModal';
        };

        const getWhatsAppPayloadText = (order, factoryId) => {
          if (!order) return '';
          const targetFactory = factories.value.find(f => f.id === factoryId) || factories.value[0];
          const factoryName = targetFactory ? targetFactory.name : 'Factory Partner';

          let payload = `🏭 *HOMEAURA PRODUCTION ORDER DISPATCH*
`;
          payload += `------------------------------------
`;
          payload += `*Target Factory:* ${factoryName}
`;
          payload += `*Order Ref:* ${order.id}
`;
          payload += `*Consignment No (CN):* ${order.cnNumber || 'N/A'}
`;
          payload += `*Factory Invoice No:* ${order.invoiceNumber || 'N/A'}
`;
          payload += `*Date:* ${order.timestamp}
`;
          payload += `*Product:* ${order.productCategory} (${order.seatConfig})
`;
          payload += `*Design Code:* ${order.designCode}
`;
          payload += `*Client Name:* ${order.customerName}
`;
          payload += `*Client Contact:* ${order.customerPhone}
`;
          payload += `*Delivery Address:* ${order.customerAddress}
`;
          if (order.extraDetails) payload += `*Fabric & Specs:* ${order.extraDetails}
`;
          if (order.notes) payload += `*Special Notes:* ${order.notes}
`;
          if (order.collagePhotoFileName) payload += `*Local Attachment:* ${order.collagePhotoFileName}
`;
          if (order.collagePhotoUrl && !order.collagePhotoUrl.startsWith('data:')) payload += `*Collage Photo Link:* ${order.collagePhotoUrl}
`;
          payload += `------------------------------------
`;
          payload += `Please confirm fabric stock & production timeline.`;

          return payload;
        };

        const executeWhatsAppDispatch = async () => {
          if (!modalData.order || !modalData.selectedFactoryId) return;
          const targetFactory = factories.value.find(f => f.id === modalData.selectedFactoryId);
          if (!targetFactory) return;

          const order = modalData.order;

          // Update order's factory tag and set pipeline status to 'Factory Submit'
          const realOrder = orders.value.find(o => o.id === order.id);
          if (realOrder) {
            realOrder.factoryTag = targetFactory.name;
            realOrder.status = 'Factory Submit';
            saveOrders();
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

          // Automatically copy ONLY the image to clipboard
          try {
            if (order.collagePhotoUrl) {
              const hasCopied = await copyBothPhotosToClipboard(null, order.collagePhotoUrl);
              if (hasCopied) {
                alert('✅ Collage Photo copied to clipboard as PNG!\n\nPress Ctrl+V (or Cmd+V) to paste it directly into the WhatsApp chat once it opens.');
              } else {
                await navigator.clipboard.writeText(messageText);
                if (targetFactory.waGroupLink) {
                  alert('✅ Order Details copied to clipboard!\n\nPress Ctrl+V (or Cmd+V) to paste them into the WhatsApp group.');
                }
              }
            } else {
              await navigator.clipboard.writeText(messageText);
              if (targetFactory.waGroupLink) {
                alert('✅ Order Details copied to clipboard!\n\nPress Ctrl+V (or Cmd+V) to paste them into the WhatsApp group.');
              }
            }
          } catch (err) {
            console.error('Clipboard copy failed:', err);
            if (targetFactory.waGroupLink) {
               try {
                 await navigator.clipboard.writeText(messageText);
                 alert('Order details copied to clipboard! Paste them in the WhatsApp group.');
               } catch(e) {}
            }
          }
          window.open(waUrl, '_blank');
          closeModal();
        };

        // --- COURIER TRACKING MODAL METHODS ---
        
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
            saveOrders();
          }
          closeModal();
        };

        // --- PHOTO LIGHTBOX METHOD ---
        const openPhotoModal = (url, id) => {
          modalData.title = `Collage Photo Attachment - Order ${id || ''}`;
          modalData.url = url;
          activeModal.value = 'photoModal';
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

        // --- CATEGORY SETUP ---
        const addCategory = () => {
          if (newCategoryName.value && !categories.value.includes(newCategoryName.value)) {
            categories.value.push(newCategoryName.value);
            saveCategories();
            newCategoryName.value = '';
          }
        };

        const removeCategory = (index) => {
          categories.value.splice(index, 1);
          saveCategories();
        };

        // --- GOOGLE SHEETS CSV EXPORT ENGINE ---
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
          link.setAttribute('download', `HomeAura_Master_Ledger_Export_${new Date().toISOString().slice(0, 10)}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        // --- MODAL CONTROLS ---
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
            // One-way status enforcement for sellers
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
            orders.value[idx] = { ...modalData.order };
            saveOrders();
          }
          closeModal();
        };

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
            orderToVoid.deletedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
            deletedOrders.value.unshift(orderToVoid);
            orders.value = orders.value.filter(o => o.id !== modalData.order.id);
            saveOrders();
            saveDeletedOrders();
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
          orders.value.push(order);
          saveOrders();
          saveDeletedOrders();
        };

        const emptyTrash = () => {
          if (confirm('Are you sure you want to permanently delete all items in the trash? This action cannot be undone.')) {
            const permanentlyDeletedIds = deletedOrders.value.map(o => o.id);
            deletedOrders.value = [];
            saveDeletedOrders();
            
            // Clean up linked factory bills to remove permanently deleted orders
            let billsChanged = false;
            factoryBills.value.forEach(bill => {
              if (bill.linkedOrderIds) {
                const originalLength = bill.linkedOrderIds.length;
                bill.linkedOrderIds = bill.linkedOrderIds.filter(id => !permanentlyDeletedIds.includes(id));
                if (bill.linkedOrderIds.length !== originalLength) billsChanged = true;
              }
            });
            if (billsChanged) saveFactoryBills();
          }
        };
        
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
          
          const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
          ordersToMove.forEach(o => {
            o.deletedAt = now;
            deletedOrders.value.unshift(o);
          });
          
          orders.value = orders.value.filter(o => !toDeleteIds.includes(o.id));
          saveOrders();
          saveDeletedOrders();
          selectedOrders.value.clear();
        };
        
        const saveAppsScriptUrl = () => {
          localStorage.setItem('homeaura_apps_script_url', appsScriptUrl.value);
          alert('Apps Script Backup URL saved!');
        };
        
        const testSyncConnection = async () => {
          if (!appsScriptUrl.value) {
            syncStatusMsg.value = 'No URL provided!';
            syncStatusColor.value = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800';
            return;
          }
          isTestingSync.value = true;
          syncStatusMsg.value = 'Testing connection over the network...';
          syncStatusColor.value = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800';
          try {
            const testPayload = { _connectionTest: [{ timestamp: new Date().toISOString(), message: "Connection successful. System is online!" }] };
            await fetch(appsScriptUrl.value, {
              method: 'POST',
              
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(testPayload)
            });
            syncStatusMsg.value = 'Connection payload dispatched successfully. Please check your Google Sheet for a new tab named "_connectionTest".';
            syncStatusColor.value = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
          } catch (err) {
            syncStatusMsg.value = 'Network Error: ' + err.message;
            syncStatusColor.value = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800';
          } finally {
            isTestingSync.value = false;
          }
        };
        
        let syncTimeout = null;
        let isSyncingDown = false;
        
        function triggerAutoSync() {
          if (!appsScriptUrl.value) return;
          if (syncTimeout) clearTimeout(syncTimeout);
          syncTimeout = setTimeout(() => {
            syncTimeout = null;
            backupToGoogleSheets(true);
          }, 500); // 0.5 sec debounce for near-instant push
        };

        const syncFromGoogleSheets = async () => {
          if (!appsScriptUrl.value) return;
          if (isBackingUp.value || syncTimeout || isSyncingDown) return; // Prevent overwriting local changes that are about to be pushed
          
          isSyncingDown = true;
          try {
            const res = await fetch(appsScriptUrl.value);
            const data = await res.json();
            if (data && data.users && data.orders) {
               // Prevent overwriting the local app with a blank Google Sheet
               if (data.users.length === 0 && users.value.length > 0) {
                 // The remote sheet is empty, but we have local data. Push to seed the sheet.
                 triggerAutoSync();
                 return;
               }

               // Only overwrite if the remote sheet has actual users
               if (data.users.length > 0) {
                 users.value = data.users;
                 orders.value = data.orders;
                 deletedOrders.value = data.deletedOrders || [];
                categories.value = (data.categories || []).map(c => {
                   if (typeof c === 'object' && c !== null) {
                     // Heal the mangled "0":"S","1":"o","2":"f","3":"a" object back to "Sofa"
                     return Object.values(c).join('');
                   }
                   return c;
                 });
                 factories.value = data.factories || [];
                 factoryBills.value = data.factoryBills || [];
                 expenses.value = data.expenses || [];
                 
                 localStorage.setItem('homeaura_users', JSON.stringify(users.value));
                 localStorage.setItem('homeaura_orders', JSON.stringify(orders.value));
                 localStorage.setItem('homeaura_deleted_orders', JSON.stringify(deletedOrders.value));
                 localStorage.setItem('homeaura_categories', JSON.stringify(categories.value));
                 localStorage.setItem('homeaura_factories', JSON.stringify(factories.value));
                 localStorage.setItem('homeaura_factory_bills', JSON.stringify(factoryBills.value));
                 localStorage.setItem('homeaura_expenses', JSON.stringify(expenses.value));
                 
                 lastSyncTimestamp.value = new Date().toLocaleTimeString();
               }
            }
          } catch(err) {
             console.error("Silent Sync Read Error:", err);
          } finally {
             isSyncingDown = false;
          }
        };

        const backupToGoogleSheets = async (isAuto = false) => {
          if (!appsScriptUrl.value) {
            if (!isAuto) alert('Please enter and save your Google Apps Script Web App URL first.');
            return;
          }
          isBackingUp.value = true;
          try {
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
            await fetch(appsScriptUrl.value, {
              method: 'POST',
              
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(snapshot)
            });
            if (!isAuto) alert('Backup data sent to Google Sheets successfully!\n(Please allow a few moments for the sheet to update).');
          } catch (err) {
            if (!isAuto) alert('Error sending backup: ' + err.message);
            console.error('Auto-sync error:', err);
          } finally {
            isBackingUp.value = false;
          }
        };

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
          a.download = `homeaura_snapshot_${new Date().toISOString().substring(0,10)}.${fileExt}`;
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
                localStorage.setItem("homeaura_factory_bills", JSON.stringify(factoryBills.value)); triggerAutoSync();
                localStorage.setItem("homeaura_expenses", JSON.stringify(expenses.value)); triggerAutoSync();
                
                localStorage.setItem("homeaura_users", JSON.stringify(users.value)); triggerAutoSync();
                localStorage.setItem("homeaura_orders", JSON.stringify(orders.value)); triggerAutoSync();
                localStorage.setItem("homeaura_deleted_orders", JSON.stringify(deletedOrders.value)); triggerAutoSync();
                localStorage.setItem("homeaura_categories", JSON.stringify(categories.value)); triggerAutoSync();
                localStorage.setItem("homeaura_factories", JSON.stringify(factories.value)); triggerAutoSync();
                
                alert('Snapshot restored successfully! The application will now reload to apply changes.');
                window.location.reload();
                event.target.value = '';
              } else {
                alert('Invalid snapshot file format.');
              }
            } catch (err) {
              alert('Error parsing JSON file.');
            }
          };
          reader.readAsText(file);
        };


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
          if (idx !== -1) {
            users.value[idx] = { ...modalData.user };
          } else {
            modalData.user.id = 'u' + (users.value.length + 1);
            users.value.push({ ...modalData.user });
          }
          saveUsers();
          closeModal();
        };

        const toggleUserActive = (user) => {
          user.active = !user.active;
          saveUsers();
        };

        const closeModal = () => {
          activeModal.value = null;
          modalData.order = null;
          modalData.user = null;
        };

        let chartInstance = null;
        let pieChartInstance = null;

        const renderChart = () => {
          const canvas = document.getElementById('revenueChartCanvas');
          if (!canvas) return;
          
          if (chartInstance) chartInstance.destroy();
          
          // Compute daily sales based on timestamp in current month
          const daysMap = {};
          const now = new Date();
          const currentMonthStr = now.toISOString().slice(0, 7); // e.g. "2026-08"
          
          orders.value.forEach(o => {
             if (o.timestamp.startsWith(currentMonthStr)) {
                const day = o.timestamp.slice(8, 10);
                daysMap[day] = (daysMap[day] || 0) + o.totalAmount;
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
              labels: labels.map(l => l + ' ' + now.toLocaleString('default', { month: 'short' })),
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

          // Sort statuses by count descending
          const sortedStatuses = Object.keys(statusCounts).sort((a, b) => statusCounts[b] - statusCounts[a]);
          const data = sortedStatuses.map(status => statusCounts[status]);
          
          const isDark = document.body.classList.contains('dark');
          const textColor = isDark ? '#94a3b8' : '#64748b';

          // Assign distinct colors to statuses (matching our application theme)
          const backgroundColors = sortedStatuses.map(status => {
            if (status === 'Delivered') return isDark ? '#059669' : '#10b981'; // emerald
            if (status === 'Pending') return isDark ? '#d97706' : '#f59e0b'; // amber
            if (status === 'Processing') return isDark ? '#2563eb' : '#3b82f6'; // blue
            if (status === 'Shipped') return isDark ? '#4f46e5' : '#6366f1'; // indigo
            if (status === 'Returned Received') return isDark ? '#e11d48' : '#f43f5e'; // rose
            if (status === 'Returned from Customer') return isDark ? '#be123c' : '#e11d48'; // rose darker
            if (status === 'Partial Delivered') return isDark ? '#0891b2' : '#06b6d4'; // cyan
            return isDark ? '#475569' : '#94a3b8'; // default slate
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
                duration: 1000,
                easing: 'easeOutQuart'
              },
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    color: textColor,
                    usePointStyle: true,
                    padding: 15,
                    font: { size: 11, family: "'Inter', sans-serif" }
                  }
                },
                tooltip: {
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  titleColor: isDark ? '#f8fafc' : '#0f172a',
                  bodyColor: isDark ? '#cbd5e1' : '#475569',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  borderWidth: 1,
                  padding: 10,
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

        watch(orders, () => {
          if (activeTab.value === 'dashboard') {
            Vue.nextTick(() => {
              renderChart();
              renderPieChart();
            });
          }
        }, { deep: true });
        
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

        onMounted(() => {
          applyDarkMode();
          loadInitialData();
          syncFromGoogleSheets();
          
          if (activeTab.value === 'dashboard') {
            Vue.nextTick(() => {
              renderChart();
              renderPieChart();
            });
          }

          // Real-time Database Polling
          setInterval(() => {
            if (appsScriptUrl.value) {
              syncFromGoogleSheets();
            }
          }, 5000);

          window.addEventListener('paste', (e) => {
            if (!selectedProofTile.value) return;

            // Check if user is actively typing inside text inputs/textareas
            const activeElem = document.activeElement;
            const tag = activeElem ? activeElem.tagName.toLowerCase() : '';
            const isTextInput = tag === 'textarea' || (tag === 'input' && activeElem.type === 'text');

            if (isTextInput) {
              // If clipboard items contain an image, process screenshot proof
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
              if (!hasImage) return; // Allow normal text paste inside text fields
            }

            if (selectedProofTile.value === 'terminal') {
              handleProofPaste(e, intakeForm);
            } else if (selectedProofTile.value === 'modal') {
              if (modalData.order) handleProofPaste(e, modalData.order);
              if (modalData.bill) handleProofPaste(e, modalData.bill); // Support pasting photoUrl into bill
            }
          });
        });

        // Setup deep watchers to trigger auto-sync on any data change
        watch(
          [users, orders, deletedOrders, categories, factories, factoryBills],
          () => {
            triggerAutoSync();
          },
          { deep: true }
        );

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
          deletedOrders,
          selectedOrders,
          restoreOrder,
          emptyTrash,
          toggleOrderSelection,
          toggleAllSelection,
          bulkDeleteSelected,
          appsScriptUrl,
          isBackingUp,
          isTestingSync,
          syncStatusMsg,
          syncStatusColor,
          testSyncConnection,
          isBackingUp,
          saveAppsScriptUrl,
          backupToGoogleSheets,
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
          closeModal
        };
      }
    }).mount('#app');
