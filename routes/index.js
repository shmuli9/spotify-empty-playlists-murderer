const express = require('express');
const router = express.Router();
const config = require("../config")
const spotifyApi = require("../api")

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});

router.get('/login', function (req, res, next) {
  const authorizeURL = spotifyApi.createAuthorizeURL(config.scopes, config.state);

  res.redirect(authorizeURL)
});

router.get('/callback', function (req, res, next) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;

  spotifyApi.authorizationCodeGrant(code)
    .then(data => {
        console.log('The token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        console.log('The refresh token is ' + data.body['refresh_token']);

        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
      },
      err => {
        console.log('Something went wrong!', err);
      }
    ).then(() => {
      spotifyApi.getMe().then(function (data) {
        console.log('Some information about the authenticated user', data.body);
      }, function (err) {
        console.log('Something went wrong!', err);
      })
    }
  )
});

module.exports = router;
