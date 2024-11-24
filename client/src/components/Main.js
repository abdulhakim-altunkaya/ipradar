import React, { useState } from 'react';
import axios from 'axios';
import "../styles/button.css";
import DisplayInfo from "./DisplayInfo";
import DisplayMap from "./DisplayMap";


function Main() {
    const [ipInput, setIpInput] = useState("");
    const [result1, setResult1] = useState(null);

    const [ip, setIp] = useState(""); // State for the input IP address
    const handleGeolocation = async () => {
        try {
            // Send the IP to the backend
            const response = await axios.post("http://localhost:5000/api/get-coordinates", { ip });
            const { latitude, longitude } = response.data;

            // Log the coordinates in the console
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        } catch (error) {
            console.error("Error fetching geolocation data:", error.message);
        }
    };

    const handleLookup = async () => {
      try {
        setResult1("Lookup sucessful");
/*         const response = await fetch(`/api/lookup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip }),
        });
        const data = await response.json();
        setResult(data); */
      } catch (error) {
        console.log(error.message);
        setResult1({error: "Unable to fetch details"});
      }
    }

    return (
        <div className='mainArea'>
          <h1>IP RADAR</h1>
          <div className='userArea'>
              <input type='text' placeholder='Enter IP address' 
                value={ipInput} onChange={ (e) => setIpInput(e.target.value)}/>
              <button className='button1010' onClick={handleLookup}>ANALYZE</button>
          </div>
          <div className='displayArea'>
            <DisplayInfo result2 = {result1} />
            <DisplayMap/>
          </div>




        </div>
    );
}

export default Main;
