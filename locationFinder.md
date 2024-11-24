import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import axios from 'axios';

const DisplayMap = ({userLatitude2, userLongitude2}) => {

    const [latitude, setLatitude] = useState(56.9496);
    const [longitude, setLongitude] = useState(24.1052);

    useEffect(() => {
        if (userLatitude2 != null) {
            setLatitude(userLatitude2);
        } else if(userLongitude2 != null) {
            setLongitude(userLongitude2);
        } 
        const locationLookup = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/reverse-geocode', { latitude, longitude });
                const { city, country } = response.data;
                console.log(`${city}, ${country}`);
                console.log(`${latitude}, ${longitude}`);
            } catch (error) {
                console.error('Error fetching location details:', error.message);
                console.log('Failed to fetch location details');
            }
        }
        locationLookup();
    }, [userLatitude2, userLongitude2])
    



    return (
        <div style={{ padding: '20px' }}>
            <MapComponent latitude={latitude} longitude={longitude} />
        </div>
    );
};

export default DisplayMap;








import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@fortawesome/fontawesome-free/css/all.css'; // Import FontAwesome CSS

const MapComponent = ({ latitude, longitude }) => {
    const mapRef = useRef(null); // Reference for the map container

    useEffect(() => {
        if (!mapRef.current) {
            // Initialize the map if it hasn't been created yet
            const map = L.map('map').setView([latitude, longitude], 13);

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            // Create a custom icon using FontAwesome
            const customIcon = L.divIcon({
                className: 'custom-div-icon', // Custom class for styling
                html: '<i class="fas fa-map-marker-alt" style="color: red; font-size: 32px;"></i>', // FontAwesome icon
                iconSize: [30, 42], // Optional size of the icon
                iconAnchor: [15, 42], // Anchor point of the icon
            });

            // Add marker at initial position with the custom icon
            const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
            mapRef.current = { map, marker };
        } else {
            // Update map view and marker position when coordinates change
            const { map, marker } = mapRef.current;
            map.setView([latitude, longitude], 13);
            marker.setLatLng([latitude, longitude]);
        }
    }, [latitude, longitude]);

    return <div id="map" style={{ height: '300px', width: '300px' }}></div>; // Small map container
};

export default MapComponent;






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




