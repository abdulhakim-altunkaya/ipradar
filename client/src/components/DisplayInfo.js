import React from 'react'

function DisplayInfo({dataContinent2, dataCountry2, dataCity2, dataTypeConnection2, dataTypeIP2, dataLatitude2, dataLongitude2}) {
  return (
    <div className='infoArea'>
      <h4>IP DETAILS</h4>
      <span>Continent: {dataContinent2}</span> <br/>
      <span>Country: {dataCountry2}</span> <br/>
      <span>City: {dataCity2}</span> <br/>
      <span>Latitude: {dataLatitude2}</span> <br/>
      <span>Longitude: {dataLongitude2}</span> <br/>
      <span>Connection Type: {dataTypeConnection2}</span> <br/>
      <span>IP Type: {dataTypeIP2}</span>
    </div>
  )
}

export default DisplayInfo;