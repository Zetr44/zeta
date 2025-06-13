const fetch = require("node-fetch");

const dl = async (url) => {
  const baseUrl = `https://pinterestdownloader.io/frontendService/DownloaderService?url=${encodeURIComponent(url)}`;
    const head = {
      "referer": "https://pinterestdownloader.io/",
      "accept": "*/*"
    };
  try {
    const res = await fetch(baseUrl, { method: "GET", headers: head });
    return res.json()
  } catch (e) {
    throw new Error(e.message);
  }
}

module.exports = {
  name: "Pinterest Downloader",
  desc: "Download pinterest content",
  category: "Downloaders",
  params: ["url"],
  apikey: true,
  async run(req, res) {
    try {
      const { url } = req.query;
      if (!url) return res.status(400).json({ status: false, error: "Url parameter is required!" })
      
      logRequest(req.path);
      
      const ruwet = await dl(url);
      const mumet = ruwet.medias?.length > 1 ? ruwet.medias[2] : ruwet.medias;
      return res.status(200).json({
        status: true,
        result: mumet
      })
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message })
    }
  }
}