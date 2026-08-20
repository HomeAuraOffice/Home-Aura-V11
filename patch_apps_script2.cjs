const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const target3 = `    if (historySheet.getLastRow() > 1000) historySheet.deleteRows(2, 200);
  } catch(e) {}
}\`;`;

const replace3 = `    if (historySheet.getLastRow() > 1000) historySheet.deleteRows(2, 200);
  } catch(e) {}
}

function distributeOrdersBySeller() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var orders = sheetToObjects("orders");
  var users = sheetToObjects("users");
  
  var idToUsername = {};
  var allUsernames = {};
  users.forEach(function(u) {
    if (u && u.id && u.username) {
      idToUsername[u.id] = u.username;
      allUsernames[u.username] = true;
    }
  });
  
  var sellerOrders = {};
  Object.keys(allUsernames).forEach(function(username) {
    sellerOrders[username] = [];
  });
  
  orders.forEach(function(o) {
    if (o && o.merchantId) {
      var username = idToUsername[o.merchantId] || String(o.merchantId);
      if (!sellerOrders[username]) sellerOrders[username] = [];
      sellerOrders[username].push(o);
    }
  });
  
  Object.keys(sellerOrders).forEach(function(username) {
    var sheetName = "Orders_" + username;
    var userOrders = sellerOrders[username];
    objectsToSheetAtomic(sheetName, userOrders);
  });
}
\`;`;

code = code.replace(target3, replace3);
fs.writeFileSync('app.js', code);
