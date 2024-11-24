import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/button.css";
import DisplayInfo from "./DisplayInfo";
import DisplayMap from "./DisplayMap";


function Main() {
    const [ipInput, setIpInput] = useState("");
    //variables for DisplayInfo component
    const [dataContinent, setDataContinent] = useState(null);
    const [dataCountry, setDataCountry] = useState(null);
    const [dataCity, setDataCity] = useState(null);
    const [dataTypeConnection, setDataTypeConnection] = useState(null);
    const [dataTypeIP, setDataTypeIP] = useState(null);
    //variables for DisplayMap component
    const [userLatitude, setUserLatitude] = useState(null);
    const [userLongitude, setUserLongitude] = useState(null);

    useEffect(() => {
      const getData = () => {
        // Fire-and-forget request to log visitor data
        axios.post("http://localhost:5000/serversavevisitor", {})
          .then((response) => {
            console.log('Visitor logged successfully:', response.data.myMessage);
          })
          .catch((error) => {
            console.error('Error logging visit:', error.response?.data?.myMessage || error.message);
          });
      };
    
      getData(); // Call the function
    }, []);
    

    const handleGeolocation = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/get-coordinates", { ipInput });
            //we use axios "post" here instead of "get" because we sent data in req.body
            const { latitude, longitude, country_name, city, connection_type, type, continent_name } = response.data;
            setUserLatitude(latitude);
            setUserLongitude(longitude);
            setDataContinent(continent_name);
            setDataCountry(country_name);
            setDataCity(city);
            setDataTypeConnection(connection_type);
            setDataTypeIP(type);
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
            <DisplayInfo dataContinent2={dataContinent} dataCountry2={dataCountry} 
              dataCity2={dataCity} dataTypeConnection2={dataTypeConnection} dataTypeIP2={dataTypeIP}
              dataLatitude2={userLatitude} dataLongitude2={userLongitude} />
            <DisplayMap userLatitude2={userLatitude} userLongitude2={userLongitude}/>
          </div>
        </div>
    );
}

export default Main;
