const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

// user : dbuser1
// password : URk.Zbs54iC.9Mg

const uri = "mongodb+srv://dbuser1:URk.Zbs54iC.9Mg@cluster0.0a811.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const userCollection = client.db("foodExpress").collection("user");

        // GET User : display/get/read users
        app.get('/user', async(req, res)=>{
            // query for searching 
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        });

        // UPDATE user : update a user
        app.get('/user/:id', async(req, res)=>{
            const id = req.params.id;
            // query for serching
            const query = {_id: ObjectId(id)};
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        // POST User : add/create a new user
        app.post('/user', async(req, res)=>{
            const newUser = req.body;
            console.log("Adding new user", newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        // UPDATE user : update a user
        app.put('/user/:id', async(req,res)=>{
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                // $set: updatedUser;
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }                
            }
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);          

        })

        // DELETE user : delete a user
        app.delete('/user/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        

    } 
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


/* client.connect(err => {
  const collection = client.db("foodExpress").collection("users");
  console.log("db connected");
  // perform actions on the collection object
  client.close();
}); */
app.get('/', (req, res)=>{
    res.send("Running My Node CURD Server.")
})

app.listen(port, ()=>{
    console.log(`CURD server is runnig on port no : ${port}`)
})