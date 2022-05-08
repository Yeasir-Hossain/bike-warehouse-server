const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express()
const jwt = require('jsonwebtoken');


app.use(cors())
app.use(express.json())


function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized Access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden Access' })
    }
    req.decoded = decoded;
    next()
  })

}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.25a2a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const bikeCollection = client.db('bikeHub').collection('bike');
    const itemCollection = client.db('bikeHub').collection('item');
    //AUTHORIZATION
    app.post('/login', async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
      })
      res.send({ accessToken });
    })
    //GET ALL BIKES
    app.get('/bike', async (req, res) => {
      const query = {}
      const cursor = bikeCollection.find(query);
      const bikes = await cursor.toArray();
      res.send(bikes);
    })
    //GET 6 BIKES
    app.get("/bikesix", async (req, res) => {
      const query = {};
      const cursor = bikeCollection.find(query);
      
      let bikes;
        bikes = await cursor.toArray();
        bikes =bikes.slice(0,6)
      res.send(bikes);
    });
    app.get('/bike/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const bike = await bikeCollection.findOne(query)
      res.send(bike);
    })
    //ADD
    app.post('/bike', async (req, res) => {
      const newBike = req.body;
      const result = await bikeCollection.insertOne(newBike)
      res.send(result);
    })
    //DELETE
    app.delete('/bike/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bikeCollection.deleteOne(query);
      res.send(result);
    });
    //UPDATE
    app.put('/bike/:id',async(req,res)=>{
      const id=req.params.id
      const updatedBike=req.body
      const filter ={_id:ObjectId(id)}
      const options = { upsert: true }
      const updatedDoc={
        $set:{
          quantity: updatedBike.quantity
        }
      }
      const result=await bikeCollection.updateOne(filter,updatedDoc,options)
      res.send(result)
    })

    //GET INDIVIDUAL ITEM
    app.get("/item", async (req, res) => {
      const email = req.query.email;
      const query = {email:email};
      const cursor = itemCollection.find(query);
      let bikes;
        bikes= await cursor.toArray();
      res.send(bikes);
    });
    app.post('/item',async(req,res)=>{
      const item = req.body;
      const result = await itemCollection.insertOne(item)
      res.send(result)
    })

    app.get('/item', verifyJWT ,async(req,res)=>{
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      if(email === decodedEmail){
      const query = {email:email};
      const cursor = itemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
      }
      else{
        res.status(403).send({message:"Forbidden Access"})
      }
    })


  }
  finally {

  }
}



run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("server is running")
})



app.listen(port, () => {
  console.log(port);
})