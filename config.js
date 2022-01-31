require('dotenv').config()

const config = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  redirectUri: process.env.redirectUri,
  scopes: ['playlist-modify-private',
    'playlist-read-collaborative',
    'playlist-read-private',
    'playlist-modify-public', 'user-read-private', 'user-read-email'],
  state: 'some_state'
}

module.exports = config