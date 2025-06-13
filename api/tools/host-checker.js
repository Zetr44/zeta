const { SuzakuTeam } = require("@suzakuteam/scraper-node");

module.exports = {
  name: "Host Checker",
  desc: "Get host detail info.",
  category: "Tools",
  params: ["IP"],
  apikey: true,
  async run(req, res) {
    try {
      const { IP } = req.query;
      if (!IP) return rws.status(400).json({ status: false, error: "IP parameter is required!"})
      
      logRequest(req.path);
      
      const el = await SuzakuTeam.tools.checkHost(IP);
      return res.status(200).json({
        status: true,
        results: el
      })
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message })
    }
  }
}
