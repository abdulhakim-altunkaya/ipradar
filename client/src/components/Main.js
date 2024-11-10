import React, { useState } from 'react';
import "../styles/select.css";

function Main() {
  // Available file types
  const fileTypes = ['TXT', 'PDF', 'DOCX', 'PNG', 'JPG', 'Markdown'];

  // State to store selected 'from' and 'to' file types
  const [fromType, setFromType] = useState('');
  const [toType, setToType] = useState('');

  // Handler functions for select elements
  const handleFromTypeChange = (e) => {
    setFromType(e.target.value);
  };

  const handleToTypeChange = (e) => {
    setToType(e.target.value);
  };

  return (
    <div className='mainArea'>
      <h1>Nusaybin Converter</h1>
      <div className='formAreaParent'>
        <div className='formAreaChild'>
          <label htmlFor='labelFrom'>From</label>
          <select id='labelFrom' className='selectAreas'> 
            <option value='' disabled>Select File Type</option>
            {fileTypes.map( (fileTarget1) => (
              <option value={fileTarget1} key={fileTarget1}>{fileTarget1}</option>
            ))}
          </select>
        </div>
        <div className='formAreaChild'>
          <label htmlFor='labelTo'>To</label>
          <select id='labelTo' className='selectAreas'> 
            <option value='' disabled>Select File Type</option>
            {fileTypes.map( (fileTarget2) => (
              <option key={fileTarget2} value={fileTarget2}>{fileTarget2}</option>
            ))}
          </select>
        </div>
      </div>


{/* 
      <label htmlFor="fromType">Convert from: </label>
      <select id="fromType" value={fromType} onChange={handleFromTypeChange}>
        <option value="" disabled>Select file type</option>
        {fileTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>


      <label htmlFor="toType"> to: </label>
      <select id="toType" value={toType} onChange={handleToTypeChange}>
        <option value="" disabled>Select file type</option>
        {fileTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>


      {fromType && toType && (
        <p>
          You are converting from <strong>{fromType}</strong> to <strong>{toType}</strong>.
        </p>
      )} */}
    </div>
  );
}

export default Main;
