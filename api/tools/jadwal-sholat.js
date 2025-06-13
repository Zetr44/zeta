const SuzakuTeam = require("@suzakuteam/scraper-node");

module.exports = {
  name: "Jadwal Sholat",
  desc: "Find out today's prayer schedule by city",
  category: "Tools",
  params: ["kota"],
  apikey: true,
  async run(req, res) {
    try {
      const { kota } = req.query;
      if (!kota) return res.status(400).json({ status: false, error: "Kota parameter is required!" });
      
      logRequest(req.path);
      
      const { SuzakuTeam } = require("@suzakuteam/scraper-node");

      const data = await SuzakuTeam.info.jadwalSholat(kota);
        
      const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta'
      });
        
      const jadwalHariIni = data.find(item => item.tanggal === today);
      return res.status(200).json({
        status: true,
        result: jadwalHariIni
      });
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message });
    };
  }
}