const axios = require('axios');

async function searchManga(query) {
  const url = 'https://graphql.anilist.co';

  const graphqlQuery = `
    query ($search: String) {
      Page(perPage: 10) {
        media(search: $search, type: MANGA) {
          title {
            romaji
            english
            native
          }
          genres
          description(asHtml: false)
          coverImage {
            large
          }
          siteUrl
          format
          status
          startDate {
            year
            month
            day
          }
          averageScore
          meanScore
          popularity
          favourites
          source
        }
      }
    }
  `;

  const variables = { search: query };

  try {
    const response = await axios.post(url, {
      query: graphqlQuery,
      variables
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const mangaList = response.data.data.Page.media.map(manga => {
      const cleanedDesc = manga.description
        ? manga.description.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')
        : 'No description available';

      const start = (manga.startDate.day && manga.startDate.month && manga.startDate.year)
        ? `${manga.startDate.day}/${manga.startDate.month}/${manga.startDate.year}`
        : 'Unknown';

      return {
        title: {
          romaji: manga.title.romaji,
          english: manga.title.english,
          native: manga.title.native
        },
        genre: manga.genres,
        desc: cleanedDesc,
        image: manga.coverImage.large,
        url: manga.siteUrl,
        format: manga.format,
        status: manga.status,
        start,
        avgScore: manga.averageScore || 0,
        score: manga.meanScore || 0,
        popularity: manga.popularity || 0,
        fav: manga.favourites || 0,
        source: manga.source || 'UNKNOWN'
      };
    });

    return mangaList;

  } catch (error) {
    console.error('Error fetching data from AniList: ' + error.message);
    return [];
  }
}

module.exports = {
  searchManga
};