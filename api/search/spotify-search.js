const SuzakuTeam = require("@suzakuteam/scraper-node");

module.exports = {
  name: "Spotify Search",
  desc: "Search for songs from spotify",
  category: "Search",
  params: ["q"],
  apikey: true,
  async run(req, res) {
    try {
      const { q } = req.query;
      if (!q) return res.status(400).json({ status: false, error: "Query parameter is required!" });
      
      logRequest(req.path);
      
      const rez = await SuzakuTeam.search.spotify(q);
      if (rez && rez.success) {
      return res.status(200).json({
        status: true,
        results: rez.response
      });
      } else {
        return res.status(500).json({ status: false, error: "No results found!"})
      };
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message });
    };
  }
}
