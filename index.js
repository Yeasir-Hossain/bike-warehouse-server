const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express()


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_YEASIR}:${process.env.DB_PASS}@cluster0.nklab.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const bikeCOllection = client.db('bikeHub').collection('bike');
        const orderCollection = client.db('geniusCar').collection('order');
        //GET ALL BIKES
        app.get('/bike', async (req, res) => {
            const query = {}
            const cursor = serviceCOllection.find(query);
            const services = await cursor.toArray();
            res.send(services);
          })
    }
    finally{

    }
}



run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("server is running")
})



app.listen(port, () => {
    console.log(port);
  })