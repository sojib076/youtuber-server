const express = require('express');
const app = express();
port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
 require('dotenv').config();
app.use(cors());
// express json 
app.use(express.json());
const jwt = require('jsonwebtoken');


const uri = `mongodb+srv://${process.env.Mongodb_name}:${process.env.Mongodb_Password}@cluster0.pucpolg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const verifytoken = (req,res,next) => 
{
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);
    const token =  authHeader.split(' ')[1];
    console.log(token);
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
        if(err) {
            return res.sendStatus(403);
        }
        req.decoded = decoded;
        next();
    })}

// mongodb api
const run = async() => {



    const service = client.db("youtuber").collection("services");
    const reviews = client.db("youtuber").collection("reviews");
    try {
        app.get('/service', async(req, res) => {
            const query = {};
            const cursor = service.find(query).sort({myDate:-1}).limit(3);
            const result = await cursor.toArray();
           
             res.send(result);
             
        })
        app.get('/services', async(req, res) => {
            const query = {};
            const result = await service.find(query).toArray();
             res.send(result);
    
        })
        app.post('/addservices', async(req, res) => { 
          
            const result = await service.insertOne(req.body);
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
        
            const result = await reviews.insertOne(query);
             res.send(result);
        })
        app.get('/reviews',async(req, res) => { 
            let  query = {};
            if (req.headers.serviceid) {
                query = {serviceid:req.headers.serviceid}
            }
            const result = await reviews.find(query).sort({myDate:-1}).toArray();
             res.send(result);
        })

        app.get('/userreviews',verifytoken,async(req, res) => {
                        const decoded = req.decoded.loginuser;
                    if (decoded !==req.query.email) { 
                        return res.sendStatus(403);
                    }
                    const query =  req.query.email;     
                    const result = await reviews.find({'email':query}).toArray();
                   res.send(result);
                    
        })
        // delete reviews
        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await reviews.deleteOne(query);
             res.send(result);
        })
        // update reviews
        app.patch('/reviews/:id', async(req, res) => { 
            const id = req.params.id;
            console.log(id);
            const query = {_id:ObjectId(id)}
            const info = req.body;
            const result = await reviews.updateOne(query,{$set:info});
                res.send(result);
        })
            // reviews by id
        app.get('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await reviews.findOne(query);
            res.send(result);
        })
        // handel jwt token
        app.post('/jwt',(req,res)=>{
             const user = req.body;
                // const token = jwt.sign(user,process.env.ACCESS_TOKEN);
                const token = jwt.sign(user,process.env.ACCESS_TOKEN);
                res.send({token});
        } )

    } catch (error) {
        console.log(error);
    }
        
    
}
run();


//listen to port
app.listen(port, () => { 
    console.log(`Server is running on port: ${port}`);
})