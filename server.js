const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const projectRoutes = require('./routes/projectRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const revenueRoutes = require('./routes/revenueRoutes');
const assetRoutes = require('./routes/assetRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const roleRoutes = require('./routes/roleRoutes')



app.use('/projects', projectRoutes);
app.use('/expense', expenseRoutes);
app.use('/revenue', revenueRoutes);
app.use('/asset', assetRoutes);
app.use('/employee', employeeRoutes);
app.use('/auth', authRoutes);
app.use('/client', clientRoutes);
app.use('/communication', communicationRoutes);
app.use('/invoice', invoiceRoutes);
app.use('/quote', quoteRoutes);
app.use('/role', roleRoutes);


async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB.");
    
    // Here you can setup API endpoints that use the client to interact with MongoDB
    app.get('/', (req, res) => {
      res.send('Expense Tracker API is running.');
    });
    
    // Additional routes and logic here

  } catch (e) {
    console.error(e);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
