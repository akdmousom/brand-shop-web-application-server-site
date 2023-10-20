// Dependencys
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

// Initialize App
const app = express();

// middleware
app.use(cors());
app.use(express.json())



// App EndPoint

app.get('/', (req, res) => {
  res.send('Server Is Running')
})


// Database connection 


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.chkrm7d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  const database = client.db("brand-shop");
  const users = database.collection("users");
  const brands = database.collection("brands");
  const products = database.collection("products");
  const addToCart = database.collection("addToCart");


  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get('/users', async (req, res) => {

      const cursor = await users.find().toArray()

      res.send(cursor)
    })

    app.post('/users', async (req, res) => {
      const doc = req.body;
      const result = await users.insertOne(doc)
      res.send(result)

    })

    app.post('/brands', async (req, res) => {
      const doc = req.body;
      const result = await brands.insertOne(doc);
      res.send(result)

    })

    app.get('/brands', async (req, res) => {
      const cursor = await brands.find().toArray()
      res.send(cursor)
    })

    app.get('/single-brands/:id', async (req, res) => {
      const id = req.params.id;
      const cursor = await brands.findOne(new ObjectId(id))
      res.send(cursor)
    })

    app.post('/products', async (req, res) => {
      const doc = req.body;
      const result = await products.insertOne(doc)
      res.send(result)

    })

    app.get('/products', async (req, res) => {
      const cursor = await products.find().toArray();
      res.send(cursor)
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const query = await products.findOne(filter)
      const option = { upsert: true }
      const doc = req.body
      const updatedDoc = {
        $set: {

          productImg: doc.productImg,
          productName: doc.productName,
          brandName: doc.brandName,
          productType: doc.productType,
          productPrice: doc.productPrice,
          shortDescription: doc.shortDescription,
          productRating: doc.productRating

        }
      }
      const result = await products.updateOne(filter, updatedDoc, option)
      console.log(doc);
      res.send(result)
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const cursor = await products.findOne(query)
      res.send(cursor)
    })

    app.get('/product-details/:id', async (req, res) => {
      const id = req.params.id;
      const cursor = await products.findOne(new ObjectId(id))
      res.send(cursor)
    })


    app.post('/add-to-cart', async (req, res) => {
      const doc = req.body;
      const result = await addToCart.insertOne(doc);
      res.send(result);
    })

    app.get('/cart', async (req, res) => {
      const doc = await addToCart.find().toArray();
      res.send(doc)
    })

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addToCart.deleteOne(query)
      res.send(result)
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.connect();
  }
}
run().catch(console.dir);








// App listening
app.listen(port, () => {
  console.log(`App listen on port ${port}`);
})
