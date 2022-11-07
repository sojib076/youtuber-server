const express = require('express');
const app = express();
port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
 require('dotenv').config();
app.use(cors());
// express json 
app.use(express.json());

/// mongodb connection


const uri = `mongodb+srv://${process.env.Mongodb_name}:${process.env.Mongodb_Password}@cluster0.pucpolg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// mongodb api
const run = () => {
    const service = client.db("youtuber").collection("services");
    try {
        app.get('/service', async(req, res) => {
            const query = {};
            const result = await service.find(query).toArray();
             res.send(result);
             console.log(result);
    
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