const SuzakuTeam = require("@suzakuteam/scraper-node");

module.exports = {
  name: "Spotify Downloaders",
  desc: "Download songs from spotify",
  category: "Downloaders",
  params: ["url"],
  apikey: true,
  async run(req, res) {
    try {
      const { url } = req.query;
      if (!url) return res.status(400).json({ status: false, error: "Url parameter is required!" });
      
      logRequest(req.path);
      
      const rez = await SuzakuTeam.downloader.spotify(url);
      return res.status(200).json({
        status: true,
        result: rez
      });
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message });
    };
  }
}