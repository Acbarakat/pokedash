import { setup } from 'axios-cache-adapter';

const {
    REACT_APP_BEARER_TOKEN,
    REACT_APP_CORS_URL
} = process.env;

// Create `axios` instance with pre-configured `axios-cache-adapter` attached to it
export const pokeapi = setup({
  // `axios` options
  baseURL: 'https://pokeapi.co/api/v2',

  // `axios-cache-adapter` options
  cache: {
    maxAge: 15 * 60 * 1000
  }
})

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

export const githubapi = setup({
  // `axios` options
  baseURL: `https://api.github.com/`,

  // `axios-cache-adapter` options
  cache: {
    maxAge: 15 * 60 * 1000
  }
})