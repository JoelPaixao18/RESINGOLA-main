import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import styles from '../styles/Map';
import { useNavigation } from '@react-navigation/native';

function Map() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]); // Novo estado para armazenar os imóveis

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://192.168.20.217/RESINGOLA-main/Backend/listar_residences.php');
      const result = await response.json();
      
      if (result.status === 'success') {
        const processedProperties = result.data.map(property => {
          // Extrai o endereço (suporta JSON string ou objeto)
          let address = '';
          try {
            const location = typeof property.location === 'string' ? 
                           JSON.parse(property.location) : 
                           property.location;
            address = location?.address || property.address || 'Endereço não disponível';
          } catch {
            address = property.address || 'Endereço não disponível';
          }
          
          return {
            ...property,
            address: address.replace('Província ', '').replace('Município ', '').replace('Distrito ', '').replace('Bairro ', ''),
            coordinates: [
              parseFloat(property.latitude) || 0,
              parseFloat(property.longitude) || 0
            ]
          };
        });
        
        setProperties(processedProperties);
      }
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    }
  };

  const getLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const msg = 'Permissão de localização negada!';
        setErrorMsg(msg);
        Alert.alert('Erro de Permissão', msg);
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      const geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocode.length > 0) {
        const loc = geocode[0];
        setAddress(`${loc.name}, ${loc.city}, ${loc.region}`);
      } else {
        setAddress('Endereço não encontrado');
      }
    } catch (error) {
      const msg = 'Erro ao obter a localização. Verifique sua internet ou tente novamente.';
      setErrorMsg(msg);
      Alert.alert('Erro de Localização', msg);
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getLocation();
    fetchProperties(); // Adicione esta linha
    console.log(properties)
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando localização...</Text>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ marginBottom: 10, color: 'red', textAlign: 'center' }}>{errorMsg}</Text>
        <TouchableOpacity onPress={getLocation} style={{ padding: 10, backgroundColor: '#007AFF', borderRadius: 8 }}>
          <Text style={{ color: '#fff' }}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const htmlMap = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>html, body, #map { height: 100%; margin: 0; padding: 0; }</style>
    <script src="https://api-maps.yandex.ru/2.1/?apikey=45f8077e-cd8f-4919-be26-31ce1a691183&lang=pt_BR" type="text/javascript"></script>
    <script>
      ymaps.ready(init);
      function init() {
        var map = new ymaps.Map("map", {
          center: [${location?.latitude || 0}, ${location?.longitude || 0}],
          zoom: 14
        });

        // Marcador da localização atual
        var myPlacemark = new ymaps.Placemark([${location?.latitude || 0}, ${location?.longitude || 0}], {
          hintContent: 'Minha Localização',
          balloonContent: 'Você está aqui'
        }, {
          preset: 'islands#blueCircleDotIcon'
        });
        map.geoObjects.add(myPlacemark);

        // Adiciona marcadores para os imóveis
        ${properties.map(property => `
          var propertyPlacemark = new ymaps.Placemark(
            [${property.coordinates?.[0] || 0}, ${property.coordinates?.[1] || 0}],
            {
              hintContent: '${property.typeResi || 'Imóvel'}',
              balloonContent: [
                '<div style="padding: 5px; cursor: pointer;" onclick="window.ReactNativeWebView.postMessage(\\'${property.id}\\')">',
                '<b>${property.typeResi || 'Imóvel'}</b>',
                '<br>${property.location || 'Sem endereço'}',
                '<br>${property.houseSize ? property.houseSize + ' m²' : ''}',
                '${property.price ? ' - ' + property.price + ' Kz' : ''}',
                '</div>'
              ].join('')
            },
            {
              preset: 'islands#greenDotIcon',
              iconColor: '#1A7526'
            }
          );
          map.geoObjects.add(propertyPlacemark);
        `).join('')}
      }
    </script>
  </head>
  <body>
    <div id="map"></div>
  </body>
  </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
      <WebView
          originWhitelist={['*']}
          source={{ html: htmlMap }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={styles.map}
          onMessage={(event) => {
            const propertyId = event.nativeEvent.data;
            const residence = properties.find(p => p.id.toString() === propertyId.toString());
            if (residence) {
              navigation.navigate('Details', { residence });
            }
          }}
        />
      </View>

      {address ? (
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>Localização: {address}</Text>
        </View>
      ) : (
        <Text style={{ textAlign: 'center' }}>Obtendo endereço...</Text>
      )}
    </SafeAreaView>
  );
}

export default Map;