require("dotenv").config();
const { MongoClient } = require("mongodb");

async function main() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const db = client.db("your_database_name");
    const collection = db.collection("your_collection_name");
    const docCount = await collection.countDocuments();
    console.log(`Number of documents in collection: ${docCount}`);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
