import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TextInput, Text, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from '../styles/Map';
import { MagnifyingGlass } from 'phosphor-react-native';

function Map() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada!');
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        const geocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (geocode.length > 0) {
          const locationAddress = geocode[0];
          setAddress(`${locationAddress.name}, ${locationAddress.city}, ${locationAddress.region}`);
        } else {
          setAddress('Endereço não encontrado');
        }
      } catch (error) {
        setErrorMsg('Erro ao obter a localização');
        console.error(error);
      }
    };

    getLocation();
  }, []);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location) {
    return <Text style={styles.waitMapText}>Carregando localização...</Text>;
  }

  const locations = [
    { id: 1, latitude: 51.505, longitude: -0.09, title: 'Local 1', description: 'Descrição do Local 1' },
    { id: 2, latitude: 51.515, longitude: -0.1, title: 'Local 2', description: 'Descrição do Local 2' },
    { id: 3, latitude: 51.525, longitude: -0.11, title: 'Local 3', description: 'Descrição do Local 3' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        tileUrlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Minha Localização"
        />

        {locations.map((locationItem) => (
          <Marker
            key={locationItem.id}
            coordinate={{
              latitude: locationItem.latitude,
              longitude: locationItem.longitude,
            }}
            title={locationItem.title}
            description={locationItem.description}
          />
        ))}
      </MapView>

      <View style={styles.inputContainer}>
        <MagnifyingGlass size={30} weight="thin" />
        <TextInput
          style={styles.input}
          placeholder="Pesquise sua casa"
          placeholderTextColor="#606060"
        />
      </View>

      {address ? (
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>Localização: {address}</Text>
        </View>
      ) : (
        <Text>Obtendo endereço...</Text>
      )}
    </SafeAreaView>
  );
}

export default Map;