const axios = require("axios");
const qs = require("qs");

async function snapins(url) {
  const data = qs.stringify({
    url: url,
    action: "post",
  });
  
  const anu = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://snapins.ai",
    "Referer": "https://snapins.ai"
  };
  
  try {
    const res = await axios.post(
      "https://snapins.ai/action.php",
      data,
      { headers: anu }
    )
    return res.data
  } catch (e) {
    return e.response?.data || e.message
  }
}

module.exports = {
  name: "Instagram Downloaders",
  desc: "Download instagram content with snapins.ai",
  category: "Downloaders",
  params: ["url"],
  apikey: true,
  async run(req, res) {
    try {
      const { url } = req.query;
      if (!url) return res.status(400).json({ status: false, error: "Url parameter is required!"})
      
      logRequest(req.path);
      
      const anu = await snapins(url);
      if (!anu.data) return "Hasil tidak ditemukan!"

      const finalData = anu.data.map((item, index) => {
        return {
          id: item.id || `media-${index}`,
          type: item.type || (item.videoUrl ? 'video' : 'image'),
          videoUrl: item.videoUrl || null,
          imageUrl: item.imageUrl || null
        };
      });
      

      return res.status(200).json({
        status: true,
        result: finalData
      })
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message })
    }
  }
}
