const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()

const puppeteer = require('puppeteer')
const R = require('rambda')
const fs = require('fs')

const port = process.env.PORT || 8888
const args = [
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  // '--shm-size=3gb'
]

// https://stackoverflow.blog/2021/10/06/best-practices-for-authentication-and-authorization-for-rest-apis/
// https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design

// TODO: caching using apicache, possibly in combination withh redis
// https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/#h-name-collections-with-plural-nouns
// https://www.npmjs.com/package/apicache, https://redis.io/, https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
// const apicache = require('apicache')
// let cache = apicache.middleware

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())

const AuthRoutes = require('./routes/authRoutes.js');
app.use('/auth', cors(), AuthRoutes);

const SpotifyRoutes = require('./routes/spotifyRoutes.js');
app.use('/api', cors(), SpotifyRoutes);

const CrudRoutes = require('./routes/CRUD.js')
app.use('/crud', cors(), CrudRoutes)

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})

let browser;
app.post('/getDiscogsListings', async (req, res) => {
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
  let body = req.body.list

  const promised = body.map(async function (album) {
    let query = `${[...album.artists]}-${album.title}`
    const encodedQuery = encodeURIComponent(query)
    const discogsData = await scrapeWebPage(order, limit, format, encodedQuery)
    return {
      ...album,
      listings: {
        ...discogsData
      }
    }
  })
  await Promise.all(promised)
  .then(async (promised) => {
    // console.log(promised)
//    fs.writeFile('mockdata.json', JSON.stringify(promised), (err) => {
//      if (err) {
//      } else {
//        console.log("file written successfully")
//        console.log(fs.readFileSync("mockdata.json", "utf8"));
//      }
//    })
    res.send(promised)
    await browser.close()
  })

})  

  
async function scrapeWebPage(order, limit, format, encodedQuery)  {
  try {
    const page = await browser.newPage()
  
    await page.goto(`https://www.discogs.com/sell/list?sort=${order}&limit=${limit}&q=${encodedQuery}`, {
      waitUntil: 'networkidle2'
    });
    await page.waitForSelector('tr.shortcut_navigable');
    let result = await getPageListings(page)
    await page.close()
    return result
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
