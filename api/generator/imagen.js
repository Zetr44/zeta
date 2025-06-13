const fs = require("fs");

module.exports = {
  name: "Image Generator",
  desc: "Create an image using a custom text.",
  category: "Generator",
  params: ["text"],
  apikey: true,
  async run(req, res) {
    try {
      const { text } = req.query;
      if (!text) return res.status(400).json({ status: false, error: "Text is required" });
      
      logRequest(req.path);
      
      const ress = await scrape.pollinations(text);
      return res.status(200).json({
        status: true,
        result: {
          prompt: text,
          image: ress
        }
      });
      
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message });
    }
  },
}