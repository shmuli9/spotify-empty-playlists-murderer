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

router.get("/delete_playlists", async (req, res, next) => {
  const errHandler = err => {
    console.log('Something went wrong!', err);
    res.json(err)
  }

  const userData = await spotifyApi.getMe()
  const user = userData.body
  let pListsToDelete = []
  let offset = 0

  const timer = setInterval(() => {
    spotifyApi.getUserPlaylists(user.id, {
      limit: 50,
      offset: offset
    }).then(resp => {
      const {total, items} = resp.body
      offset += 50

      for (const itemsKey in items) {
        if (items[itemsKey].name === 'Pure Go' || items[itemsKey].tracks.total === 0) {
          pListsToDelete.push({
            id: items[itemsKey].id,
            name: items[itemsKey].name,
            tracks: items[itemsKey].tracks.total
          })
        }
      }

      if (offset > total) {
        clearInterval(timer)
        console.log("interval cleared")
        res.json(pListsToDelete)
      }
    }).catch(errHandler)
  }, 350)

  // const deletionTimer = setInterval(() => {
  //   spotifyApi.unfollowPlaylist(pListsToDelete.pop().id)
  //   if (pListsToDelete.length === 0) clearInterval(deletionTimer)
  // }, 350)
})

router.get('/callback', function (req, res, next) {
  // your application requests refresh and access tokens

  const code = req.query.code || null;

  spotifyApi.authorizationCodeGrant(code)
    .then(data => {
        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
      },
      err => {
        console.log('Something went wrong!', err);
      }
    ).then(() => {
      res.redirect("/delete_playlists")
    }
  )
});

module.exports = router;
