const { MongoClient, ServerApiVersion } = require('mongodb');

const username = encodeURIComponent(process.env.MONGO_USERID);

const userpass = encodeURIComponent(process.env.MONGO_USERPASS);

const uri = `mongodb+srv://${username}:${userpass}@cluster0.vxrxnqu.mongodb.net/?retryWrites=true&w=majority`;

let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, function(err, database) {
   db = databse;
   console.log(db); // shows stuff
});

//const connectToCluster = async () => {
//  let client;
//  try {
//    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, function(err, db) {
//      if(err) throw err;
//      console.log(db)
//      dbo = db.db('discjunky')
//    });
//    await client.connect()
//  }
//  catch (err) {
//    console.error(err)
//    process.exit()
//  }
//}
//
//let dbo
//
//let connect = function(callback){
//    if(!db){
//        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, );
//    }else{
//        console.log("Not connected tis time as I am already connected");
//        callback(dbo);
//    }
//
//};
//
//let client =  new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, function(err, db) {
//      if(err) throw err;
//      dbo = db.db("discjunky")
//    });
//
//client.connect() = function(err, db) {
//  if(err) throw err;
//    dbo = db.db("discjunky")
//  };
//
//function mongobj() {
//  this.dbo = null;
//  this.connect = function(err, db) {
//    if(!dbo) {
//      MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, );
//    } else {
//      console.log('already connected')
//    }
//    if(err) throw err;
//    dbo = db.db("discjunky")
//  };
//}
//
//const cleanup = (event) => { // SIGINT is sent for example when you Ctrl+C a running process from the command line.
//  console.log('mongo client closing: ', client)
//  client.close(); // Close MongodDB Connection when Process ends
//  process.exit(); // Exit with default success-code '0'.
//}
//
//process.on('SIGINT', cleanup);
//process.on('SIGTERM', cleanup);
//
//
////exports.connectToCluster = connectToCluster
////module.exports = { dbo }
//module.exports = new mongobj();


//let db;
//
///**
// * Connects to the MongoDB Database with the provided URL
// */
//
//
//exports.connect = function(callback){
//    if(!db){
//        MongoClient.connect(mongoUrl, function(err, _db){
//            if (err) { throw new Error('Could not connect: '+err); }
//            db = _db;
//            console.log(db);
//            connected = true;
//            console.log(connected +" is connected?");
//            callback(db);
//        });     
//    }else{
//        console.log("Not connected tis time as I am already connected");
//        callback(db);
//    }
//
//};
//
//function mongobj() {
//  this.db = null;
//  this.connect = function(callback){
//    if(!db){
//        MongoClient.connect(uri, function(err, _db){
//            if (err) { throw new Error('Could not connect: '+err); }
//            db = _db;
//            console.log(db);
//            connected = true;
//            console.log(connected +" is connected?");
//            callback(db);
//        });     
//    }else{
//        console.log("Not connected tis time as I am already connected");
//        callback(db);
//    }
//
//  }
//}
//
//
//module.exports = new mongobj();
module.exports = {
  db
}
