const axios = require("axios")

module.exports = {
  name: "Shortlink",
  desc: "Shorten any URL using TinyURL",
  category: "Tools",
  params: ["url"],
  apikey: true,
  async run(req, res) {
    const { url } = req.query
    if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' is required" })
    
    try {
    logRequest(req.path);
      const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`)
      return res.status(200).json({
        status: true,
        result: {
          original: url,
        short: data
        }
      })
      
    } catch (err) {
      return res.status(500).json({ status: false, message: "Failed to shorten URL", error: err.message })
    }
  },
}
