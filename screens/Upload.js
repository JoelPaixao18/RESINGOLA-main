import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Switch, ActivityIndicator, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/Upload';

export default function Upload() {
  const [images, setImages] = useState([]);
  const [houseSize, setHouseSize] = useState('');
  const [compartments, setCompartments] = useState('');
  const [typology, setTypology] = useState('Apartamento');
  const [hasWater, setHasWater] = useState(false);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [location, setLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [price, setPrice] = useState('');
  const navigation = useNavigation();

  // Verifica se todos os campos obrigatórios estão preenchidos
  const isFormValid = images.length > 0 && houseSize && !isNaN(houseSize) && compartments && location && price && !isNaN(price);

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
      allowsMultipleSelection: true, // Permite seleção múltipla
    });

    if (!result.cancelled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
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

    if (!result.cancelled && result.assets) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const getLocation = async () => {
    setIsLoadingLocation(true);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos da permissão para acessar a localização!');
      setIsLoadingLocation(false);
      return;
    }

    try {
      let { coords } = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync(coords);

      if (address.length > 0) {
        const { city, district } = address[0];
        setLocation(`${city}, ${district}`);
      } else {
        alert('Não foi possível obter o endereço.');
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      alert('Erro ao obter localização');
    }

    setIsLoadingLocation(false);
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      alert('Por favor, preencha todos os campos corretamente antes de cadastrar.');
      return;
    }

    const residenceData = {
      id: Math.random().toString(36).substr(2, 9),
      images, // Agora é um array de imagens
      houseSize: parseFloat(houseSize),
      compartments,
      typology,
      resources: {
        water: hasWater,
        electricity: hasElectricity,
      },
      location,
      price: parseFloat(price),
      createdAt: new Date().toISOString()
    };

    try {
      const savedResidencesData = await AsyncStorage.getItem('savedResidences');
      const savedResidences = savedResidencesData ? JSON.parse(savedResidencesData) : [];

      savedResidences.push(residenceData);
      await AsyncStorage.setItem('savedResidences', JSON.stringify(savedResidences));

      alert('Residência cadastrada com sucesso!');
      
      // Limpar o formulário após o cadastro
      setImages([]);
      setHouseSize('');
      setCompartments('');
      setTypology('Apartamento');
      setHasWater(false);
      setHasElectricity(false);
      setLocation(null);
      setPrice('');

      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao salvar residência', error);
      alert('Erro ao cadastrar residência');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Área para adicionar imagens */}
        
        {images.length > 0 ? (
          <FlatList
            horizontal
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.removeImageButton} 
                  onPress={() => removeImage(index)}
                >
                  <MaterialIcons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.imagesList}
          />
        ) : (
          <TouchableOpacity style={styles.cover} onPress={pickImage}>
            <View style={styles.coverContent}>
              <MaterialIcons name="add-a-photo" size={40} color="#666" />
              <Text style={styles.coverText}>Adicione imagens</Text>
            </View>
          </TouchableOpacity>
        )}

        <Text style={styles.photoOptionText} onPress={takePhoto}>
          Ou tire uma foto
        </Text>

        {/* Restante do formulário */}
        <View style={styles.form}>
          <Text style={styles.label}>Tamanho da casa (m²)*</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 120"
            keyboardType="numeric"
            value={houseSize}
            onChangeText={setHouseSize}
          />

          <Text style={styles.label}>Número de compartimentos*</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 4 (2 quartos, 1 sala, 1 cozinha)"
            value={compartments}
            onChangeText={setCompartments}
          />

          <Text style={styles.label}>Tipologia da casa*</Text>
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

          <Text style={styles.label}>Localização*</Text>
          <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
            {isLoadingLocation ? (
              <ActivityIndicator color="#6200ee" />
            ) : (
              <Text style={styles.locationButtonText}>
                {location || 'Obter Localização'}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Preço (kz)*</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 150000"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <Text style={styles.requiredFieldsText}>* Campos obrigatórios</Text>

          {/* Botão de envio */}
          <TouchableOpacity 
            style={[styles.submitButton, !isFormValid && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <Text style={styles.submitButtonText}>Cadastrar Residência</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}