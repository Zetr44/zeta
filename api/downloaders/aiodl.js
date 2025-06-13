const SuzakuTeam = require("@suzakuteam/scraper-node");

module.exports = {
  name: "All In One Downloaders",
  desc: "https://allinonedownloader.com",
  category: "Downloaders",
  params: ["url"],
  apikey: true,
  async run(req, res) {
    try {
      const { url } = req.query;
      if (!url) return res.status(400).json({ status: false, error: "Url parameter is required!" });
      
      logRequest(req.path);
      
      const zontol = await SuzakuTeam.downloader.allinonedownloader(url);
      return res.status(200).json({
        status: true,
        results: zontol
      });
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message });
    };
  }
}