const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const puppeteer = require('puppeteer')
const port = process.env.PORT || 8888

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())

const AuthRoutes = require('./routes/authRoutes.js');
app.use('/api', cors(), AuthRoutes);

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})

// respond with "hello world" when a GET request is made to the homepage
app.get('/getDiscogsListings', async (req, res) => {
  puppeteer.launch({headless: true}).then(async function (browser) {
    const page = await browser.newPage()
    let order
    
    if (req.query.sort == 'lowestfirst') {
      order = 'price%2Casc';
    }

    const encodedQuery = encodeURIComponent(req.query.query)

    await page.goto(`https://www.discogs.com/sell/list?sort=${order}&limit=${req.query.limit}&format=${req.query.format}&q=${encodedQuery}`, {

      waitUntil: 'networkidle2'
    });
    await page.waitForSelector('tr.shortcut_navigable');
    let results = await getPageListings(page)
    
    await browser.close()
    res.send(results)
  })
})


/**
 * 
 * @param   {Object} page An object of the page puppeteer is scraping over
 * @returns {Array}       An array of objects containing properties for each queried listing
 */
async function getPageListings(page) {
  try {
    return await page.$$eval('tr.shortcut_navigable:not(.unavailable)', items => {
      let itemCollection = [];
      [...items].map( async item => {
        const result = {
          title: await item.querySelector('td.item_description a.item_description_title').innerText,
          price: await item.querySelector('td.item_price > span.price').innerText,
          shipping: await item.querySelector('td.item_price > span.item_shipping').innerText,
          link: await item.querySelector('td.item_description a.item_description_title').href,
          condition: await item.querySelector('td.item_description p.item_condition span.condition-label-mobile + span').innerText,
          image: await item.querySelector('td.item_picture > a.thumbnail-lazyload > img').getAttribute("data-src"),
          seller_name: await item.querySelector('td.seller_info div.seller_block > strong > a').innerText,
          seller_rating: await item.querySelector('td.seller_info span.star_rating + strong').innerText
        }
        itemCollection.push(result)
      })
      return itemCollection
    })
  } catch(e) {
    console.log(e)
  }
}