import React from 'react';
import {
  Switch,
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import mapStyle from '../mapStyle.json';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  LatLng,
  Polyline,
} from 'react-native-maps';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Trippage = props => {
  const {onProgressed, trips} = props.route.params;
  function Progressview() {
    if (onProgressed.length == 1) {
      return (
        <View style={styles.eachItem}>
          <View style={styles.progressView}>
            <Text style={styles.progressText}>Trip in Progress</Text>
          </View>
          <View style={styles.eachItemHeader}>
            <Text style={{fontSize: 18, fontWeight: '600', marginLeft: 6}}>
              {onProgressed[0].distance.toFixed(2)} KM
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: 'green',
                marginRight: 6,
              }}>
              ${(onProgressed[0].distance.toFixed(2) * 0.56).toFixed(2)}
            </Text>
          </View>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{flex: 1, borderRadius: 12}}
            customMapStyle={mapStyle}
            initialRegion={{
              latitude: onProgressed[0].coords.latitude,
              longitude: onProgressed[0].coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker coordinate={onProgressed[0].coords} />
          </MapView>
        </View>
      );
    }
    return null;
  }

  const renderItem = ({item}) => (
    <View style={styles.eachItem}>
      <View style={styles.eachItemHeader}>
        <Text style={{fontSize: 18, fontWeight: '600', marginLeft: 6}}>
          {item.distance.toFixed(2)} KM
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: 'green',
            marginRight: 6,
          }}>
          ${(item.distance.toFixed(2) * 0.56).toFixed(2)}
        </Text>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        style={{flex: 1, borderRadius: 12}}
        initialRegion={{
          latitude: item.coords[0].latitude,
          longitude: item.coords[0].longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        }}>
        <Marker coordinate={item.coords[0]} />
        <Marker coordinate={item.coords[item.coords.length - 1]} />
        <Polyline
          coordinates={item.coords}
          strokeColor="#000"
          strokeColors={['#7F0000']}
          strokeWidth={5}
        />
      </MapView>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Trips</Text>
      </View>
      <FlatList
        ListHeaderComponent={<Progressview />}
        showsVerticalScrollIndicator={false}
        data={trips.reverse()}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  progressView: {height: 30, alignContent: 'center', justifyContent: 'center'},
  progressText: {
    alignSelf: 'center',
    color: 'gray',
    fontSize: 20,
    fontWeight: '500',
  },
  eachItemHeader: {
    height: 30,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eachItem: {
    marginTop: 32,
    marginHorizontal: 32,
    height: windowHeight * 0.3,
    borderRadius: 12,
    //backgroundColor: '#f4f4f4',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignContent: 'center',
  },
  header: {
    height: 50,
    //backgroundColor: '#f4f4f4',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  headerText: {
    fontSize: 24,
    color: 'black',
    alignSelf: 'center',
  },
});

export {Trippage};
