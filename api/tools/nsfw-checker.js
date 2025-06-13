const axios = require("axios");
const fetch = require("node-fetch");
const FormData = require("form-data")
const path = require("path");

async function isNsfw(url) {
  try {
  const ext = path.extname(new URL(url).pathname) || ".jpg"
  
  const response = await fetch(url);
  const buffer = await response.buffer();
  
  if (buffer.length === 0) {
    return "Buffer kosong, action stopped."
  }
  
  const fileName = `Zabs-${Math.random().toString(36).slice(2, 10)}${ext}`;
  const form = new FormData()
  form.append("image", buffer, {
    filename: fileName,
    contentType: response.headers.get("content-type") || "application/octet-stream"
  })
  
  const headers = {
    ...form.getHeaders(),
    accept: "application/json",
    "x-requested-with": "XMLHttpRequest"
  }
  
  const res = await fetch("https://nsfw-categorize.it/api/upload", {
    method: "POST",
    headers,
    body: form
  })
  
  const result = await res.json();
  return result;
  } catch (e) {
    return e.response?.data || e.message
  }
}

module.exports = {
  name: "NSFW Checker",
  desc: "Analyze a piece of media and categorize it as nsfw or not",
  category: "Tools",
  params: ["url"],
  apikey: true,
  async run(req, res) {
    try {
      const { url } = req.query;
      if (!url) return res.status(400).json({ status: false, error: "Url parameter is required!"})
      
      logRequest(req.path);
      
      const resdata = await isNsfw(url);
      return res.status(200).json({
        status: true,
        result: resdata.data
      })
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message })
    }
  }
}