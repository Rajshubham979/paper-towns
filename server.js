const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Check if locations.txt exists, create it if it doesn't
if (!fs.existsSync('locations.txt')) {
  fs.writeFileSync('locations.txt', '', (err) => {
    if (err) {
      console.error('Error creating file:', err);
    }
  });
  console.log('locations.txt file created.');
}

// Route to serve the homepage
app.get('/', (req, res) => {
  res.send('Welcome to the Live Location Logger!');
});

// Route to handle POST requests for saving location data
app.post('/location', (req, res) => {
  const { latitude, longitude } = req.body;

  // Prepare the data to be logged
  const logEntry = `Latitude: ${latitude}, Longitude: ${longitude}\n`;

  // Append the location data to a file
  fs.appendFile('locations.txt', logEntry, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).json({ message: 'Failed to save location' });
    }

    // Respond with a success message
    res.json({ message: 'Location saved successfully' });
  });
});

// Route to view all saved location data
app.get('/locations', (req, res) => {
  // Read the content of the locations.txt file
  fs.readFile('locations.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ message: 'Failed to read location data' });
    }

    // Respond with the content of the file
    res.send(`<pre>${data}</pre>`); // Preformatted for better display in the browser
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
