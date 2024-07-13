// app.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(express.json());

const MONGODB_URI = 'mongodb://localhost:27017/weather';
const OPENWEATHERMAP_API_KEY = '2e9e7138926121d60baa5aebad5045d0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Route to add user
app.post('/users', async (req, res) => {
  try {
    const { email, location } = req.body;
    const user = new User({ email, location });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to update user location
app.put('/users/:id/location', async (req, res) => {
  try {
    const { location } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { location }, { new: true });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to get weather data for a user for a given day
app.get('/users/:id/weather', async (req, res) => {
  try {
    const { date } = req.query;
    const user = await User.findById(req.params.id);
    const weatherData = user.weatherData.filter(data => new Date(data.date).toDateString() === new Date(date).toDateString());
    res.send(weatherData);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to trigger weather fetch and email immediately for testing
app.post('/send-weather', async (req, res) => {
  try {
    await fetchWeatherAndSendEmail();
    res.status(200).send('Weather data fetched and emails sent.');
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch weather data and send email
const fetchWeatherAndSendEmail = async () => {
  const users = await User.find();
  for (const user of users) {
    const { latitude, longitude } = user.location;
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_API_KEY}`);
    const weatherData = response.data;
    const weatherText = `Weather report: ${weatherData.weather[0].description}`;

    // Save weather data in database
    user.weatherData.push({ date: new Date(), data: weatherData });
    await user.save();

    // Send email
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Weather Report',
      text: weatherText
    };
    await transporter.sendMail(mailOptions);
  }
};

// Schedule the task to run every minute for testing
cron.schedule('* * * * *', fetchWeatherAndSendEmail);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
