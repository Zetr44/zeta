const fs = require("fs");

module.exports = function(app) {
  app.get('/system/create-users', async (req, res) => {
    const { username, password, userkey, limit, secretcode } = req.query;

    if (!username || !password || !userkey || !limit || !secretcode) {
      return res.status(400).json({ status: false, error: "Username, Password, Userkey, Limit, Secretcode parameter is required!" });
    }

    if (secretcode !== "zabsxzeta") {
      return res.status(404).json({ status: false, error: "Secretcode invalid! Are you really admin?" });
    }

    try {
      const users = JSON.parse(fs.readFileSync("./lib/database/data/users.json"));

      if (users.some(user => user.username === username)) {
        return res.status(400).json({ status: false, error: "Username already taken!" });
      }

      if (users.some(user => user.apikey === userkey.toLowerCase())) {
        return res.status(400).json({ status: false, error: "Userkey already taken!" });
      }

      const unliKeywords = ["unli", "unlimited", "infinity", "inf", "unlimit", "null"];
      let limid;

      if (!isNaN(limit)) {
        limid = parseInt(limit);
      } else if (unliKeywords.includes(limit.toLowerCase())) {
        limid = null;
      } else {
        return res.status(400).json({ status: false, error: "Limit only can be a number or 'infinity'!" });
      }

      const input = {
        username: username,
        password: password,
        apikey: userkey.toLowerCase(),
        limit: limid,
        currentLimit: limid
      };

      users.push(input);
      fs.writeFileSync("./lib/database/data/users.json", JSON.stringify(users, null, 2));

      res.status(200).json({
        status: true,
        creator: "Zaboy",
        result: input
      });

    } catch (e) {
      res.status(500).json({ status: false, error: e.message });
    }
  });
};
