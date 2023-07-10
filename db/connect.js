const { MongoClient, ServerApiVersion } = require('mongodb');

const username = encodeURIComponent(process.env.MONGO_USERID);

const userpass = encodeURIComponent(process.env.MONGO_USERPASS);

const uri = `mongodb+srv://${username}:${userpass}@cluster0.vxrxnqu.mongodb.net/?retryWrites=true&w=majority`;

const connectToCluster = async () => {
  let client;
  try {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect()
    return client
  }
  catch (err) {
    console.error(err)
    process.exit()
  }
}

exports.connectToCluster = connectToCluster
