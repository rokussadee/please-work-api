const express = require('express')
const router = express.Router()
const axios = require('axios')
const querystring = require('querystring')
let SpotifyWebApi = require('spotify-web-api-node');

let spotifyApi = new SpotifyWebApi()

router.get('/getUser', async (req, res) => {
  const token = req.query.token;
  console.log(token)
  // spotifyApi.authorizationCodeGrant(code)
  try {
    spotifyApi.setAccessToken(token)
    const me = await spotifyApi.getMe();
    res.send(me.body.id)
    res.send(getUserPlaylists(me.body.id));
  } catch(error) {
    console.error('error getting profile: ',error);
  }
	// await axios('https://api.spotify.com/v1/me', {
	// 	headers: {
	// 		'Authorization': `Bearer ${req.params.token}`
	// 	}
	// })
	// .then(response => response.data)
	// .then(data => {
	// 	res.json(data);
	// });
});

async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("---------------+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    // console.log(tracks);

    const tracksJSON = { tracks }
    let data = JSON.stringify(tracksJSON);
  }
  return playlists
}

async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    console.log(track.name + " : " + track.artists[0].name)
  }
  
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}

module.exports = router;
