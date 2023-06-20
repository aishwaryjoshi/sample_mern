const { get } = require('http');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://aishwaryjoshi:aishwary@aishwary.l9vulwl.mongodb.net/?retryWrites=true&w=majority";
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
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
async function add_user(user, res) {
    if (client.isConnected != true) {
        await client.connect();
    }
    const database = client.db('voosh_new');
    const collection = database.collection('users');
    const result = await collection.insertOne(user);
    if (res != null) {
        res.status(201).json({ message: 'User data saved successfully' })
    };
}
async function add_order(order, res) {
    if (client.isConnected != true) {
        await client.connect();
    }
    const database = client.db('voosh_new');
    const collection = database.collection('orders');
    const result = await collection.insertOne(order);
    res.status(201).json({ message: 'Order data saved successfully' });
}

async function get_orders(email, res) {
    if (client.isConnected != true) {
        await client.connect();
    }
    const database = client.db('voosh_new');
    const collection = database.collection('orders');
    const query = { ['email']: email };
    const result = await collection.find(query).toArray();
    console.log(result);
    res.status(201).json({ data: result });
}

async function get_user(email) {
    if (client.isConnected != true) {
        await client.connect();
    }
    const database = client.db('voosh_new');
    const collection = database.collection('users');
    const query = { ['email']: email };
    const result = await collection.findOne(query);
    console.log(result);
    return result;
}

run().catch(console.dir);
module.exports.add_user = add_user;
module.exports.add_order = add_order;
module.exports.get_orders = get_orders;
module.exports.get_user = get_user;
