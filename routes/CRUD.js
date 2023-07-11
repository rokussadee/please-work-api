const express = require('express')
const router = express.Router()
const db = require('../db/connect.js');
const username = encodeURIComponent(process.env.MONGO_USERID);

const userpass = encodeURIComponent(process.env.MONGO_USERPASS);

//const uri = `mongodb+srv://${username}:${userpass}@cluster0.vxrxnqu.mongodb.net/?retryWrites=true&w=majority`;

router.get('/getUsers', async (req, res) => {
  let mongoClient
  try {
    mongoClient = db.connectToCluster()
    const collection = mongoClient.db("discjunky").collection("users")
    let users = collection.find().toArray()
    res.send(users)
  } catch (err) { 
    console.log(err)
  }
})

router.post('/findUser', async (req, res) => {
  let mongoClient = await db.connectoToCluster()
  const database = mongoClient.db("discjunky")
  const collection = database.collection("users")

  const user  = {
    name: req.body.display_name,
    user_id: req.body.id,
    img: req.body.img,
  }
})

router.post('/createUser', async (req, res) => {
  const user = {
    name: req.body.name,
    user_id: req.body.id,
    img: req.body.img
  }
  let mongoClient
  try {
    mongoClient = db.connectToCluster()
      const collection = mongoClient.db("discjunky").collection("users")
    let user = collection.insertOne(user)
    res.send(user)
  } catch (err) { 
    console.log(err)
  }
}) 

router.post('/additem', async(req, res) => {
  const user_id = req.body.user_id
  
  const item = {
    item_link: req.body.item_link,
//    title: req.body.title
  }
  
  let mongoClient
    try {
      mongoClient = await db.connectToCluster()
      const collection = mongoClient.db("discjunky").collection("users")
      const updatedUser = await collection.updateOne(
        {id: user_id},
        {$push:{wishlist:item}})
      res.send(updatedUser)
    } catch (err) { 
      res.status(500).send({
        error: 'Something went wrong',
        value: err
      })
    }


})

module.exports = router;
