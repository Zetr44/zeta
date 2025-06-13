const axios = require('axios')

module.exports = {
  name: "Remove Background",
  desc: "Remove image background instantly and quickly",
  category: "Tools",
  params: ["url"],
  apikey: true,
  async run(req, res) {
    try {
      const { url } = req.query;
      if (!url) return res.status(400).json({ status: false, error: "Url parameters is required!" })
      if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
        return res.status(400).json({ status: false, error: "Invalid image URL" });
      };
      
      logRequest(req.path);
      
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data);
      const mime = response.headers["content-type"] || "image/jpeg";
      const base64 = `data:${mime};base64,${buffer.toString("base64")}`;


      const filename = `Fiony-${Math.floor(Math.random() * 99999)}.${mime.split("/")[1]}`;
      const { data } = await axios.post(
        "https://background-remover.com/removeImageBackground",
        {
          encodedImage: base64,
          title: filename,
          mimeType: mime
        },
        {
          headers: {
            accept: "*/*",
            "content-type": "application/json; charset=utf-8",
            referer: "https://background-remover.com/upload"
          }
        }
      );

      const resultBase64 = data.encodedImageWithoutBackground?.split(",")[1];
      if (!resultBase64) return res.status(500).json({ status: false, error: "Gagal menghapus background." });

      const resultBuffer = Buffer.from(resultBase64, "base64");
      const resultMime = mime;

      res.setHeader("Content-Type", resultMime);
      return res.send(resultBuffer);
      
    } catch (e) {
      return res.status(500).json({ status: false, message: "An error catched!", error: e.message })
    }
  }
}