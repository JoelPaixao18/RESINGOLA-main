import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'; // Importando a API de localização
import { MaterialIcons } from '@expo/vector-icons';

export default function ResidenceForm() {
  const [image, setImage] = useState(null);
  const [houseSize, setHouseSize] = useState('');
  const [compartments, setCompartments] = useState('');
  const [typology, setTypology] = useState('Apartamento');
  const [hasWater, setHasWater] = useState(false);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [location, setLocation] = useState(null); // Estado para armazenar o nome do local
  const [isLoadingLocation, setIsLoadingLocation] = useState(false); // Estado para indicar carregamento
  const [price, setPrice] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos da permissão para acessar a galeria!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos da permissão para acessar a câmera!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const getLocation = async () => {
    setIsLoadingLocation(true); // Inicia o carregamento

    // Solicita permissão para acessar a localização
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos da permissão para acessar a localização!');
      setIsLoadingLocation(false); // Para o carregamento
      return;
    }

    // Obtém as coordenadas atuais
    let { coords } = await Location.getCurrentPositionAsync({});

    // Converte as coordenadas em um endereço legível (geocodificação reversa)
    let address = await Location.reverseGeocodeAsync(coords);

    if (address.length > 0) {
      const { city, district } = address[0]; // Extrai cidade e bairro
      setLocation(`${city}, ${district}`); // Armazena o nome do local
    } else {
      alert('Não foi possível obter o endereço.');
    }

    setIsLoadingLocation(false); // Para o carregamento
  };

  const handleSubmit = () => {
    const residenceData = {
      image,
      houseSize,
      compartments,
      typology,
      resources: {
        water: hasWater,
        electricity: hasElectricity,
      },
      location, // Inclui o nome do local nos dados
      price,
    };
    console.log('Dados da residência:', residenceData);
    alert('Residência cadastrada com sucesso!');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Cover para adicionar imagem */}
        <TouchableOpacity style={styles.cover} onPress={takePhoto}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.coverContent}>
              <MaterialIcons name="add-a-photo" size={40} color="#666" />
              <Text style={styles.coverText}>Adicione uma imagem</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Formulário */}
        <View style={styles.form}>
          <Text style={styles.label}>Tamanho da casa (m²)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 120"
            keyboardType="numeric"
            value={houseSize}
            onChangeText={setHouseSize}
          />

          <Text style={styles.label}>Número de compartimentos</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 4 (2 quartos, 1 sala, 1 cozinha)"
            value={compartments}
            onChangeText={setCompartments}
          />

          <Text style={styles.label}>Tipologia da casa</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={typology}
              onValueChange={(itemValue) => setTypology(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Apartamento" value="Apartamento" />
              <Picker.Item label="Vivenda" value="Vivenda" />
              <Picker.Item label="Moradia" value="Moradia" />
              <Picker.Item label="Outro" value="Outro" />
            </Picker>
          </View>

          <Text style={styles.label}>Recursos</Text>
          <View style={styles.switchContainer}>
            <Text>Água</Text>
            <Switch
              value={hasWater}
              onValueChange={setHasWater}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text>Energia Elétrica</Text>
            <Switch
              value={hasElectricity}
              onValueChange={setHasElectricity}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
          </View>

          <Text style={styles.label}>Localização</Text>
          <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
            {isLoadingLocation ? (
              <ActivityIndicator color="#6200ee" /> // Mostra um spinner durante o carregamento
            ) : (
              <Text style={styles.locationButtonText}>
                {location || 'Obter Localização'}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Preço (€)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 150000"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          {/* Botão de envio */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Cadastrar Residência</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 30,
  },
  container: {
    paddingHorizontal: 20,
  },
  cover: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  coverContent: {
    alignItems: 'center',
  },
  coverText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 70,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationButton: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  locationButtonText: {
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});