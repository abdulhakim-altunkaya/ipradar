import React, { useState } from 'react';
import axios from 'axios';
import "../styles/button.css";
import DisplayInfo from "./DisplayInfo";
import DisplayMap from "./DisplayMap";


function Main() {
    const [ipInput, setIpInput] = useState("");
    const [result1, setResult1] = useState(null);
    const [userLatitude, setUserLatitude] = useState(null);
    const [userLongitude, setUserLongitude] = useState(null);

    const handleGeolocation = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/get-coordinates", { ipInput });
            console.log(response.data);
            const { latitude, longitude } = response.data;
            setUserLatitude(latitude);
            setUserLongitude(longitude);
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        } catch (error) {
            console.error("Error fetching geolocation data:", error.message);
        }
    };

    return (
        <div className='mainArea'>
          <h1>IP RADAR</h1>
          <div className='userArea'>
              <input type='text' placeholder='Enter IP address' 
                value={ipInput} onChange={ (e) => setIpInput(e.target.value)}/>
              <button className='button1010' onClick={handleGeolocation}>ANALYZE</button>
          </div>
          <div className='displayArea'>
            <DisplayInfo result2 = {result1} />
            <DisplayMap userLatitude2={userLatitude} userLongitude2={userLongitude}/>
          </div>
        </div>
    );
}

export default Main;
