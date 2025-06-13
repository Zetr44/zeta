module.exports = {
  name: "Anime Search",
  desc: "Search Anime From Anilist.",
  category: "Search",
  params: ["q"],
  apikey: true,
  async run(req, res) {
    const q = req.query.q
    if (!q) {
      return res.status(500).json("query is required!")
    }

    try {
      logRequest(req.path);
      
      const resoeld = await scrape.searchAnime(q)
      return res.status(200).json({
        status: true,
        data: resoeld,
      })
      
    } catch (err) {
      return res.status(500).json("Gagal mengambil data: " + err.message)
    }
  },
}
