const express = require("express");
const axios = require("axios");
const app = express();

app.use(express());

//Reverse geocoding endpoint
app.post("/api/reverse-geocode", async (req, res) => {
  const {latitude, longitude} = req.body;

  try {
    
  } catch (error) {
    console.log("Error with reverse geocoding endpoint: ", error.message);
    res.status(500).json({error: "Failed to fetch location data"});
  }
})


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));