import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

// library class to manage book collection
class Library {
  constructor(dbUrl, dbName, collName) {
    this.dbUrl = dbUrl;
    this.dbName = dbName;
    this.collName = collName;
    this.dbClient;
  }

  // connect to the database
  async client() {
    console.log(`connecting to ${this.dbUrl}`);
    this.dbClient = await MongoClient.connect(this.dbUrl);
    console.log("connected to database");
    return this.dbClient;
  }
  //method to test connection
  async test() {
    const client = await this.client();
    client.close();
    console.log("connection test successful");
  }
  // method to get the collection
  async collection() {
    const client = await this.client();
    const db = client.db(this.dbName);
    const collection = db.collection(this.collName);
    return collection;
  }
  // method to get all books
  async getAllBooks() {
    const collection = await this.collection();
    return collection.find({});
  }
  // method to get a book by id
  async getBookById(id) {
    const docId = new ObjectId(id);
    const collection = await this.collection();
    return collection.findOne({ _id: docId });
  }
  // method to find many books
  async findBooks(query) {
    const collection = await this.collection();
    return collection.find(query);
  }
  // method to add a book
  async addBook(info) {
    const collection = await this.collection();
    const result = await collection.insertOne(info);
    console.log("Book added:", result);
    return result;
  }
  // method to update a book
  async changebook(id, newInfo) {
    const mongoId = new ObjectId(id);
    const infoObj = { $set: newInfo };
    const collection = await this.collection();
    const result = await collection.updateOne({ _id: mongoId }, infoObj);
    console.log("Book updated:", result);
    return result;
  }
  // method to remove a book
  async removeBook(id) {
    const mongoId = new ObjectId(id);
    const collection = await this.collection();
    await collection.deleteOne({ _id: mongoId });
    console.log("Book removed");
  }
}
export default Library;