const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const {connectToDatabase} = require('./db/mongodb.js');
//const { db } = require('./db/connect.js')
const R = require('rambda');

//let collection
//
//(async() => {
//	try {
//    const {db} = await connectToDatabase()	// get the database
//		// search the database
//    console.log('database: ', db)
//    console.log('collection: ', db.collection)
//    collection = db.collection
//	} catch (error) {
//    console.log(error)
//	}
//	// if request is made without a session or valid query
//})();

const port = process.env.PORT || 8888

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

const DiscogsRoutes = require('./routes/discogsRoutes.js');
app.use('/discogs', cors(), DiscogsRoutes);

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})

const cleanup = (event) => { // SIGINT is sent for example when you Ctrl+C a running process from the command line.
  console.log('mongo client closing: ', client)
  process.exit(); // Exit with default success-code '0'.
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
