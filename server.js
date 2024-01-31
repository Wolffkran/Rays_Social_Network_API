const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/socialnetwork', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes (Create these later)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/thoughts', require('./routes/thoughtRoutes'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
