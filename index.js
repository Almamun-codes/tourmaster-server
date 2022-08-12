const express = require("express");

const { MongoClient } = require("mongodb");

const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const port = 4000;

//user : tourmanager
//pass : rcLta3uyPNrc8NXY

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tyr9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("tourmanager");
    const placeCollection = database.collection("places");

    //post a place to database
    app.post("/places", async (req, res) => {
      const place = req.body;

      console.log("place added", place);

      const result = await placeCollection.insertOne(place);

      res.json(result);
    });

    // get all places from db
    app.get("/places", async (req, res) => {
      const result = placeCollection.find({});
      const places = await result.toArray();
      res.send(places);
      console.log("got hitted");
    });

    // get single place from db
    app.get("/places/:placeId", async (req, res) => {
      const id = req.params.placeId;
      // console.log("single place hitted", id)
      const query = { _id: ObjectId(id) };

      const result = await placeCollection.findOne(query);

      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  console.log("hitting the post");
  res.send("hello from server");
});

app.listen(port, () => {
  console.log("listenig to port", port);
});
