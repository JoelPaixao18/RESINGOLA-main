import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
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
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://192.168.213.25/RESINGOLA-main/Backend/listar_residences.php');
      const result = await response.json();
      
      if (result.status === 'success') {
        const processedProperties = result.data.map(property => {
          let address = '';
          try {
            const location = typeof property.location === 'string' ? 
                           JSON.parse(property.location) : 
                           property.location;
            address = location?.address || property.location || 'Endereço não disponível';
          } catch {
            address = property.location || 'Endereço não disponível';
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
        setFilteredProperties(processedProperties);
      }
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(property => 
        property.location.toLowerCase().includes(query.toLowerCase()) ||
        (property.typeResi && property.typeResi.toLowerCase().includes(query.toLowerCase())) ||
        (property.city && property.city.toLowerCase().includes(query.toLowerCase())) ||
        (property.neighborhood && property.neighborhood.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredProperties(filtered);
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
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.waitMapText}>Carregando localização...</Text>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity onPress={getLocation} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const htmlMap = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
    .balloon-container {
      max-width: 250px;
      font-family: Arial, sans-serif;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      overflow: hidden;
    }
    .balloon-image {
      width: 100%;
      height: 120px;
      object-fit: cover;
      display: block;
    }
    .balloon-content {
      padding: 10px;
    }
    .balloon-title {
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 5px;
      color: #333;
    }
    .balloon-info {
      font-size: 12px;
      color: #666;
      margin: 2px 0;
      line-height: 1.4;
    }
    .balloon-button {
      display: block;
      width: 100%;
      padding: 8px;
      margin-top: 10px;
      background: #1A7526;
      color: #fff;
      text-align: center;
      border-radius: 5px;
      text-decoration: none;
      font-size: 12px;
      cursor: pointer;
    }
    .balloon-button:hover {
      background: #145d1c;
    }
  </style>
  <script src="https://api-maps.yandex.ru/2.1/?apikey=45f8077e-cd8f-4919-be26-31ce1a691183&lang=pt_BR" type="text/javascript"></script>
  <script>
    ymaps.ready(init);
    function init() {
      var map = new ymaps.Map("map", {
        center: [${location?.latitude || 0}, ${location?.longitude || 0}],
        zoom: 14
      });

      var myPlacemark = new ymaps.Placemark([${location?.latitude || 0}, ${location?.longitude || 0}], {
        hintContent: 'Minha Localização',
        balloonContent: 'Você está aqui'
      }, {
        preset: 'islands#blueCircleDotIcon'
      });
      map.geoObjects.add(myPlacemark);

      ${filteredProperties.map(property => `
        var propertyPlacemark = new ymaps.Placemark(
          [${property.coordinates?.[0] || 0}, ${property.coordinates?.[1] || 0}],
          {
            hintContent: '${property.typeResi || 'Imóvel'}',
            balloonContent: [
              '<div class="balloon-container">',
              '${property.image ? `<img src="${property.image}" class="balloon-image" alt="Imóvel" />` : ''}',
              '<div class="balloon-content">',
              '<div class="balloon-title">${property.typeResi || 'Imóvel'}</div>',
              '<div class="balloon-info">${property.location || 'Sem endereço'}</div>',
              '${property.houseSize ? `<div class="balloon-info">Tamanho: ${property.houseSize} m²</div>` : ''}',
              '${property.price ? `<div class="balloon-info">Preço: ${property.price} Kz</div>` : ''}',
              '${property.bedrooms ? `<div class="balloon-info">Quartos: ${property.bedrooms}</div>` : ''}',
              '<a class="balloon-button" onclick="window.ReactNativeWebView.postMessage(\\'${property.id}\\')">Ver Detalhes</a>',
              '</div>',
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
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar imóveis por localização..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View> 
      
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
        <View style={styles.addressContainer}>
          <Text style={{ textAlign: 'center' }}>Obtendo endereço...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Map;