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

import Geolocation from '@react-native-community/geolocation';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  LatLng,
  Polyline,
} from 'react-native-maps';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const Trippage = () => {
  const coordinates = [
    {
      latitude: 22.306885,
      longitude: 70.780538,
    },
    {
      latitude: 22.310696,
      longitude: 70.803152,
    },
    {
      latitude: 22.293067,
      longitude: 70.791559,
    },
    {
      latitude: 22.306885,
      longitude: 70.780538,
    },
  ];

  const renderItem = ({item}) => (
    <View style={styles.eachItem}>
      <View style={styles.eachItemHeader}>
        <Text>115 KM</Text>
        <Text>65 Dolar</Text>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        initialRegion={{
          latitude: 22.30688,
          longitude: 70.780538,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker coordinate={coordinates[0]} />
        <Marker coordinate={coordinates[1]} />
        <Marker coordinate={coordinates[2]} />
        <Polyline
          coordinates={coordinates}
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
        showsVerticalScrollIndicator={false}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={{}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  eachItemHeader: {
    height: 30,
    //backgroundColor: '#f4f4f4',
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
