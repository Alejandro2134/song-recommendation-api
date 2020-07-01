const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, `../.env.development`)
})

const config = {
    dbUrl: `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0-rtsr4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    spotifyPk: process.env.SPOTIFY_PK,
    spotifySk: process.env.SPOTIFY_SK,
    spotifyRedirect: process.env.SPOTIFY_REDIRECT,
    spotifyScopes: process.env.SPOTIFY_SCOPES,
}

module.exports = config;