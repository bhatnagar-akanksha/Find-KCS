
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, '../my-frontend')));

// MongoDB connection
// mongoose.connect('mongodb+srv://mongo:mongo@cluster0.dsefd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 30000
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log(err));

// MongoDB connection
// "mongodb://"+USER+":"+PASSWORD+"@"+CONNECTION_STRING+"/?authSource="+DB_NAME+"&authMechanism=SCRAM-SHA-256"

mongoose.connect('mongodb://KCSDEV:a0dpM1Bps_r9DA0633Pk@nectar-a:27021,nectar-b:27021,nectar-c:27021/KCSDEV?authSource=KCSDEV&authMechanism=SCRAM-SHA-256', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // serverSelectionTimeoutMS: 30000
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


// API Routes
app.use('/api', apiRoutes);
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
