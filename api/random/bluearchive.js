const axios = require("axios")

module.exports = {
  name: "Blue Archive",
  desc: "Blue archive random image",
  category: "Random",
  apikey: true,
  async run(req, res) {
    try {
      logRequest(req.path);
      
      const { data } = await axios.get(
        `https://raw.githubusercontent.com/rynxzyy/blue-archive-r-img/refs/heads/main/links.json`,
      )
      const response = await axios.get(data[Math.floor(data.length * Math.random())], { responseType: "arraybuffer" })
      const pedo = Buffer.from(response.data)
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": pedo.length,
      })
      return res.end(pedo)
      
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message })
    }
  },
}
