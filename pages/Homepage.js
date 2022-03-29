import React from 'react';
import {
  Switch,
  Text,
  SafeAreaView,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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
  const [text, onChangeText] = React.useState('Useless Text');
  const [distance, setDistance] = React.useState(0);

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

  function goToCurrentLocation() {
    Geolocation.getCurrentPosition(pos => {
      const crd = pos.coords;
      console.log(crd);
      setRegion({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
    }).catch(err => {
      console.log(err);
    });
  }

  React.useEffect(() => {
    /// 1.  Subscribe to events.
    const onLocation = BackgroundGeolocation.onLocation(location => {
      console.log('[onLocation]', location);
      setLocation(JSON.stringify(location, null, 2));
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
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
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  }, []);

  React.useEffect(() => {
    Geolocation.getCurrentPosition(pos => {
      const crd = pos.coords;
      setRegion({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
    }).catch(err => {
      console.log(err);
    });
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation('');
    }
  }, [enabled]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f4f4f4'}}>
      <View style={styles.header}>
        <View style={{marginLeft: 16, marginVertical: 4}}>
          <Button onPress={gotoTripPage} title="Trips" color="black"></Button>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
        />
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        initialRegion={region}
        region={region}>
        <Marker coordinate={region} />
      </MapView>

      <View style={styles.footer}>
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
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            borderRadius: 25,
            width: 50,
            height: 50,
            backgroundColor: 'gray',
            marginLeft: 30,
            marginTop: 15,
          }}
          onPress={goToCurrentLocation}>
          <Text style={{alignSelf: 'center'}}>ORTA</Text>
        </TouchableOpacity>

        <Text style={styles.kmText}>{distance} KM </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  kmText: {
    marginTop: 15,
    fontSize: 24,
    marginLeft: 30,
    alignSelf: 'center',
  },
  footer: {
    height: 50,
    backgroundColor: '#f4f4f4',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
  },
  middleIcon: {
    backgroundColor: 'black',
    borderRadius: 15,
    width: 30,
    height: 30,
    marginLeft: 30,
  },
  input: {
    marginLeft: 12,
    marginRight: 16,
    backgroundColor: 'gray',
    borderRadius: 12,
    flex: 1,
    marginVertical: 8,
  },
  header: {
    height: 50,
    backgroundColor: '#f4f4f4',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
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
    marginTop: 15,
    marginLeft: 30,
    backgroundColor: '#4B6277',
    borderRadius: 14,
    height: 50,
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
