const fs = require('fs');
const path = require('path');

function saveUsers(users) {
    fs.writeFileSync(path.join(__dirname, '../database/data/users.json'), JSON.stringify(users, null, 2));
}

module.exports = function (req, res, next) {
    const apikey = req.query.apikey || req.headers['x-api-key'];
    if (!apikey) return res.status(403).json({ status: false, message: 'API key is required' });

    const usersPath = path.join(__dirname, '../database/data/users.json');
    const users = JSON.parse(fs.readFileSync(usersPath));
    const userIndex = users.findIndex(u => u.apikey === apikey.toLowerCase());

    if (userIndex === -1) return res.status(403).json({ status: false, message: 'Invalid API key' });

    const user = users[userIndex];

    if (user.currentLimit !== null && user.currentLimit <= 0) {
        return res.status(429).json({ status: false, message: 'Limit habis' });
    }

    if (user.currentLimit !== null) {
        users[userIndex].currentLimit -= 1;
        saveUsers(users);
    }

    req.user = user;
    next();
};