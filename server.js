const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 5000;
const cors = require('cors'); // ✅ import cors
// MongoDB connection URI
app.use(cors());
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let productsCollection;

app.use(express.json());

// Connect to MongoDB and start server
async function startServer() {
  try {
    await client.connect();
    const db = client.db('myshop'); // Use "myshop" database
    productsCollection = db.collection('products');

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

startServer();

// 👉 Add a product

app.post('/add-product', async (req, res) => {
  const product = req.body;

  try {
    const result = await productsCollection.insertOne({ ...product });
    res.status(201).json({ _id: result.insertedId, ...product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// 👉 Get all products
app.get('/', async (req, res) => {
  try {
    const products = await productsCollection.find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 👉 Get single product by ID
app.get('/product/:id', async (req, res) => {
  try {
    const product = await productsCollection.findOne({ _id: new ObjectId(req.params.id) });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Invalid product ID' });
  }
});
