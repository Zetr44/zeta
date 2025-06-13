const SuzakuTeam = require("@suzakuteam/scraper-node");

module.exports = {
  name: "Roblox Stalk",
  desc: "Get roblox account info by username",
  category: "Stalk",
  params: ["username"],
  apikey: true,
  async run(req, res) {
    try {
      const { username } = req.query;
      if (!username) return res.status(400).json({ status: false, error: "Username parameter is required!" });
      
      logRequest(req.path);
      
      const rezz = await SuzakuTeam.stalker.roblox(username);
      return res.status(200).json({
        status: true,
        result: rezz.result
      });
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message });
    };
  }
}