
const {connectToDatabase} = require('../db/mongodb.js');

let collection

(async() => {
	try {
    const {db} = await connectToDatabase()
    collection = db.collection("users")
	} catch(err) {
    console.log(err)
	}
})();

async function findAllUsers() {
  try {
    const allUsers = await collection.find().toArray()
  } catch(err) {
    console.log(err)
  }
}

async function insertUser(user) {
  try {
    const insertedUser = await collection.insertOne(user)
    return insertedUser
  } catch(err) {
    console.log(err)
  }
}

async function findUserById(user_id) {
  try {
    const foundUser = await collection.findOne({id: user_id})
    return foundUser
  } catch(err) {
    console.log(err)
  }
}

async function pushToWishlist(user_id, item) {
  try{  
    const updatedUser = await collection.updateOne(
        {id: user_id},
        {$push:{wishlist:item}})
    return updatedUser
  } catch(err) {
    console.log(err)
  }
}

async function pullFromWishlist(user_id, item) {
  try{
      const updateduser = await collection.updateone(
        {id: user_id},
        {$pull:{wishlist:{item_link: item_link}}})
      return updatedUser
  } catch(err) {
    console.log(err)
  }
}

async function findUserWishlist(user_id) {
  try{
    const wishlist = await collection
        .find(
          {id: user_id}
        )
        .project(
          {
            _id: 0,
            wishlist: 1
          }
        )
        .toArray((err, results) => {
          console.log(results)
        })
        return wishlist
  } catch(err) {
    console.log(err)
  }
}
module.exports = {
  findAllUsers,
  insertUser,
  findUserById,
 pushToWishlist,
  pullFromWishlist,
  findUserWishlist
}