const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8cnv71c.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const toysCollection = client.db("mightyMarvelousToys").collection("allToys");
        // Get All Toys
        app.get("/allToys", async (req, res) => {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const sortValue = parseInt(req.query.sort)

            const sortBy = {price : sortValue}

            const skip = page * limit;
            const result = await toysCollection.find().sort(sortBy).skip(skip).limit(limit).toArray();
            res.send(result)
        })

        // Search toys by name

        const indexKeys = {toyName : 1};
        const indexOptions = {name : "title"}
        const result = await toysCollection.createIndex(indexKeys , indexOptions);
        
        app.get("/toyByName/:text", async(req,res)=>{
            const text = req.params.text;
            const result = await toysCollection.find({
                $or:[
                    {toyName:{$regex:text, $options:"i"}}
                ],
            }).toArray()
            res.send(result)
        })

        // Add Toy API
        app.post("/allToys", async (req, res) => {
            const body = req.body;
            const result = await toysCollection.insertOne(body);
            res.send(result);
        })



        // Total Toy Count
        app.get("/totalToys", async (req, res) => {
            const result = await toysCollection.estimatedDocumentCount();
            res.send({ totalToys: result })
        })






        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Server successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







app.get("/", (req, res) => {
    res.send("This is Mighty Marvelous Server")
})

app.listen(port, () => {
    console.log(`This server running at port ${port}`);
})