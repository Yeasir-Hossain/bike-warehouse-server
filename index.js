const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express()


app.use(cors())
app.use(express.json())


function verifyJWT(req,res,next){
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if(!authHeader){
    return res.status(401).send({message:'Unauthorized Access'});
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
    if(err){
      return res.status(403).send({message:'Forbidden Access'})
    }
    req.decoded = decoded;
    next()
  })
  
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.25a2a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const bikeCOllection = client.db('bikeHub').collection('bike');
        //GET ALL BIKES
        app.get('/bike', async (req, res) => {
            const query = {}
            const cursor = bikeCOllection.find(query);
            const bikes = await cursor.toArray();
            res.send(bikes);
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