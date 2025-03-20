import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // Importando expo-location

function Map() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null); // Estado para armazenar o endereço
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // Função para pegar a localização e o endereço
    const getLocation = async () => {
      // Verifica as permissões de localização
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada!');
        return;
      }

      try {
        // Pega a localização atual
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords); // Atualiza o estado da localização

        // Usando geocodificação reversa para obter o endereço
        const geocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (geocode.length > 0) {
          const locationAddress = geocode[0]; // Obter o primeiro resultado
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

  // Marcadores adicionais no mapa
  const locations = [
    { id: 1, latitude: 51.505, longitude: -0.09, title: 'Local 1', description: 'Descrição do Local 1' },
    { id: 2, latitude: 51.515, longitude: -0.1, title: 'Local 2', description: 'Descrição do Local 2' },
    { id: 3, latitude: 51.525, longitude: -0.11, title: 'Local 3', description: 'Descrição do Local 3' },
  ];

  return (
    <View style={styles.container}>
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
        {/* Marcador para a localização atual */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Minha Localização"
        />

        {/* Marcadores adicionais no mapa */}
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

      {/* Exibindo o endereço na tela */}
      {address ? (
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>Localização: {address}</Text>
        </View>
      ) : (
        <Text>Obtendo endereço...</Text>
      )}
    </View>
  );
}

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  addressContainer: {
    position: 'absolute',  // Certifica que ficará sobre o mapa
    bottom: 10,            // Coloca na parte inferior da tela
    width: '100%',         // Ocupa a largura inteira
    padding: 15,           // Padding para o texto não ficar grudado
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo transparente
    borderRadius: 5,      // Bordas arredondadas
    alignItems: 'center', // Centraliza o texto
  },
  addressText: {
    fontSize: 16,        // Tamanho da fonte
    fontWeight: 'bold',  // Deixa o texto mais visível
  },
  waitMapText:{
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    justifyContent: 'center',
    marginVertical: 50,
    paddingVertical: 50,
  },
});