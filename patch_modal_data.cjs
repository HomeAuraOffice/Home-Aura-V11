const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

code = code.replace(
  /modalData\.bill = reactive\(\{ factoryId: '', amount: '', overcharge: '', date: getBangladeshDateString\(new Date\(\)\), notes: '', linkedOrderIds: \[\], photoUrl: '' \}\);/,
  "modalData.bill = reactive({ factoryId: '', sellerId: '', amount: '', overcharge: '', date: getBangladeshDateString(new Date()), notes: '', linkedOrderIds: [], photoUrl: '' });"
);

code = code.replace(
  /modalData\.expense = reactive\(\{ date: getBangladeshDateString\(new Date\(\)\), category: 'Salary', amount: '', description: '' \}\);/,
  "modalData.expense = reactive({ date: getBangladeshDateString(new Date()), sellerId: '', category: 'Salary', amount: '', description: '' });"
);

fs.writeFileSync('app.js', code);
