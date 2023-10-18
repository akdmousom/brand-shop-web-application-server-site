// Dependencys
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

// Initialize App
const app = express();



// App EndPoint

app.get('/', (req,res)=>{
    res.send('Server Is Running')
})


// Database connection 


const { MongoClient, ServerApiVersion } = require('mongodb');
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


  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get('/users',async (req,res)=>{

        const cursor = await users.find().toArray()

        res.send(cursor)
    })

    app.post('/users', async (req,res)=>{
        const doc = req.body;
        const result = await users.insertOne(doc)
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
app.listen(port, ()=>{
    console.log(`App listen on port ${port}`);
})
