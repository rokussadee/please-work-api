const express = require('express')
const router = express.Router()
const fs = require('fs')

const {getDiscogsListings} = require('../controllers/listings.controller.js')

router.post('/getDiscogsListings',getDiscogsListings)
  
module.exports = router;
