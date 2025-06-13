const fs = require("fs");

module.exports = function(app) {
  app.get('/system/update-apikey', (req, res) => {
    const { username, newkey, newlimit, secretcode } = req.query;

    if (!username || !newkey || !newlimit || !secretcode)
      return res.status(400).json({ status: false, error: "Username, Newkey, Newlimit, Secretcode parameter is required!" });

    if (secretcode !== "zabsxzeta")
      return res.status(403).json({ status: false, error: "Secretcode invalid! Are you really admin?" });

    try {
      const filePath = "./lib/database/data/users.json";
      const users = JSON.parse(fs.readFileSync(filePath));

      const index = users.findIndex(user => user.username === username);
      if (index === -1)
        return res.status(404).json({ status: false, error: "Username is not valid!" });

      if (users.some((user, i) => user.apikey === newkey.toLowerCase() && i !== index))
        return res.status(400).json({ status: false, error: "Newkey already taken!" });

      const unliKeywords = ["unli", "unlimited", "infinity", "inf", "unlimit", "null"];
      let limid;
      if (!isNaN(newlimit)) {
        limid = parseInt(newlimit);
      } else if (unliKeywords.includes(newlimit.toLowerCase())) {
        limid = null;
      } else {
        return res.status(400).json({ status: false, error: "Newlimit must be a number or 'unlimited'!" });
      }

      const oldUser = users[index];

      const updatedUser = {
        username: oldUser.username,
        password: oldUser.password, 
        apikey: newkey.toLowerCase(),
        limit: limid,
        currentLimit: limid
      };

      users[index] = updatedUser;
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

      res.status(200).json({
        status: true,
        creator: "Zaboy",
        result: {
          username,
          newkey,
          newlimit,
          message: "Berhasil update apikey & limit!"
        }
      });

    } catch (e) {
      res.status(500).json({ status: false, error: e.message });
    }
  });
};