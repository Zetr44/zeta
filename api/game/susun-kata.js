const fs = require("fs");

module.exports = {
  name: "Susun Kata",
  desc: "Susun potongan huruf acak menjadi sebuah kata",
  category: "Game",
  async run(req, res) {
    try {
      logRequest(req.path);
      
      const jsf = JSON.parse(fs.readFileSync("./lib/database/data/g_susunkata.json"));
      const ress = await jsf[Math.floor(jsf.length * Math.random())];
      
      return res.status(200).json({
        status: true,
        result: ress
      })
      
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message })
    }
  },
}
