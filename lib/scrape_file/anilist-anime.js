const axios = require('axios');

async function searchAnime(query) {
  const url = 'https://graphql.anilist.co';

  const graphqlQuery = `
    query ($search: String) {
      Page(perPage: 10) {
        media(search: $search, type: ANIME) {
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
          genres
          description(asHtml: false)
          siteUrl
          type
          format
          episodes
          duration
          averageScore
          meanScore
          popularity
          status
          startDate {
            year
            month
            day
          }
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

    const animeList = response.data.data.Page.media.map(anime => {
      const cleanDesc = anime.description
        ? anime.description.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
        : 'No description available';

      const releaseDate = (anime.startDate.day && anime.startDate.month && anime.startDate.year)
        ? `${anime.startDate.day}/${anime.startDate.month}/${anime.startDate.year}`
        : 'Unknown';

      return {
        title: {
          romaji: anime.title.romaji,
          english: anime.title.english,
          native: anime.title.native
        },
        image: anime.coverImage.large,
        genres: anime.genres,
        description: cleanDesc,
        url: anime.siteUrl,
        type: anime.type,
        format: anime.format,
        episodes: anime.episodes,
        duration: anime.duration,
        averageScore: anime.averageScore,
        meanScore: anime.meanScore,
        popularity: anime.popularity,
        status: anime.status,
        releaseDate
      };
    });

    return animeList;

  } catch (error) {
    console.error('Error fetching data from AniList: ' + error.message);
    return [];
  }
}

module.exports = {
  searchAnime
};