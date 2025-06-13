const fs = require("fs");

async function gpt4(promptnya) {
  const url = 'https://api.llm7.io/v1/chat/completions';
  const body = {
    model: 'gpt-4.1-nano', // model bisa diubah selain ini, banyak varian. 👌🏻
    temperature: 1,
    stream: false,
    messages: [
      { role: 'system', content: 'Gunakan bahasa Indonesia apapun yang terjadi, kecuali jika ada yang memintamu menggunakan bahasa lain.' },
      { role: 'user', content: promptnya }
    ]
  };

  const jantung = {
    'content-type': 'application/json',
    'accept': 'application/json',
    'referer': 'https://llm7.io/'
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: jantung,
      body: JSON.stringify(body)
    });

    const json = await res.json();
    const reply = json?.choices?.[0]?.message?.content;

    return reply || 'error: Tidak ada respons dari model.';
  } catch (e) {
    return 'error: ' + JSON.stringify(e.message || e, null, 2);
  }
}

module.exports = {
  name: "GPT4 AI",
  desc: "Chat AI. gpt4-nano Ai Model",
  category: "AI",
  params: ["text"],
  apikey: true,
  async run(req, res) {
    try {
      const { text } = req.query;
      if (!text) return res.status(400).json({ status: false, error: "Text is required" });
      
      logRequest(req.path);
      
      const ress = await gpt4(text);
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