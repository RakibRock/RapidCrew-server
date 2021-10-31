const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// un:Rapid
// pass:8OKYcWRHfe2QDjYb
//Database Connection--------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ald9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//-----------------------------
async function run() {
  try {
    await client.connect();
    const database = client.db("RapidCrew");
    const serviceCollection = database.collection("servicesCollection");
    //GET API
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    //GET SINGLE SERVICE
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specifi service", id);
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      console.log("service:", service);
      res.json(service);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// app.get("/services", (req, res) => {
//   res.send(services);
// });

app.get("/", (req, res) => {
  res.send("Hello Rakib this is your server");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
