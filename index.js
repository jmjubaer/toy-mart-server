const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wxf5f5n.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const indexKeys = {name: 1}
    const indexOptions = {name: "nameIndex"}
    const toyCollections = client.db('toy-collection').collection('toy-details');
    await toyCollections.createIndex(indexKeys, indexOptions);
    app.get('/search',async(req,res) => {
      const searchText = req.query.text;
      console.log(searchText);
      const filter = {name: {$regex: searchText,$options: "i"}}
      const result = await toyCollections.find(filter).toArray();
      res.send(result);
    })

    app.get('/toy/:id', async(req,res) => {
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)};
        const result = await toyCollections.findOne(filter);
        // console.log(data);
        res.send(result);
    })

    app.post('/addToy', async(req,res) => {
        const data = req.body;
        const result = await toyCollections.insertOne(data);
        // console.log(data);
        res.send(result);
    })

    app.get('/allToy',async(req,res) => {
        const result = await toyCollections.find().limit(20).toArray();
        res.send(result);
    })

    app.get('/myToy',async(req,res) => {
      const email = req.query.email;
      const filter = {sellerEmail: email};
      const result = await toyCollections.find(filter).toArray();
      res.send(result);
    });

    app.delete('/deleteToy/:id',async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await toyCollections.deleteOne(filter);
      res.send(result);
    });

    app.put('/updateToy/:id',async(req, res)=> {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const option = {upsert: true}
      const data = req.body;
      const updatedDoc = {
        $set: {
          ...data
        }
      }
      const result = await toyCollections.updateOne(filter,updatedDoc,option);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) => {
    res.send("Jm toy mart server running at http://localhost:5000")
})


app.listen(port,() => {
    console.log("JM toy mart running on port " + port);
});