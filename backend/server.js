// backend>server.js
const express = require('express');
const bodyParser = require('body-parser'); // Parse incoming JSON requests
const app = express();

app.use(bodyParser.json()); // Middleware to handle JSON body parsing

// Define a root route for the browser
app.get('/', (req, res) => {
  res.send('PCF Tracker Backend is Running');
});

// Login route
app.post('/login', (req, res) => {
    console.log('Login request received:', req.body); // Log request data
    const { routeNumber } = req.body;

  // Simulated user data
  const users = [
    { routeNumber: '989262', name: 'Kyle Purvis' },
    { routeNumber: '988200', name: 'Titus McKinley' },
  ];

  // Find user by route number
  const user = users.find((u) => u.routeNumber === routeNumber);

  if (user) {
    res.status(200).json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Route Number' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));