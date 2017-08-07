import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  Alert,
  Platform,
} from 'react-native';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import NFC, {NfcDataType, NdefRecordType} from "react-native-nfc";

const accessToken = 'pk.eyJ1IjoiaGVucmlrcmEiLCJhIjoiY2o1a3czMjA1MDlzejJwbXhpam1oMTJpMSJ9.TANJvIveftY7gEV8Um3Aew';
Mapbox.setAccessToken(accessToken);

if (Platform.Os === 'android') {
  NFC.addListener(payload => {
    console.log('payload', payload);
    Alert.alert('Found card', `${payload.data.description}\nWith id: ${payload.data.id}`);
  });
}

export default class simpleDirections extends Component {
  state = {
    center: {
      latitude: 60.162059,
      longitude: 24.94
    },
    zoom: 12,
    annotations: []
  };

  getDirections = () => {
    const from = {latitude: 60.162059, longitude: 24.94};
    this._map.getCenterCoordinateZoomLevel(coordinates => {
      fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${from.longitude}%2C${from.latitude}%3B${coordinates.longitude}%2C${coordinates.latitude}.json?access_token=pk.eyJ1IjoiaGVucmlrcmEiLCJhIjoiY2o1a3czMjA1MDlzejJwbXhpam1oMTJpMSJ9.TANJvIveftY7gEV8Um3Aew&geometries=geojson`)
        .then((response) => response.json())
        .then(res => {
          this.setState({
            annotations: [ 
              ...this.state.annotations,
              {
                coordinates: res.routes[0].geometry.coordinates.map(coordinates => coordinates.reverse()),
                type: 'polyline',
                id: 'new-black-polygon',
                strokeWidth: 3,
                strokeColor: '#FF0000',
              },
              {
                coordinates: [60.162059, 24.94],
                type: 'point',
                title: 'This is a the lol marker',
                id: 'foo'
              }, 
            ],
          });
        })
        .catch(err => console.log('err', err))
    });
  }

  componentDidMount() {
    this.getDirections();
  }

  updateMarker2 = () => {
    this.setState({
      annotations: this.state.annotations.map(annotation => {
        if (annotation.id !== 'marker2') { return annotation; }
        return {
          coordinates: [40.714541341726175,-74.00579452514648],
          'type': 'point',
          title: 'New Title!',
          subtitle: 'New Subtitle',
          annotationImage: {
            source: { uri: 'https://cldup.com/7NLZklp8zS.png' },
            height: 25,
            width: 25
          },
          id: 'marker2'
        };
      })
    });
  };

  render() {
    StatusBar.setHidden(true);
    return (
      <View style={styles.container}>
        <MapView
          ref={map => { this._map = map; }}
          style={styles.map}
          initialCenterCoordinate={this.state.center}
          initialZoomLevel={this.state.zoom}
          initialDirection={0}
          rotateEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
          showsUserLocation={false}
          styleURL={Mapbox.mapStyles.dark}
          userTrackingMode={Mapbox.userTrackingMode.none}
          annotations={this.state.annotations}
          annotationsAreImmutable
        />
        <Button title="Get directions" onPress={this.getDirections} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  map: {
    flex: 1
  },
  scrollView: {
    flex: 1
  }
});

AppRegistry.registerComponent('simpleDirections', () => simpleDirections);
