const express = require('express')
const fs = require('fs')
const router = express.Router()
const axios = require('axios')
const querystring = require('querystring')
let SpotifyWebApi = require('spotify-web-api-node');
const encodeFormData = require('../helpers/encodeFormData.js')

let spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECTURI
})

router.get('/login', async (req, res) => {
  const scopes = [
    'user-top-read',
    'user-read-recently-played',
    'user-library-read', 
    'user-follow-read'];

    res.redirect(spotifyApi.createAuthorizeURL(scopes))
  // res.redirect('https://accounts.spotify.com/authorize?' +
  //   querystring.stringify({
  //     response_type: 'code',
  //     client_id: process.env.CLIENT_ID,
  //     scope: scope,
  //     redirect_uri: process.env.REDIRECTURI
  //   })
  // );
});

router.get('/logged', async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if(error){
    console.log('Error:', error)
    res.send(`Callback error: ${error}`)
    return;
  }

  spotifyApi.authorizationCodeGrant(code)
  .then(data => {
    const access_token = data.body['access_token'];
    const refresh_token = data.body['refresh_token'];
    const expires_in = data.body['expires_in'];

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    console.log('access token:', access_token);
    console.log('refresh token:', refresh_token);
    
    console.log(`access token expires in  ${expires_in} s.`)

		const query = querystring.stringify(data.body);
		res.redirect(`${process.env.CLIENT_REDIRECTURI}?${query}`);

    setInterval(async() => {
      const data = await spotifyApi.refreshAccessToken();
      const access_token = data.body['access_token'];

      console.log('access token has been refreshed.');
      console.log('access token:', access_token);

      spotifyApi.setAccessToken(access_token);

      const query = querystring.stringify(data.body);
      res.redirect(`${process.env.CLIENT_REDIRECTURI}?${query}`);
    }, expires_in / 2 * 1000);
  })
  .catch(error => {
    console.log('Error refreshing token:', error);
    res.send(`Error refreshing token: ${error}`)
  })
	// const body = {
	// 	grant_type: 'authorization_code',
	// 	code: req.query.code,
	// 	redirect_uri: process.env.REDIRECTURI,
	// 	client_id: process.env.CLIENT_ID,
	// 	client_secret: process.env.CLIENT_SECRET,
	// }

// 	await axios('https://accounts.spotify.com/api/token', {
// 		method: 'POST',
// 		headers: {
// 			"Content-Type": "application/x-www-form-urlencoded",
// 			"Accept": "application/json"
// 		},
// 		data: body
// 	})
// 	.then(response => response.data)
// 	.then(data => {
// 		const query = querystring.stringify(data);
// 		res.redirect(`${process.env.CLIENT_REDIRECTURI}?${query}`);
// 	});
});


module.exports = router;