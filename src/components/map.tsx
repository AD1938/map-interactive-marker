import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

type Location = {
  lat: number;
  lng: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
};

type MarkerWithAnimation = Location & { animation: google.maps.Animation | undefined };

const initialLocations: MarkerWithAnimation[] = [
  { lat: 43.8561, lng: -79.3370, name: 'Head Quarter Office (Markham)', address: 'Unit 101, 200 Town Centre Boulevard, Markham, Ontario, Canada, L3R 8H8', phone: '+905-234-6666', email: 'info@wellcareinsurance.ca', animation: undefined },
  { lat: 43.8477, lng: -79.3822, name: 'Markham Office', address: 'Unit 703, 90 Allstate Parkway, Markham, ON L3R 6H3', phone: '+289-301-5887', animation: undefined },
  { lat: 43.7725, lng: -79.3341, name: 'North York Office', address: 'Unit 502, 200 Consumers Rd., North York, ON M2J 4R4', phone: '+289-301-5865', animation: undefined },
  { lat: 43.7985, lng: -79.5335, name: 'Vaughan Office', address: 'Unit 202, 11 Cidermill Ave, Vaughan, ON, L4K 4B6', phone: '+905-760-5007', animation: undefined }
];

const containerStyle = {
  width: '600px',
  height: '400px'
};

const MyGoogleMapComponent: React.FC = () => {
  const [locations, setLocations] = useState<MarkerWithAnimation[]>(initialLocations);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleLocationSelect = (location: MarkerWithAnimation) => {
    if (map) {
      map.panTo(new google.maps.LatLng(location.lat, location.lng));
      map.setZoom(15);
    }
    setLocations(locations.map(loc => ({
      ...loc,
      animation: loc === location ? google.maps.Animation.BOUNCE : undefined
    })));
    setTimeout(() => {
      setLocations(locations.map(loc => ({
        ...loc,
        animation: undefined
      })));
    }, 3000);
  };

  const handleMarkerClick = (location: MarkerWithAnimation) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
    window.open(url, '_blank');
  };

  const handleLocationHover = (location: MarkerWithAnimation) => {
    setLocations(locations.map(loc => ({
      ...loc,
      animation: loc === location ? google.maps.Animation.BOUNCE : undefined
    })));
  };

  const handleMouseLeave = () => {
    setLocations(locations.map(loc => ({
      ...loc,
      animation: undefined
    })));
  };

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  return (
    <div style={{ display: 'flex' }}>
      <LoadScript googleMapsApiKey="AIzaSyCJ-K9bkSkIGT7FG-JOIMj5x-wU2CCncqI">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={initialLocations[0]}
          zoom={10}
          onLoad={onLoad}
        >
          {locations.map(location => (
            <Marker
              key={`${location.lat}-${location.lng}`}
              position={{ lat: location.lat, lng: location.lng }}
              animation={location.animation}
              onClick = {() => handleMarkerClick(location)}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      <div style={{ width: '400px', marginLeft: '20px', overflowY: 'auto', maxHeight: '400px', paddingLeft: '10px' }}>
        {locations.map(location => (
          <div key={location.address} onMouseEnter={() => handleLocationHover(location)} onMouseLeave={handleMouseLeave} onClick={() => handleLocationSelect(location)} style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '10px', cursor: 'pointer' }}>
            <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px'  }}>{location.name}</div>
            <div onClick={(e) => e.stopPropagation()}><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} target="_blank" rel="noopener noreferrer">{location.address}</a></div>
            <div style={{color: '#666', marginBottom: '5px'}}>{location.phone}</div>
            {location.email && <div style={{ color: '#666' }}>{location.email}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyGoogleMapComponent
