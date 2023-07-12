const express = require('express')
const router = express.Router()
const querystring = require('querystring')
const puppeteer = require('puppeteer')
const fs = require('fs')
const args = [
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  // '--shm-size=3gb'
]

let browser;

router.post('/getDiscogsListings', async (req, res) => {
  browser = await puppeteer.launch({
  headless: true,
  handleSIGINT: false,
  args: args})

  let order
  if(req.body.sort == 'newestfirst') {
    order = "listed%2Cdesc"
  }
  if (req.body.sort == 'lowestfirst') {
    order = 'price%2Casc';
  }
  let limit = req.body.limit
  let format = req.body.format
  let body = Array.from(req.body.list)

  const promised = body.map(async function (album) {
    let query = `${[...album.artists]}-${album.title}`
    const encodedQuery = encodeURIComponent(query)
    const discogsData = await scrapeWebPage(order, limit, format, encodedQuery)
      return{
        ...album,
        listings: discogsData
    }
  })
  
  await Promise.all(promised)
  .then(async (promised) => {
    let filteredpromise =  Array.from(promised).filter((item) => item.listings !== undefined);

    res.send(filteredpromise)
    await browser.close()
  })

})  

  
async function scrapeWebPage(order, limit, format, encodedQuery)  {
  try {
    const page = await browser.newPage()
  
    await page.goto(`https://www.discogs.com/sell/list?sort=${order}&limit=${limit}&q=${encodedQuery}`, {
      waitUntil: 'networkidle2'
    });
    let isLoaded = await page.waitForSelector('tr.shortcut_navigable', {timeout: 10000});
    if (isLoaded) {
      let result = await getPageListings(page)
      return result
    }
    await page.close()
  } catch(e) {
    console.log(encodedQuery,e)
  }
}

/**
 *  
 * @param   {Object} page An object of the page puppeteer is scraping over
 * @returns {Array}       An array of objects containing properties for each queried listing
 */
async function getPageListings(page) {
  try {
    return await page.$$eval('tr.shortcut_navigable:not(.unavailable)', async items => {
      let itemCollection = [];
      [...items].map( async item => {
        const result = {
          discogs_title: await item.querySelector('td.item_description a.item_description_title').innerText,
          price: await item.querySelector('td.item_price > span.price').innerText,
          shipping: await item.querySelector('td.item_price > span.item_shipping').innerText,
          link: await item.querySelector('td.item_description a.item_description_title').href,
          condition: await item.querySelector('td.item_description p.item_condition span.condition-label-mobile + span').innerText,
          discogs_image: await item.querySelector('td.item_picture > a.thumbnail-lazyload > img').getAttribute("data-src"),
          seller_name: await item.querySelector('td.seller_info div.seller_block > strong > a').innerText,
          seller_rating: await item.querySelector('td.seller_info span.star_rating + strong').innerText
        }
        itemCollection.push(result)
      })
      return await itemCollection
    })
  } catch(e) {
    console.log("line 112",e)
  }
}
module.exports = router;
