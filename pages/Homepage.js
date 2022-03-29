import React from 'react';
import {
  Switch,
  Text,
  SafeAreaView,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import BackgroundGeolocation, {
  Location,
  Subscription,
} from 'react-native-background-geolocation';

import Geolocation from '@react-native-community/geolocation';
import MapView, {PROVIDER_GOOGLE, Marker, LatLng} from 'react-native-maps';

const Homepage = props => {
  const [enabled, setEnabled] = React.useState(false);
  const [location, setLocation] = React.useState('');
  const [coord, setCoord] = React.useState(LatLng);
  const [region, setRegion] = React.useState({
    latitude: 39.890622,
    longitude: 32.793109,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  function gotoTripPage() {
    props.navigation.navigate('Trippage');
  }

  const zoomDelta = 0.005;
  const onZoom = zoomSign => {
    const zoomedRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta - zoomDelta * zoomSign,
      longitudeDelta: region.longitudeDelta - zoomDelta * zoomSign,
    };
    setRegion(zoomedRegion);
  };
  function onZoomIn() {
    console.log('1');
    onZoom(1);
  }
  const onZoomOut = () => onZoom(-1);

  function openFreeDrive() {
    setEnabled(!enabled);
  }

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

  React.useEffect(() => {
    /// 1.  Subscribe to events.
    const onLocation = BackgroundGeolocation.onLocation(location => {
      console.log('[onLocation]', location);
      setLocation(JSON.stringify(location, null, 2));
    });

    const onMotionChange = BackgroundGeolocation.onMotionChange(event => {
      console.log('[onMotionChange]', event);
    });

    const onActivityChange = BackgroundGeolocation.onActivityChange(event => {
      console.log('[onMotionChange]', event);
    });

    const onProviderChange = BackgroundGeolocation.onProviderChange(event => {
      console.log('[onProviderChange]', event);
    });

    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true, // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
      batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {
        // <-- Optional HTTP headers
        'X-FOO': 'bar',
      },
      params: {
        // <-- Optional HTTP params
        auth_token: 'maybe_your_server_authenticates_via_token_YES?',
      },
    }).then(state => {
      setEnabled(state.enabled);
      console.log(
        '- BackgroundGeolocation is configured and ready: ',
        state.enabled,
      );
    });

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  }, []);

  /// 3. start / stop BackgroundGeolocation
  React.useEffect(() => {
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation('');
    }
  }, [enabled]);

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{flex: 1}}
      initialRegion={region}>
      <View style={styles.freeDrivingButton}>
        <TouchableOpacity
          style={{flexDirection: 'row', justifyContent: 'space-between'}}
          onPress={openFreeDrive}>
          {enabled ? (
            <View style={styles.lightOn} />
          ) : (
            <View style={styles.lightOff} />
          )}
          <Text style={styles.freeDrivingText}>Free Driving</Text>
        </TouchableOpacity>
      </View>
    </MapView>
  );
};

const styles = StyleSheet.create({
  lightOff: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    backgroundColor: 'gray',
    height: 30,
    width: 30,
    marginLeft: 10,
  },
  lightOn: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    backgroundColor: 'green',
    height: 30,
    width: 30,
    marginLeft: 10,
  },
  freeDrivingText: {
    color: 'white',
    alignSelf: 'center',
    marginRight: 10,
  },
  freeDrivingButton: {
    position: 'absolute',
    backgroundColor: '#4B6277',
    bottom: 30,
    start: 40,
    borderRadius: 14,
    height: 60,
    width: 140,
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    end: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 12,
  },
  button: {},
  text: {
    textAlign: 'center',
  },
  spacer: {
    marginVertical: 7,
  },
});

export {Homepage};

/*


    <View style={{flex: 1}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        initialRegion={initialRegion}>
        <SafeAreaView style={{flex: 1}}>
          <Text style={{alignSelf: 'center'}}>Haritaya yaz allasen</Text>
          <Text>Click to enable BackgroundGeolocation</Text>
          <Switch value={enabled} onValueChange={setEnabled} />
          <Text style={{fontSize: 12}}>{location}</Text>
        </SafeAreaView>
      </MapView>
    </View>


*/
