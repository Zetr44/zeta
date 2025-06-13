const fs = require('fs');
const path = './lib/database/data/stats.json';

function readStats() {
  if (!fs.existsSync(path)) {
    return { totalRequest: 0, today: {}, totalEndpoints: 0 };
  }
  return JSON.parse(fs.readFileSync(path));
}

function writeStats(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = function logRequest(endpoint) {
  const stats = readStats();
  const today = new Date().toISOString().slice(0, 10);

  stats.totalRequest++;
  stats.today[today] = (stats.today[today] || 0) + 1;

  writeStats(stats);
}