const axios = require("axios")

module.exports = {
  name: "Wikipedia Search",
  desc: "Search articles on Wikipedia",
  category: "Search",
  params: ["q", "limit"],
  apikey: true,
  async run(req, res) {
    const { q, limit = 5 } = req.query
    if (!q) return res.status(400).json({ status: false, error: "Query parameter 'q' is required" })

    try {
      logRequest(req.path);
      
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&srlimit=${limit}`
      const searchResponse = await axios.get(searchUrl)
      const searchResults = searchResponse.data.query.search

      if (searchResults.length === 0) {
        return res.status(200).json({
          status: true,
          creator: "Zaboy",
          result: [],
        })
      }

      const results = await Promise.all(
        searchResults.map(async (result) => {
          const detailsUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro=1&explaintext=1&titles=${encodeURIComponent(result.title)}&format=json&pithumbsize=300`
          const detailsResponse = await axios.get(detailsUrl)

          const pages = detailsResponse.data.query.pages
          const pageId = Object.keys(pages)[0]
          const page = pages[pageId]

          return {
            title: result.title,
            extract: page.extract || "No extract available",
            thumbnail: page.thumbnail ? page.thumbnail.source : null,
            pageId: result.pageid,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, "_"))}`,
            lastModified: result.timestamp,
          }
        }),
      )

      return res.status(200).json({
        status: true,
        query: q,
        result: results,
      })
      
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message })
    }
  },
}
