const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.clvmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();
        const usersCollection = client.db('collegeApp').collection('users');
        const collegeCollection = client.db('collegeApp').collection('colleges');
        const applyCollection = client.db('collegeApp').collection('apply');
        const reviewCollection = client.db('collegeApp').collection('reviews');
        //create User
        app.post('/users/:email', async (req, res) => {
            const user = req.body
            const email = req.params.email
            const query = { email }
            const isExist = await usersCollection.findOne(query)
            if (isExist) {
                return res.send(isExist)
            }
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        //add colleges
        app.post('/college', async (req, res) => {
            const data = req.body
            const result = await collegeCollection.insertOne(data)
            res.send(result)
        })

        app.put('/update/:email', async (req, res) => {
            const data = req.body
            const email = req.params.email
            const filter = { email }
            const UpdateInfo = {
                $set: {
                    name: data?.name,
                    email: data?.email,
                    college: data?.university,
                    address: data?.address,
                    
                }
            }
            const result = await usersCollection.updateOne(filter, UpdateInfo)
            res.send(result)
        })

        //get colleges
        app.get('/college', async (req, res) => {
            const search = req.query.search || "";
            let query = {
                CollegeName: {
                    $regex: search,
                    $options: "i",
                },
            };
            const result = await collegeCollection.find(query).toArray()
            res.send(result)
        })

        //get apply by id
        app.get('/college/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await collegeCollection.findOne(query)
            res.send(result)
        })

        //add apply
        app.post('/apply', async (req, res) => {
            const data = req.body
            const result = await applyCollection.insertOne(data)
            res.send(result)
        })

        //get apply by id
        app.get('/apply/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await applyCollection.findOne(query)
            res.send(result)
        })
        //get apply by email
        app.get('/applied/:email', async (req, res) => {
            const email = req.params.email
            const query = { candidateEmail: email }
            const result = await applyCollection.find(query).toArray()
            res.send(result)
        })

        //add review
        app.post('/reviews', async (req, res) => {
            const data = req.body
            const result = await reviewCollection.insertOne(data)
            res.send(result)
        })

        //get review
        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find().toArray()
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('College Apply running')
})

app.listen(port, () => {
    console.log(`College Apply running ${port}`)
})