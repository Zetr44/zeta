module.exports = {
  name: "Tiktok Downloaders",
  desc: "Download Tiktok Content",
  category: "Downloaders",
  params: ["url"],
  apikey: true,
  async run(req, res) {
  const { url } = req.query;
  if (!url || !url.startsWith("https://")) {
    return res.status(400).json({ status: false, message: "Masukkan URL yang valid!" });
  }
  
  try {
    logRequest(req.path);
  
    const result = await scrape.tiktokDl(url);
    if (!result.status) return res.json({ status: false, message: "Gagal fetch data" });

    if (result.duration === "0 Seconds" || result.durations === 0) {
      const images = result.data.map((item, i) => ({
        index: i + 1,
        image_url: item.url
      }));
      return res.status(200).json({
        status: true,
        type: "slideshow",
        count: images.length,
        data: images
      });
    } else {
      const video = result.data.find(e => e.type === "nowatermark_hd" || e.type === "nowatermark");
      return res.status(200).json({
        status: true,
        type: "video",
        video_url: video?.url || null
      });
    }
  } catch (err) {
    return res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
  },
}