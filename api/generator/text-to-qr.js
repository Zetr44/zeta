const QRCode = require("qrcode")
module.exports = {
  name: "Text to QR Code",
  desc: "Convert text to qr code",
  category: "Generator",
  params: ["text"],
  apikey: true,
  async run(req, res) {
    const text = req.query.text

    if (!text) {
      return res.status(400).json("Text parameter is required!")
    }
    
    try {
    logRequest(req.path);
      const buffer = await QRCode.toBuffer(text, {
        type: "png",
        errorCorrectionLevel: "H",
        scale: 8,
      })

      res.setHeader("Content-Type", "image/png")
      return res.send(buffer)
      
    } catch (err) {
      return res.status(500).json("Gagal membuat QR Code.")
    }
  },
}
