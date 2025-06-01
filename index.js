const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

/* 
DB_USER = hridoyKhanCafeShop
DB_PASS = u8j9xe1YE4rKkmmt

*/

// middleware
app.use(cors());
app.use(express.json());

// MongoDB Section
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n0qsrr5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = `mongodb://localhost:27017`
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const userCollection = client.db("coffeeDB").collection("users");
    const orderCollection = client.db("coffeeDB").collection("orders");

    // Get All Coffees
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //  Get Specific Coffee
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // PUT A Coffee
    app.put("/coffee/:id", async (req, res) => {
      const updatedCoffee = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo,
        },
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
    });

    // POST A Coffee
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // Delete A Coffee
    app.delete("/coffee/:coffeeId", async (req, res) => {
      const id = req.params.coffeeId;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Users Related API
    // Post a User
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log("Creating New User", newUser);
      const result = await userCollection.insertOne(newUser);
      console.log(result);
      res.send(result);
    });

    // Get All Users
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // hoy new data or old data hoyte pare;old data er change korte pari or new data create hyte pare
    // PATCH -- ami jani existing data ase shetar moddhe kisu ekTa set Korbo
    app.patch("/users", async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const filter = { email: email };

      const updateUser = {
        $set: {
          lastSignInTime: lastSignInTime,
        },
      };

      const result = await userCollection?.updateOne(filter, updateUser);

      res.send(result);
    });

    // Delete a User
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Order Related APIs

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const cursor = await orderCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`Coffee making server is running`);
});

/* MongoDB section End */

app.listen(port, () => {
  console.log(`Coffee server is running on PORT: ${port}`);
});
