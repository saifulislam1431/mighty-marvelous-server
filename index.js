const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();

        const toysCollection = client.db("mightyMarvelousToys").collection("allToys");

        // Total Toy Count
        app.get("/totalToys", async (req, res) => {
            const result = await toysCollection.estimatedDocumentCount();
            res.send({ totalToys: result })
        })

        // Get All Toys
        app.get("/allToys", async (req, res) => {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const sortValue = parseInt(req.query.sort)

            const sortBy = { price: sortValue }

            const skip = page * limit;
            const result = await toysCollection.find().sort(sortBy).skip(skip).limit(limit).toArray();
            res.send(result)
        })


        // Single Toy
        app.get("/allToys/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query)
            res.send(result);
        })

        // Single Toy
        app.get("/updateToy/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query)
            res.send(result);
        })


        // Single Toy
        app.get("/deleteToy/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query)
            res.send(result);
        })


        // Toy by category

        app.get("/tabsToys/:text", async (req, res) => {
            const query = req.params.text;
            console.log(query);
            if (req.params.text == "Marvel" || req.params.text == "DC Comics" || req.params.text == "Image" || req.params.text == "Dark Horse") {
                const result = await toysCollection.find({ toySubCategory: req.params.text }).toArray();
                return res.send(result);
            }

            const result = await toysCollection.find({}).toArray();
            res.send(result);

        })

        // Single Toy
        app.get("/userToy/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query)
            res.send(result);
        })


        // Toy by user email
        app.get("/userToy", async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { sellerEmail: req.query.email }
            };
            const result = await toysCollection.find(query).toArray();
            res.send(result)
        })


        // Search toys by name
        const indexKeys = { toyName: 1 };
        const indexOptions = { name: "title" }
        const result = await toysCollection.createIndex(indexKeys, indexOptions);

        app.get("/toyByName/:text", async (req, res) => {
            const text = req.params.text;
            const result = await toysCollection.find({
                $or: [
                    { toyName: { $regex: text, $options: "i" } }
                ],
            }).toArray()
            res.send(result)
        })

        // Add Toy API
        app.post("/addToys", async (req, res) => {
            const body = req.body;
            const result = await toysCollection.insertOne(body);
            res.send(result);
        })

        // Delete Api
        app.delete("/deleteToy/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query)
            res.send(result);
        })

        //Update Api
        app.put("/updateToy/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updatedData = req.body;
            const updateDoc = {
                $set: {
                    toyName: updatedData.toyName, toySubCategory: updatedData.toySubCategory,
                    sellerName: updatedData.sellerName, sellerEmail: updatedData.sellerEmail, price: updatedData.price,
                    quantity: updatedData.quantity,
                    rating: updatedData.rating,
                    photo: updatedData.photo,
                    details: updatedData.details
                }
            }
            const result = await toysCollection.updateOne(filter, updateDoc, options);
            res.send(result);
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