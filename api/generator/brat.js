const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

async function brat(text) {
    const timestamp = Date.now();
    const tempFilePath = path.join(__dirname, `brat${timestamp}_raw.png`);
    const finalPath = path.join(__dirname, `brat${timestamp}.png`);
    
    const browser = await chromium.launch({ headless: true });

    try {
        const context = await browser.newContext({
          viewport: { width: 375, height: 667 },
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) " +
                     "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 " +
                     "Mobile/15E148 Safari/604.1"
        });

        const page = await context.newPage();
        await page.goto("https://www.bratgenerator.com");

        const consentButtonSelector = "#onetrust-accept-btn-handler";
        if (await page.$(consentButtonSelector)) {
            await page.click(consentButtonSelector);
            await page.waitForTimeout(500);
        }

        await page.click("#toggleButtonWhite");
        await page.fill("#textInput", text);
        await page.locator("#textOverlay").screenshot({ path: tempFilePath });

        await sharp(tempFilePath)
          .resize({
            fit: "contain",
            width: 720,
            height: 720,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .toFile(finalPath);

        fs.unlinkSync(tempFilePath);
        return finalPath;

    } catch (e) {
        throw e;
    } finally {
        await browser.close();
    }
};

module.exports = {
  name: "Brat Generator",
  deac: "Make a brat image",
  category: "Generator",
  params: ["text"],
  apikey: true,
  async run(req, res) {
    try {
      const { text } = req.query;
      if (!text) return res.status(400).json({ status: false, error: "Text parameter is required!"});
      
      logRequest(req.path);

      const fPath = await brat(text);
      res.setHeader("Content-Type", "image/png");
      
      res.sendFile(fPath, (err) => {
        fs.unlink(fPath, () => {});
      });

    } catch (e) {
      return res.status(500).json({ status: false, error: e.message });
    }
  }
};
