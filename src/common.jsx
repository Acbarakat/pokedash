import { setup } from 'axios-cache-adapter';

const {REACT_APP_BEARER_TOKEN,REACT_APP_CORS_URL} = process.env;

// Create `axios` instance with pre-configured `axios-cache-adapter` attached to it
export const pokeapi = setup({
  // `axios` options
  baseURL: 'https://pokeapi.co/api/v2',

  // `axios-cache-adapter` options
  cache: {
    maxAge: 15 * 60 * 1000
  }
})

// Prepopulate
/* pokeapi.get("/pokemon", {params: {limit: 9999}}).then(async (response) => {
    console.log(response.data.results);
    response.data.results.forEach(async (pokemon) => {
        pokeapi.get(`/pokemon/${pokemon.name}`);
    });
}); */

export const twitterapi = setup({
    // `axios` options
    baseURL: `${REACT_APP_CORS_URL}https://api.twitter.com/2`,
    headers: {
        'Access-Control-Allow-Origin': '*',
        "authorization": `Bearer ${REACT_APP_BEARER_TOKEN}`
    },
  
    // `axios-cache-adapter` options
    cache: {
      maxAge: 15 * 60 * 1000
    }
})