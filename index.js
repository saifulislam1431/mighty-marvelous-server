const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8cnv71c.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());









app.get("/", (req, res) => {
    res.send("This is Mighty Marvelous Server")
})

app.listen(port, () => {
    console.log(`This server running at port ${port}`);
})