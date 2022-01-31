# spotify-empty-playlists-murderer

This app is designed to delete empty playlists on your Spotidy account
Start the app with `npm start`, browse to `http://localhost:3000` and press **Login**

For this to work for you, you will need to setup a developer account on Spotify [here](https://developer.spotify.com/dashboard/applications)
Instructions for getting started can be found [here](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/)

You will need to provide a .env file in the root of the repo, like so:

```dotenv
clientId='XXXXXXXXX'
clientSecret='XXXXXXXXX'
redirectUri='http://localhost:3000/callback'
```