const fs = require("fs");

module.exports = function(app) {
  app.get('/system/delete-users', (req, res) => {
    const { username, secretcode } = req.query;
    
    if (!username || !secretcode)
      return res.status(400).json({ status: false, error: "Username or secretcode parameter is required!" });
    
    if (secretcode !== "zabsxzeta")
      return res.status(404).json({ status: false, error: "Secretcode invalid! Are you really admin?" });

    try {
      const usersPath = "./lib/database/data/users.json";
      const users = JSON.parse(fs.readFileSync(usersPath));

      const index = users.findIndex(user => user.username === username);
      if (index === -1) {
        return res.status(400).json({ status: false, error: "Username is not valid!" });
      }

      users.splice(index, 1);
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

      res.status(200).json({
        status: true,
        creator: "Zaboy",
        data: {
          username,
          message: `Berhasil menghapus ${username} dari database!`
        }
      });
    } catch (e) {
      res.status(500).json({ status: false, error: e.message });
    }
  });
};
