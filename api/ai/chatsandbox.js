const fs = require("fs");
const axios = require('axios');

async function chatsandbox(prompt) {
  const h = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://chatsandbox.com/chat/openai'
  };
  
  const data = {
    messages: [prompt],
    character: 'openai'
  };
  
  try {
    const res = await axios.post('https://chatsandbox.com/api/chat', data, {
      headers: h,
      decompress: true
    });
    return res.data;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

module.exports = {
  name: "Chat Sandbox",
  desc: "Chat AI. gpt4o Ai Model",
  category: "AI",
  params: ["text"],
  apikey: true,
  async run(req, res) {
    try {
      const { text } = req.query;
      if (!text) return res.status(400).json({ status: false, error: "Text is required" });
      
      logRequest(req.path);
      
      const ress = await chatsandbox(text);
      return res.status(200).json({
        status: true,
        result: {
          text: text,
          answer: ress
        }
      });
      
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message });
    }
  },
}
