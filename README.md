# Pokedash

This project is a Pokemon Dashboard was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It uses the following APIs:
- [PokeAPI](https://pokeapi.co/)
- [Twitter V2 API](https://developer.twitter.com/en/docs/twitter-api)
- [GitHub API](https://docs.github.com/en/rest)

## Requirements

You will need to run a service to allows CORS to use the Twitter V2 API properly. You can try this by running `npm run cors`.

You will also need to either creat an `.env` file or export the following:
```
REACT_APP_BEARER_TOKEN=<TWITTER_API_BEARER_TOKEN>
REACT_APP_CORS_URL=<CORS_URL>
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run watch`

Runs SASS watching/compiling of all `.scss` files.

### `npm run cors`

Runs a CORS Anywhere server (required for using the Twitter API)

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
