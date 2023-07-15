const listingService = require('../services/listings.service.js')

const { scrapeDiscogsListings } = listingService

const getDiscogsListings = async(req, res) => {
  try {
    const options = req.body
    const listings = await scrapeDiscogsListings(options)
    res.status(200).send(listings)
  } catch (err) { 
    res.status(500).send({
      error: 'Something went wrong',
      value: err
    })
  }
}

module.exports = {
  getDiscogsListings
}
