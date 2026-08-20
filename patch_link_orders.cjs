const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetHtml = `<div v-for="ord in [...orders, ...deletedOrders].filter(o => modalData.bill.factoryId ? o.factoryTag === getFactoryName(modalData.bill.factoryId) : true)" :key="ord.id" class="flex items-center gap-2 p-1.5 hover:bg-white dark:hover:bg-slate-900 rounded">`;

const replaceHtml = `<div v-for="ord in [...orders, ...deletedOrders].filter(o => {
                      if (modalData.bill.factoryId && o.factoryTag !== getFactoryName(modalData.bill.factoryId)) return false;
                      if (modalData.bill.sellerId && o.merchantId !== modalData.bill.sellerId) return false;
                      return true;
                    })" :key="ord.id" class="flex items-center gap-2 p-1.5 hover:bg-white dark:hover:bg-slate-900 rounded">`;

html = html.replace(targetHtml, replaceHtml);

fs.writeFileSync('index.html', html);
