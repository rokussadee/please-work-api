const express = require('express')
const router = express.Router()
const db = require('../db/connect.js');
const username = encodeURIComponent(process.env.MONGO_USERID);

const userpass = encodeURIComponent(process.env.MONGO_USERPASS);

const uri = `mongodb+srv://${username}:${userpass}@cluster0.vxrxnqu.mongodb.net/?retryWrites=true&w=majority`;

router.get('/getUsers', async (req, res) => {
  let mongoClient
  try {
    mongoClient = await db.connectToCluster(uri)
    const database = mongoClient.db("discjunky")
    const collection = database.collection("users")
    let users = await collection.find().toArray()
    res.send(users)
  } catch (err) { 
    console.log(err)
  }
})

module.exports = router;