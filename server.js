const express = require("express");
const app = express();
const axios = require("axios");
const path = require('path');
const dotenv = require("dotenv");
// Load environment variables from .env file
dotenv.config();
const { pool } = require("./db");
const useragent = require('useragent');

const cors = require("cors");
//app.use(cors());//This line permits any request from any website

const allowedOrigins = ['https://einsteincalculators.com', 'https://visacalculator.org', 'https://www.ipradar.org'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
}));



app.use(express.json());//Set express middleware to parse JSON. In other words,
//if you send data to backedn in req.body then you need this code


app.set('trust proxy', true);


//Then go to server.js file and make sure you serve static files from build directory:
app.use(express.static(path.join(__dirname, 'client/build')));

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
      const { latitude, longitude, country_name, city, connection_type, type, continent_name } = response.data;
      // Send latitude and longitude in the response
      console.log(response.data);
      res.json({ latitude, longitude, country_name, city, connection_type, type, continent_name });
  } catch (error) {
      console.error("Error fetching geolocation data:", error.message);
      res.status(500).json({ error: "Failed to fetch geolocation data" });
  }
});

// List of IPs to ignore (server centers, ad bots, my ip etc)
const ignoredIPs = [];
//A temporary cache to save ip addresses and it will prevent saving same ip addresses for 1 hour.
//I can do that by checking each ip with database ip addresses but then it will be too many requests to db
//We will save each visitor data to database. 
const ipCache = {}
app.post("/serversavevisitor", async (req, res) => {
  //Here we could basically say "const ipVisitor = req.ip" but my app is running on Render platform
  //and Render is using proxies or load balancers. Because of that I will see "::1" as ip data if I not use
  //this line below
  const ipVisitor = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.socket.remoteAddress || req.ip;
  let client;
  // Check if the IP is in the ignored list
  if (ignoredIPs.includes(ipVisitor)) {
    return; // Simply exit the function, doing nothing for this IP
  }
  // Check if IP exists in cache and if last visit was less than 1 hour ago
  if (ipCache[ipVisitor] && Date.now() - ipCache[ipVisitor] < 3600000) {
    return res.status(429).json({message: 'Too many requests from this IP.'});
  }

  ipCache[ipVisitor] = Date.now();//save visitor ip to ipCache
  const userAgentString = req.get('User-Agent');
  const agent = useragent.parse(userAgentString);
  
  try {
    const visitorData = {
      ip: ipVisitor,
      os: agent.os.toString(), // operating system
      browser: agent.toAgent(), // browser
      visitDate: new Date().toLocaleDateString('en-GB')
    };
    //save visitor to database
    client = await pool.connect();
    const result = await client.query(
      `INSERT INTO ipradar_visitors (ip, op, browser, date) 
      VALUES ($1, $2, $3, $4)`, [visitorData.ip, visitorData.os, visitorData.browser, visitorData.visitDate]
    );
    res.status(200).json({myMessage: "Visitor IP successfully logged"});
  } catch (error) {
    console.error('Error logging visit:', error);
    res.status(500).json({myMessage: 'Error logging visit dude'});
  } finally {
    if(client) client.release();
  }
})


//A temporary cache to save ip addresses and it will prevent spam comments and replies for 1 minute.
//I can do that by checking each ip with database ip addresses but then it will be too many requests to db
const ipCache2 = {}
app.post("/serversavecomment", async (req, res) => {
  //preventing spam comments
  const ipVisitor = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.socket.remoteAddress || req.ip;
  // Check if IP exists in cache and if last comment was less than 1 minute ago
  
  if (ipCache2[ipVisitor] && Date.now() - ipCache2[ipVisitor] < 60000) {
    return res.status(429).json({message: 'Too many comments'});
  }
 
  ipCache2[ipVisitor] = Date.now();//save visitor ip to ipCache2

  let client;
  const newComment = req.body;
  const {name, text, date} = newComment;

  try {
    client = await pool.connect();
    const result = await client.query(
      `INSERT INTO ipradar_comments (date, name, comment) values ($1, $2, $3)`, [date, name, text]
    );
    res.status(201).json({message: "Comment saved"});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error while saving comment"})
  } finally {
    if(client) client.release();
  }
});

app.post("/serversavecommentreply", async (req, res) => {
  //preventing spam replies
  const ipVisitor = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.socket.remoteAddress || req.ip;
  // Check if IP exists in cache and if last reply was less than 1 minute ago
  if (ipCache2[ipVisitor] && Date.now() - ipCache2[ipVisitor] < 60000) {
    return res.status(429).json({message: 'Too many comments'});
  }
  ipCache2[ipVisitor] = Date.now();//save visitor ip to ipCache2

  let client;
  const newComment = req.body;
  const {name, text, date, commentId} = newComment;

  try {
    client = await pool.connect(); 
    const result = await client.query(
      `INSERT INTO ipradar_comments (date, name, comment, parent_id) values ($1, $2, $3, $4)`, 
      [date, name, text, commentId]
    );
    res.status(201).json({message: "Reply saved"});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error while saving reply"})
  } finally {
    if(client) client.release();
  }
});

app.get("/servergetcomments", async (req, res) => {
  let client;
  try {
    client = await pool.connect(); 
    const result = await client.query(
      `SELECT * FROM ipradar_comments`
    );
    const allComments = await result.rows;
    if(!allComments) {
      return res.status(404).json({ message: "No comments yet"})
    }
    res.status(200).json(allComments);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error while fetching comments"})
  } finally {
    if(client) client.release();
  }
});

const ipCache3 = {}
app.post("/api/save-visitor/schengen", async (req, res) => {
  //Here we could basically say "const ipVisitor = req.ip" but my app is running on Render platform
  //and Render is using proxies or load balancers. Because of that I will see "::1" as ip data if I not use
  //this line below
  const ipVisitor = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.socket.remoteAddress || req.ip;
  let client;
  // Check if the IP is in the ignored list
  if (ignoredIPs.includes(ipVisitor)) {
    return res.status(403).json({
      resStatus: false,
      resMessage: "This IP is ignored from logging to Database",
      resErrorCode: 1
    });
  }
  // Check if IP exists in cache and if last visit was less than 16.67 minutes ago
  if (ipCache3[ipVisitor] && Date.now() - ipCache3[ipVisitor] < 1000000) {
    return res.status(429).json({
      resStatus: false,
      resMessage: "Too many requests from this IP.",
      resErrorCode: 2
    });
  }

  ipCache3[ipVisitor] = Date.now();//save visitor ip to ipCache3
  const userAgentString = req.get('User-Agent') || '';
  const agent = useragent.parse(userAgentString);

  try {
    const visitorData = {
      ip: ipVisitor,
      os: agent.os.toString(), // operating system
      browser: agent.toAgent(), // browser
      visitDate: new Date().toLocaleDateString('en-GB')
    };
    //save visitor to database
    client = await pool.connect();
    const result = await client.query(
      `INSERT INTO visitors_schengen (ip, op, browser, date) 
      VALUES ($1, $2, $3, $4)`, [visitorData.ip, visitorData.os, visitorData.browser, visitorData.visitDate]
    );
    return res.status(200).json({
      resStatus: true,
      resMessage: "Visitor successfully logged.",
      resOkCode: 1
    });
  } catch (error) {
    console.error('Error logging visit:', error);
    return res.status(500).json({
      resStatus: false,
      resMessage: "Database connection error while logging visitor.",
      resErrorCode: 3
    });
  } finally {
    if(client) client.release();
  }
});

const ipCache4 = {}
app.post("/api/save-visitor/einstein/:sectionName", async (req, res) => {
  //Here we could basically say "const ipVisitor = req.ip" but my app is running on Render platform
  //and Render is using proxies or load balancers. Because of that I will see "::1" as ip data if I not use
  //this line below
  const ipVisitor = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.socket.remoteAddress || req.ip;
  let client;
  const { sectionName } = req.params;
  
  // Check if the IP is in the ignored list
  if (ignoredIPs.includes(ipVisitor)) {
    return res.status(403).json({
      resStatus: false,
      resMessage: "This IP is ignored from logging to Database",
      resErrorCode: 1
    });
  }
  // Check if IP exists in cache and if last visit was less than 16.67 minutes ago
  if (ipCache4[ipVisitor] && Date.now() - ipCache4[ipVisitor] < 1000000) {
    return res.status(429).json({
      resStatus: false,
      resMessage: "Too many requests from this IP.",
      resErrorCode: 2
    });
  }

  ipCache4[ipVisitor] = Date.now();//save visitor ip to ipCache4
  const userAgentString = req.get('User-Agent') || '';
  const agent = useragent.parse(userAgentString);

  try {
    const visitorData = {
      ip: ipVisitor,
      os: agent.os.toString(), // operating system
      browser: agent.toAgent(), // browser
      visitDate: new Date().toLocaleDateString('en-GB')
    };
    //save visitor to database
    client = await pool.connect();
    const result = await client.query(
      `INSERT INTO visitors_einstein (ip, op, browser, date, section) 
      VALUES ($1, $2, $3, $4, $5)`, 
      [visitorData.ip, visitorData.os, visitorData.browser, visitorData.visitDate, sectionName]
    );
    return res.status(200).json({
      resStatus: true,
      resMessage: "Visitor successfully logged.",
      resOkCode: 1
    });
  } catch (error) {
    console.error('Error logging visit:', error);
    return res.status(500).json({
      resStatus: false,
      resMessage: "Database connection error while logging visitor.",
      resErrorCode: 3
    });
  } finally {
    if(client) client.release();
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


//remove "build" from gitignore before production deployment
//create "build" folder-- npm run build in client folder
//You can remove cors before production
//Fix server api routes before production, remove "localhost" part
//add environment variables
/*Also add this otherwise only index route will be visible when you deploy app to production

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

*/