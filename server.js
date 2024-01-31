const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/socialnetwork', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api', require('./routes/api'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
