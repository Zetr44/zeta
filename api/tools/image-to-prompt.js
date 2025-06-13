const axios = require('axios');

async function imageToPrompt(url) {
  if (!url) throw new Error("URL is required");

  const imgRes = await axios.get(url, { responseType: 'arraybuffer' });
  const mime = imgRes.headers['content-type'] || 'image/jpeg';
  const base64Image = Buffer.from(imgRes.data).toString('base64');

  const response = await axios.post(
    'https://api.novita.ai/v3/img2prompt',
    { image_file: base64Image },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_2Q2XGkWMcGlXOQ22S7478lHzSqtrQjRvMJVO3-ylbu0' 
      }
    }
  );

  const prompt = response.data?.prompt || response.data;
  if (!prompt) throw new Error("Prompt not generated");

  return prompt;
};

module.exports = {
  name: "Image Prompt",
  desc: "Make an image into a prompt",
  category: "Tools",
  params: ["url"],
  apikey: true,
  async run(req, res) {
    try {
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ status: false, error: "Url parameter is required!" });
      }

      if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
        return res.status(400).json({ status: false, error: "Invalid image URL" });
      }

      logRequest(req.path);

      const prompt = await imageToPrompt(url);
      if (!prompt) {
        return res.status(500).json({ status: false, error: "No prompt generated!" });
      }

      return res.status(200).json({
        status: true,
        result: {
          image: url,
          prompt: prompt
        }
      });

    } catch (e) {
      return res.status(500).json({
        status: false,
        message: "An error catched!",
        error: e.response?.data || e.message
      });
    }
  }
};
