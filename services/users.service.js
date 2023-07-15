//const db = require('../db/connect.js');
const { insertUser, findUserById, findAllUsers } = require('../db/functions.js')

const findUsers = async () => {
//  let mongoClient
  try {
    await findAllUsers()
  } catch (err) { 
    console.log(err)
  }
}

const findUser = async (id) => {
  try { 
    await findUserById(id)
  } catch (err) {
    console.log(err)
  } 
}

const createUser = async (userdata) => {
  const user = {
    name: userdata.name,
    id: userdata.id,
    img: userdata.img,
    wishlist: []
  }
//  let mongoClient
//  try {
//    mongoClient = db.connectToCluster()
//    const collection = mongoClient.db("discjunky").collection("users")
//    let user = collection.insertOne(user)
//    return user
//  } catch (err) { 
//    console.log(err)
//  }finally {
//      mongoClient.close()
//  }
  try {
//        console.log(collection)
//    return collection.insertOne(user)
    await insertUser(user)

  } catch (err) {
    console.log(err)
  }
} 

module.exports = {
  findUsers,
  findUser,
  createUser
}
