const fs = require('fs');
const path = require('path');

function resetUserLimits() {
  const usersPath = path.join(__dirname, '../database/data/users.json');
  const users = JSON.parse(fs.readFileSync(usersPath));

  for (let user of users) {
    user.currentLimit = user.limit;
  }

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  console.log(`[RESET] Semua user telah direset pada ${new Date().toLocaleString()}`);
}

module.exports = resetUserLimits;
