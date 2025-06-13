const axios = require("axios");
const https = require("https");
const qs = require("qs");

const pins = async (query) => {
  const agent = new https.Agent({ keepAlive: true });
  try {
    const home = await axios.get('https://www.pinterest.com/', {
      httpsAgent: agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      }
    })
    const raw = home.headers['set-cookie'] || []
    const cookies = raw.map(c => c.split(';')[0]).join('; ')
    const csrf = (raw.find(c => c.startsWith('csrftoken=')) || '')
      .split('=')[1]?.split(';')[0] || ''

    const source_url = `/search/pins/?q=${encodeURIComponent(query)}`
    const data = {
      options: { query, field_set_key: 'react_grid_pin', is_prefetch: false, page_size: 25 },
      context: {}
    }
    const body = qs.stringify({ source_url, data: JSON.stringify(data) })

    const res = await axios.post(
      'https://www.pinterest.com/resource/BaseSearchResource/get/',
      body,
      {
        httpsAgent: agent,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-CSRFToken': csrf,
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': 'https://www.pinterest.com',
          'Referer': `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`,
          'Cookie': cookies
        }
      }
    )

    const pinus = res.data.resource_response.data.results
      .map(p => ({
        title: p.title || p.grid_title || "",
        link: `https://www.pinterest.com/pin/${p.id}/`,
        author: {
          name: p.native_creator?.full_name || "",
          username: p.native_creator?.username || ""
        },
        upload_date: p.created_at || ""
      }))
    return pinus

  } catch (e) {
    return { error: e.message }
  }
}

module.exports = {
  name: "Pinterest Search",
  desc: "Search image from pinterest",
  category: "Search",
  params: ["q"],
  apikey: true,
  async run(req, res) {
    try {
      const { q } = req.query;
      if (!q) return res.status(400).json({ status: false, error: "Query parameter is required!"});
      
      logRequest(req.path);
      
      const rees = await pins(q);
      return res.status(200).json({
        status: true,
        results: rees
      })
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message })
    }
  }
}