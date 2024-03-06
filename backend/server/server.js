const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/book-eventdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Define MongoDB schema and model for events
const eventSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  persons: {type:Number, required:true},
  date: String,
});

const Event = mongoose.model('Event', eventSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware to allow cross-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Route to handle event booking
app.post('/events/book-event', async (req, res) => {
  console.log('Received request to book event:', req.body);
  try {
    const { name, phoneNumber, email, persons, date } = req.body;
    console.log('Values received for persons:', persons);

    const newEvent = new Event({
      name: name,
      phoneNumber: phoneNumber,
      email: email,
      persons: persons,
      date: date,
    });

    console.log('New event before save:', newEvent);

    const bookedEvent = await newEvent.save();

    console.log('Event booked successfully:', bookedEvent);


    res.status(201).json(bookedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Simple route for the root path
app.get('/', (req, res) => {
  res.send('Welcome to your server!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
