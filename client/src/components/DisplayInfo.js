import React from 'react'

function DisplayInfo({dataContinent2, dataCountry2, dataCity2, dataTypeConnection2, dataTypeIP2, dataLatitude2, dataLongitude2}) {
  return (
    <div className='infoArea'>
      <h3>IP DETAILS</h3>
      <span><strong>Continent:</strong>  {dataContinent2}</span> <br/>
      <span><strong>Country:</strong> {dataCountry2}</span> <br/>
      <span><strong>City:</strong> {dataCity2}</span> <br/>
      <span><strong>Latitude:</strong> {dataLatitude2}</span> <br/>
      <span><strong>Longitude:</strong> {dataLongitude2}</span> <br/>
      <span><strong>Connection Type:</strong> {dataTypeConnection2}</span> <br/>
      <span><strong>IP Type:</strong> {dataTypeIP2}</span>
    </div>
  )
}

export default DisplayInfo;