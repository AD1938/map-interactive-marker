import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

type Location = {
  lat: number;
  lng: number;
  name: string;
};

type MarkerWithAnimation = Location & { animation: google.maps.Animation | undefined };

const initialLocations: Location[] = [
  { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
  { lat: 37.8049, lng: -122.2708, name: 'Oakland' },
  { lat: 37.7599, lng: -122.4148, name: 'Mission District' }
];

const containerStyle = {
  width: '600px',
  height: '400px'
};

const MyGoogleMapComponent: React.FC = () => {
  const [locations, setLocations] = useState<MarkerWithAnimation[]>(initialLocations.map(loc => ({ ...loc, animation: undefined })));
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleLocationSelect = (selectedLocation: MarkerWithAnimation) => {
    const currentZoom = map?.getZoom() || 10;
    const newZoom = currentZoom > 15 ? currentZoom : 15;

    if (map) {
      map.panTo(new google.maps.LatLng(selectedLocation.lat, selectedLocation.lng));
      map.setZoom(newZoom);
    }
  };

  const handleMouseEnter = (location: Location) => {
    setLocations(locations.map(loc => ({
      ...loc,
      animation: loc.lat === location.lat && loc.lng === location.lng ? google.maps.Animation.BOUNCE : undefined
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
              onClick={() => handleLocationSelect(location)}
              animation={location.animation}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      <div style={{ marginLeft: '20px' }}>
        <h3>Locations</h3>
        <ul>
          {locations.map(location => (
            <li
              key={`${location.lat}-${location.lng}`}
              style={{ cursor: 'pointer', marginBottom: '10px' }}
              onClick={() => handleLocationSelect(location)}
              onMouseEnter={() => handleMouseEnter(location)}
              onMouseLeave={handleMouseLeave}
            >
              {location.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MyGoogleMapComponent;
