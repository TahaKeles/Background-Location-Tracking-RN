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

import mapStyle from '../mapStyle.json';

import BackgroundGeolocation, {
  Location,
  Subscription,
} from 'react-native-background-geolocation';

import Geolocation from '@react-native-community/geolocation';
import MapView, {PROVIDER_GOOGLE, Marker, LatLng} from 'react-native-maps';

import Icon from 'react-native-vector-icons/Ionicons';

const myIcon = <Icon name="car" size={30} color="#900" />;

function distance_(lat1, lat2, lon1, lon2) {
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.

  lon1 = Number(lon1);
  lon2 = Number(lon2);
  lat1 = Number(lat1);
  lat2 = Number(lat2);

  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  return c * r;
}

const Homepage = props => {
  const [enabled, setEnabled] = React.useState(false);
  const [location, setLocation] = React.useState('');
  const [coord, setCoord] = React.useState(LatLng);
  const [text, onChangeText] = React.useState('Useless Text');
  const [distance, setDistance] = React.useState(0);
  const [history, setHistory] = React.useState([]);
  const [trips, setTrips] = React.useState([]);
  const [region, setRegion] = React.useState({
    latitude: 38,
    longitude: 39,
    latitudeDelta: 0.0421,
    longitudeDelta: 0.0421,
  });

  const [tripsOnProgress, setTripsOnProgress] = React.useState([]);

  function gotoTripPage() {
    if (enabled) {
      Geolocation.getCurrentPosition(pos => {
        const crd = pos.coords;
        console.log(crd);
        setRegion({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        });
        props.navigation.navigate('Trippage', {
          onProgressed: [
            {
              coords: {latitude: crd.latitude, longitude: crd.longitude},
              distance: distance,
            },
          ],
          trips: trips,
        });
      }).catch(err => {
        console.log(err);
      });
    } else {
      props.navigation.navigate('Trippage', {
        onProgressed: [],
        trips: trips,
      });
    }
  }
  function openFreeDrive() {
    if (enabled) {
      setTrips(prev => {
        if (prev.length === 0) {
          return [{coords: history, distance: distance, progress: false}];
        }
        return prev.concat({
          coords: history,
          distance: distance,
          progress: false,
        });
      });
      setRegion({
        latitude: history[history.length - 1].latitude,
        longitude: history[history.length - 1].longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
      setHistory([]);
      setDistance(0);
      setLocation('');
      setTripsOnProgress([]);
    }
    setEnabled(!enabled);
    //console.log('Trips : ', trips);
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
      setLocation(JSON.stringify(location, null, 2));
      setHistory(prev => {
        setDistance(prevDistance => {
          if (prev.length === 0) {
            return 0;
          }
          const lastItem = prev[prev.length - 1];
          let add = distance_(
            lastItem.latitude,
            location.coords.latitude,
            lastItem.longitude,
            location.coords.longitude,
          );
          return prevDistance + add;
        });
        return prev.concat({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      });
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      setTripsOnProgress(prev => {
        return [{coords: history, distance: distance}];
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
      distanceFilter: 50,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true, // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
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
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation('');
    }
  }, [enabled]);

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        initialRegion={region}
        region={region}
        customMapStyle={mapStyle}>
        {region !== undefined && <Marker coordinate={region} />}
        <SafeAreaView style={styles.safeAreaKM}>
          <View style={styles.kmView}>
            <Icon
              name="speedometer"
              size={24}
              color="black"
              style={{alignSelf: 'center', marginLeft: 8}}
            />
            {distance < 1 ? (
              <Text style={styles.textKM}>{distance.toFixed(2) * 1000} M</Text>
            ) : (
              <Text style={styles.textKM}>{distance.toFixed(2)} KM</Text>
            )}
          </View>
        </SafeAreaView>
      </MapView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            borderRadius: 25,
            width: 50,
            height: 50,
            backgroundColor: '#F4F4F4',
          }}
          onPress={openFreeDrive}>
          {enabled ? (
            <Icon
              name="pause"
              size={48}
              color="green"
              style={{alignSelf: 'center'}}
            />
          ) : (
            <Icon
              name="play-circle"
              size={48}
              color="black"
              style={{alignSelf: 'center'}}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            borderRadius: 25,
            width: 50,
            height: 50,
            backgroundColor: '#F4F4F4',
          }}
          onPress={goToCurrentLocation}>
          <Icon
            name="compass"
            size={48}
            color="black"
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            borderRadius: 25,
            width: 50,
            height: 50,
            backgroundColor: '#F4F4F4',
          }}
          onPress={gotoTripPage}>
          <Icon
            name="car"
            size={48}
            color="black"
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaKM: {justifyContent: 'center', alignContent: 'center'},
  textKM: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 4,
  },
  kmView: {
    alignSelf: 'center',
    borderRadius: 18,
    width: 120,
    height: 50,
    marginTop: 32,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
  },
  kmText: {
    marginTop: 15,
    fontSize: 24,
    marginLeft: 30,
    alignSelf: 'center',
  },
  footer: {
    height: 80,
    backgroundColor: '#f4f4f4',
    flexDirection: 'row',
    justifyContent: 'space-around',
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

*/
