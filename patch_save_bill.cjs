const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const targetLogic = `          modalData.bill.linkedOrderIds = (modalData.bill.linkedOrderIds || []).filter(id => {
            const o = allOrders.find(ord => ord.id === id);
            return o && o.factoryTag === factoryName;
          });`;

const replaceLogic = `          modalData.bill.linkedOrderIds = (modalData.bill.linkedOrderIds || []).filter(id => {
            const o = allOrders.find(ord => ord.id === id);
            if (!o) return false;
            if (o.factoryTag !== factoryName) return false;
            if (modalData.bill.sellerId && o.merchantId !== modalData.bill.sellerId) return false;
            return true;
          });`;

code = code.replace(targetLogic, replaceLogic);

fs.writeFileSync('app.js', code);
