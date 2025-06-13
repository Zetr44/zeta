const fs = require("fs");

module.exports = {
  name: "Tebak bendera",
  desc: "Tebak nama negara berdasarkan bendera.",
  category: "Game",
  async run(req, res) {
    try {
      logRequest(req.path);
      
      const jsf = JSON.parse(fs.readFileSync("./lib/database/data/g_tebakbendera.json"));
      const ress = await jsf[Math.floor(jsf.length * Math.random())];
      const flags = `https://flagpedia.net/data/flags/ultra/${ress.id}.png`;
      
      return res.status(200).json({
        status: true,
        result: {
          image: flags,
          jawaban: ress.name
        }
      })
      
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message })
    }
  },
}
