# nusaybinconverter
Powerful File Converter



          {result && (
            <div>
              {result.error ? (
                <p>{result.error}</p>
              ) : (
                <div>
                  <span>Country:{result}</span>
                  <span>City:{result}</span>
                  <span>Country:{result}</span>
                  <span>Country:{result}</span>
                </div>
              )}
            </div>
          )}



import React, { useState } from 'react';
import MapComponent from './MapComponent';
import axios from 'axios';

const App = () => {
    const [latitude, setLatitude] = useState(56.9496);
    const [longitude, setLongitude] = useState(24.1052);
    const [locationDetails, setLocationDetails] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/reverse-geocode', { latitude, longitude });
            const { city, country } = response.data;
            setLocationDetails(`${city}, ${country}`);
        } catch (error) {
            console.error('Error fetching location details:', error.message);
            setLocationDetails('Failed to fetch location details');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <label>
                    Latitude:
                    <input
                        type="number"
                        value={latitude}
                        onChange={(e) => setLatitude(parseFloat(e.target.value))}
                        style={{ margin: '0 10px' }}
                    />
                </label>
                <label>
                    Longitude:
                    <input
                        type="number"
                        value={longitude}
                        onChange={(e) => setLongitude(parseFloat(e.target.value))}
                        style={{ margin: '0 10px' }}
                    />
                </label>
                <button type="submit">Update Map</button>
            </form>
            <p>{locationDetails}</p>
            <MapComponent latitude={latitude} longitude={longitude} />
        </div>
    );
};

export default App;







