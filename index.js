const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express()

//Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mz4sk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service');
        app.get("/service", async(req, res) => {
            const query = {};
            const cursore = serviceCollection.find(query);
            const services = await cursore.toArray();
            res.send(services)
        })

        app.get('/service/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            // console.log("service === ",service);
            // console.log("id==id",query);
            res.send(service);
        })

        app.post("/service", async (req, res)=>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })
        app.delete("/service/:id", async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        // await 
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Worlddd!')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})