import React, { useState } from 'react';
import "../styles/button.css";
import DisplayInfo from "./DisplayInfo";
import DisplayMap from "./DisplayMap";


function Main() {
    const [ipInput, setIpInput] = useState("");
    const [result1, setResult1] = useState(null);

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
