const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());//Set express middleware to parse JSON. In other words,
//if you send data to backedn in req.body then you need this code

const cors = require("cors");
app.use(cors());

// Load environment variables from .env file
dotenv.config();

// Reverse geocoding endpoint
app.post('/api/reverse-geocode', async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
      const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = response.data;
      res.json({
          city: data.address.city || data.address.town || data.address.village || 'Unknown',
          country: data.address.country,
      });
  } catch (error) {
      console.error('Error with reverse geocoding:', error.message);
      res.status(500).json({ error: 'Failed to fetch location data' });
  }
});

// IP-based geolocation endpoint
app.post("/api/get-coordinates", async (req, res) => {
  const { ipInput } = req.body; // Get IP address from the request body
  console.log(ipInput);
  try {
      const apiKey = process.env.IPAPI_KEY; // Load API key from .env file
     const response = await axios.get(`http://api.ipapi.com/api/${ipInput}?access_key=${apiKey}`);
      const { latitude, longitude } = response.data;
      // Send latitude and longitude in the response
      console.log(response.data);
      res.json({ latitude, longitude });
  } catch (error) {
      console.error("Error fetching geolocation data:", error.message);
      res.status(500).json({ error: "Failed to fetch geolocation data" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));