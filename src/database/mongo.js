const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const MongoClient = require("mongodb").MongoClient;

let database = null;

async function startDatabase() {
  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  const connection = await MongoClient.connect(uri, {useNewUrlParser: true});
  database = connection.db();
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};