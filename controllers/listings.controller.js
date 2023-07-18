const listingService = require('../services/listings.service.js')

const { scrapeDiscogsListings, scrapeWishlistListings } = listingService

const getDiscogsListings = async(req, res) => {
  try {
    const options = req.body
    const listings = await scrapeDiscogsListings(options)
    res.status(200).send(listings)
  } catch (err) { 
    res.status(500).send({
      error: 'Listings could not be scraped.',
      value: err
    })
  }
}

const getDiscogsWishlist = async(req, res) => {
  try {
    console.log(req.body)
    const links = req.body.link_array
    const listings = await scrapeWishlistListings(links)
    console.log('controller ln23',listings)
    res.status(200).send(listings)

  } catch(err) {
    res.status(500).send({
      error: 'Wishlist could not be scraped.',
      value: err
    })
  }
}

module.exports = {
  getDiscogsListings,
  getDiscogsWishlist
}
