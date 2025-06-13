const android1 = require("../../lib/scrape_file/android1.js")
module.exports = {
  name: "Android1",
  desc: "Search modded game on android1",
  category: "Search",
  params: ["q"],
  apikey: true,
  async run(req, res) {
    const { q } = req.query
    if (!q) return res.status(400).json({ status: false, error: "Query is required" })

    try {
      logRequest(req.path);
      
      const result = await android1.search(q)
      return res.status(200).json({
        status: true,
        result,
      })
      
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message })
    }
  },
}
