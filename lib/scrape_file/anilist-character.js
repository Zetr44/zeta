const axios = require('axios');

async function searchChara(query) {
  const url = 'https://graphql.anilist.co';

  const graphqlQuery = `
    query ($search: String) {
      Page(perPage: 10) {
        characters(search: $search) {
          name {
            full
            native
          }
          description(asHtml: false)
          image {
            large
          }
          siteUrl
          dateOfBirth {
            year
            month
            day
          }
          age
          gender
          bloodType
          favourites
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

    const charaList = response.data.data.Page.characters.map(chara => {
      const cleanDesc = chara.description
        ? chara.description.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
        : 'No description available';

      const birth = (chara.dateOfBirth.day && chara.dateOfBirth.month && chara.dateOfBirth.year)
        ? `${chara.dateOfBirth.day}/${chara.dateOfBirth.month}/${chara.dateOfBirth.year}`
        : 'Unknown';

      return {
        name: {
          full: chara.name.full,
          native: chara.name.native
        },
        desc: cleanDesc,
        image: chara.image.large,
        url: chara.siteUrl,
        birthday: birth,
        age: chara.age || 'Unknown',
        gender: chara.gender || 'Unknown',
        bloodType: chara.bloodType || 'Unknown',
        fav: chara.favourites || 0
      };
    });

    return charaList;

  } catch (error) {
    console.error('Error fetching data from AniList: ' + error.message);
    return [];
  }
}

module.exports = {
  searchChara
};