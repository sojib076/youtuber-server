const express = require('express');
const app = express();
port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
 require('dotenv').config();
app.use(cors());
// express json 
app.use(express.json());

/// mongodb connection


const uri = `mongodb+srv://${process.env.Mongodb_name}:${process.env.Mongodb_Password}@cluster0.pucpolg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// mongodb api
const run = async() => {
    const service = client.db("youtuber").collection("services");
    const reviews = client.db("youtuber").collection("reviews");
    try {
        app.get('/service', async(req, res) => {
            const query = {};
            const cursor = service.find(query).limit(3);
            const result = await cursor.toArray();
             res.send(result);
             
        })
        app.get('/services', async(req, res) => {
            const query = {};
            const result = await service.find(query).toArray();
             res.send(result);
    
        })
        
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await service.findOne(query);
             res.send(result);
        })
        app.post('/reviews', async(req, res) => {
            const query = req.body;
            // fetch data from serviceid);
            console.log(req.headers.serviceid);
            const result = await reviews.insertOne(query);
             res.send(result);
        })
        app.get('/reviews', async(req, res) => { 
            const query = req.headers.serviceid
            

        
            const result = await reviews.find({"serviceid":query}).toArray();
                res.send(result);
        })

    } catch (error) {
        console.log(error);
    }
        
    
}
run();


//listen to port
app.listen(port, () => { 
    console.log(`Server is running on port: ${port}`);
})