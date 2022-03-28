import React, {useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, {PROVIDER_GOOGLE, Marker, LatLng} from 'react-native-maps';
const App = () => {
  const [coord, setCoord] = useState(LatLng);
  let initialRegion = {
    latitude: 39.890622,
    longitude: 32.793109,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };
  Geolocation.getCurrentPosition(
    c => {
      setCoord({
        latitude: c.coords.latitude,
        longitude: c.coords.longitude,
      });
    },
    error => console.log(error),
    {
      enableHighAccuracy: true,
    },
  );

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{flex: 1}}
      initialRegion={initialRegion}>
      {coord !== undefined && <Marker coordinate={coord} />}
    </MapView>
  );
};
export default App;
