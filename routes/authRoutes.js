const express = require('express')
const router = express.Router()
// import fetch from 'node-fetch'
const axios = require('axios')
const querystring = require('querystring')
const encodeFormData = require('../helpers/encodeFormData.js')

router.get('/login', async (req, res) => {
  const scope =
    `user-top-read 
    user-read-recently-played 
    user-library-read 
    user-follow-read`;

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECTURI
    })
  );
});

router.get('/logged', async (req, res) => {
	const body = {
		grant_type: 'authorization_code',
		code: req.query.code,
		redirect_uri: process.env.REDIRECTURI,
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
	}

	await axios('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Accept": "application/json"
		},
		data: body
	})
	.then(response => response.data)
	.then(data => {
		const query = querystring.stringify(data);
		res.redirect(`${process.env.CLIENT_REDIRECTURI}?${query}`);
	});
});

router.get('/getUser/:token', async (req, res) => {
	await axios('https://api.spotify.com/v1/me', {
		headers: {
			'Authorization': `Bearer ${req.params.token}`
		}
	})
	.then(response => response.data)
	.then(data => {
		res.json(data);
	});
});

module.exports = router;