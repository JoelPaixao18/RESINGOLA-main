import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Switch, ActivityIndicator, FlatList, Alert, ActionSheetIOS } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/Upload';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom Radio Button Component
const RadioButton = ({ selected, onPress, label }) => (
  <TouchableOpacity 
    style={[
      styles.radioOption,
      selected && styles.radioOptionSelected  // Aplica estilo quando selecionado
    ]} 
    onPress={onPress}
  >
    <View style={styles.radioCircle}>
      {selected && <View style={styles.radioCheckedCircle} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function Upload() {
  const [images, setImages] = useState([]);
  const [houseSize, setHouseSize] = useState('');
  const [status, setStatus] = useState('');
  const [typeResi, setTypeResi] = useState('Apartamento');
  const [typology, setTypology] = useState('');
  const [livingRoomCount, setLivingRoomCount] = useState('');
  const [kitchenCount, setKitchenCount] = useState('');
  const [hasWater, setHasWater] = useState(false);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [bathroomCount, setBathroomCount] = useState('');
  const [quintal, setQuintal] = useState(false);
  const [andares, setAndares] = useState('1'); // Valor padrão como string '1'
  const [garagem, setGaragem] = useState(false);
  const [varanda, setVaranda] = useState(false);
  const [location, setLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [price, setPrice] = useState('');
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});

  const isFormValid = () => {
    const newErrors = {};
  
    if (images.length === 0) newErrors.images = true;
    if (!houseSize || isNaN(houseSize) || parseFloat(houseSize) <= 0) newErrors.houseSize = true;
    if (!status) newErrors.status = true;
    if (!typeResi) newErrors.typeResi = true;
    
    // Validações condicionais
    if (typeResi === 'Apartamento') {
      if (!typology) newErrors.typology = true;
      if (!livingRoomCount) newErrors.livingRoomCount = true;
      if (!bathroomCount) newErrors.bathroomCount = true;
      if (!kitchenCount) newErrors.kitchenCount = true;
    }
    

    // Validações básicas que aplicam a todos os tipos
    if (images.length === 0) {
      Alert.alert("Erro", "Adicione pelo menos uma imagem");
      return false;
    }
  
    if (!houseSize || isNaN(houseSize) || parseFloat(houseSize) <= 0) {
      Alert.alert("Erro", "Informe um tamanho válido para a casa (em m²)");
      return false;
    }
  
    if (!status) {
      Alert.alert("Erro", "Selecione se o imóvel é para Venda ou Arrendamento");
      return false;
    }
  
    if (!typeResi) {
      Alert.alert("Erro", "Selecione o tipo de imóvel");
      return false;
    }
  
    // Validações específicas para cada tipo de imóvel
    if (typeResi === 'Apartamento') {
      if (!typology) {
        Alert.alert("Erro", "Selecione a tipologia do apartamento (T2, T3, T4)");
        return false;
      }
      if (!livingRoomCount) {
        Alert.alert("Erro", "Selecione o número de salas");
        return false;
      }
      if (!bathroomCount) {
        Alert.alert("Erro", "Selecione o número de banheiros");
        return false;
      }
      if (!kitchenCount) {
        Alert.alert("Erro", "Selecione o número de cozinhas");
        return false;
      }
    } 
    else if (typeResi === 'Vivenda') {
      if (!typology) {
        Alert.alert("Erro", "Selecione a tipologia da vivenda (T2, T3, T4)");
        return false;
      }
      if (!livingRoomCount) {
        Alert.alert("Erro", "Selecione o número de salas");
        return false;
      }
      if (!bathroomCount) {
        Alert.alert("Erro", "Selecione o número de banheiros");
        return false;
      }
      if (!kitchenCount) {
        Alert.alert("Erro", "Selecione o número de cozinhas");
        return false;
      }
      if (!andares) {
        Alert.alert("Erro", "Selecione o número de andares");
        return false;
      }
    } 
    else if (typeResi === 'Moradia') {
      if (!typology) {
        Alert.alert("Erro", "Selecione a tipologia da moradia (T2, T3, T4)");
        return false;
      }
      if (!livingRoomCount) {
        Alert.alert("Erro", "Selecione o número de salas");
        return false;
      }
      if (!bathroomCount) {
        Alert.alert("Erro", "Selecione o número de banheiros");
        return false;
      }
      if (!kitchenCount) {
        Alert.alert("Erro", "Selecione o número de cozinhas");
        return false;
      }
      if (!andares) {
        Alert.alert("Erro", "Selecione o número de andares");
        return false;
      }
    }

    if (typeResi === 'Vivenda' && !andares) {
      newErrors.andares = 'Selecione o número de andares';
    }
  
    // Validações comuns a todos os tipos
    if (!location || location.trim() === "") {
      Alert.alert("Erro", "Localização é obrigatória");
      return false;
    }
  
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert("Erro", "Informe um preço válido");
      return false;
    }
  
      if (!location || location.trim() === "") newErrors.location = true;
      if (!price || isNaN(price) || parseFloat(price) <= 0) newErrors.price = true;

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão para acessar a galeria foi negada!');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });
  
    if (!result.canceled && result.assets) {
      const validImages = [];
    
      for (let asset of result.assets) {
        try {
          // 1. Copia a imagem para um local permanente
          const newPath = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
          await FileSystem.copyAsync({
            from: asset.uri,
            to: newPath,
          });
    
          // 2. Verifica o tamanho (se necessário)
          const fileInfo = await FileSystem.getInfoAsync(newPath);
          if (fileInfo.size > 5 * 1024 * 1024) {
            Alert.alert("Erro", "Imagem excede 5MB e foi ignorada.");
            continue;
          }
    
          // 3. Armazena o NOVO caminho (persistente)
          validImages.push(newPath);
        } catch (error) {
          console.error("Erro ao salvar imagem:", error);
          continue;
        }
      }
    
      if (validImages.length > 0) {
        setImages(prev => [...prev, ...validImages]);
      }
    }
  };
  // Função para tirar foto  

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão para acessar a câmera foi negada!');
      return;
    }
  
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets) {
      const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
  
      if (fileInfo.size > 5 * 1024 * 1024) {
        Alert.alert("Erro", "A imagem excede 5MB e foi ignorada.");
        return;
      }
  
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  };
  

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const uploadImage = async (uri) => {
    try {
      // Verificar conexão antes de tentar o upload
      const isConnected = await checkNetworkConnection();
      if (!isConnected) {
        throw new Error('Sem conexão com a internet');
      }
  
      const formData = new FormData();
      formData.append('image', {
        uri: uri,
        type: 'image/jpeg',
        name: `imovel_${Date.now()}.jpg`
      });
  
      const response = await fetch('http://172.16.40.20/RESINGOLA-main/Backend/uploads/upload_image.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 segundos de timeout
      });
  
      // Verificar se a resposta está OK
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
  
      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error('Resposta do servidor vazia');
      }
  
      const result = JSON.parse(responseText);
      
      if (!result.status || result.status !== 'success') {
        throw new Error(result.message || 'Upload falhou');
      }
  
      return result.imageUrl;
  
    } catch (error) {
      console.error('Erro no upload:', error);
      throw new Error(`Falha ao enviar imagem: ${error.message}`);
    }
  };
  
  // Função para verificar conexão
  const checkNetworkConnection = async () => {
    try {
      const response = await fetch('http://172.16.40.20', {
        method: 'HEAD',
        timeout: 5000,
      });
      return true;
    } catch {
      return false;
    }
  };
  
  const getLocation = async () => {
    setIsLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Permissão para acessar localização foi negada!');
      setIsLoadingLocation(false);
      return;
    }

    try {
      let { coords } = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync(coords);

      if (address.length > 0) {
        const { city, district } = address[0];
        setLocation(`${city || 'Cidade desconhecida'}, ${district || 'Bairro desconhecido'}`);
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
    if (!isFormValid()) return;
  
    try {
      // 1. Upload de imagens
      const uploadedImages = await Promise.all(
        images.map(async (uri) => {
          try {
            const imageUrl = await uploadImage(uri);
            // Garante que é uma URL completa
            if (!imageUrl.startsWith('http')) {
              return `http://172.16.40.20/RESINGOLA-main/Backend/uploads/${imageUrl}`;
            }
            return imageUrl;
          } catch (error) {
            console.error('Erro no upload:', error);
            throw new Error('Falha ao enviar imagens');
          }
        })
      );
  
      // 2. Preparar dados
      const residenceData = {
        imagem: uploadedImages[0],
        images: JSON.stringify(uploadedImages),
        houseSize: parseFloat(houseSize),
        status: status,
        typeResi: typeResi,
        typology: typology,
        livingRoomCount: parseInt(livingRoomCount) || 0,
        kitchenCount: parseInt(kitchenCount) || 1,
        hasWater: hasWater,
        hasElectricity: hasElectricity,
        bathroomCount: parseInt(bathroomCount) || 1,
        quintal: quintal,
        andares: parseInt(andares) || 1,
        garagem: garagem,
        varanda: varanda,
        location: location,
        price: parseFloat(price),
        createdAt: new Date().toISOString()
      };
  
      // 3. Enviar para o servidor
      const response = await fetch('http://172.16.40.20/RESINGOLA-main/Backend/conect.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(residenceData)
      });
  
      // Verifique primeiro o status da resposta
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta do servidor:', errorText);
      throw new Error(`Erro HTTP ${response.status}`);
    }

    // Tente parsear como JSON
    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      const responseText = await response.text();
      console.error('Falha ao parsear JSON:', responseText);
      throw new Error('Resposta do servidor não é JSON válido');
    }

    if (!result.status || result.status !== 'success') {
      throw new Error(result.message || 'Erro no servidor');
    }
  
      // Sucesso
      Alert.alert('Sucesso', 'Imóvel cadastrado com sucesso!');
      resetForm();
      navigation.navigate('Home');
  
    } catch (error) {
      console.error('Erro completo:', error);
      Alert.alert('Erro', error.message || 'Erro ao cadastrar imóvel');
    }
  };

  const resetForm = () => {
    setImages([]);
    setHouseSize('');
    setStatus('');
    setTypeResi('Apartamento');
    setTypology('');
    setLivingRoomCount('');
    setKitchenCount('');
    setHasWater(false);
    setHasElectricity(false);
    setBathroomCount('');
    setQuintal(false);
    setAndares('');
    setGaragem(false);
    setVaranda(false);
    setLocation(null);
    setPrice('');
  };

  return (
    
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {images.length > 0 ? (
          <FlatList
            horizontal
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: item }} 
                  style={styles.image}
                  onError={(e) => {
                    console.log('Erro ao carregar imagem:', e.nativeEvent.error);
                    removeImage(index);
                  }}
                />
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

        <View style={styles.form}>
          {/* Campos básicos que sempre aparecem */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tamanho da casa (m²)*</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 120"
              keyboardType="numeric"
              value={houseSize}
              onChangeText={setHouseSize}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Imóvel Para*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status}
                onValueChange={setStatus}
                style={styles.picker}
              >
                <Picker.Item label="Este Imóvel é para" value="" />
                <Picker.Item label="Venda" value="Venda" />
                <Picker.Item label="Arrendamento" value="Arrendamento" />
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Imóvel*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={typeResi}
                onValueChange={(itemValue) => {
                  setTypeResi(itemValue);
                  // Resetar campos específicos quando mudar o tipo
                  setTypology('');
                  setLivingRoomCount('');
                  setKitchenCount('');
                  setBathroomCount('');
                  setVaranda(false);
                }}
                style={styles.picker}
              >
                <Picker.Item label="Selecione o Tipo de Imóvel" value="Selecione a Tipo de Imóvel" />
                <Picker.Item label="Apartamento" value="Apartamento" />
                <Picker.Item label="Vivenda" value="Vivenda" />
                <Picker.Item label="Moradia" value="Moradia" />
              </Picker>
            </View>
          </View>
          {typeResi !== "" && (
          <>
            {/* Campos específicos para Apartamento */}
            {typeResi === 'Apartamento' && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Tipologia*</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={typology === 'T2'}
                      onPress={() => setTypology('T2')}
                      label="T2"
                    />
                    <RadioButton
                      selected={typology === 'T3'}
                      onPress={() => setTypology('T3')}
                      label="T3"
                    />
                    <RadioButton
                      selected={typology === 'T4'}
                      onPress={() => setTypology('T4')}
                      label="T4"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Salas*</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={livingRoomCount === '1'}
                      onPress={() => setLivingRoomCount('1')}
                      label="1"
                    />
                    <RadioButton
                      selected={livingRoomCount === '2'}
                      onPress={() => setLivingRoomCount('2')}
                      label="2"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Banheiros*</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={bathroomCount === '1'}
                      onPress={() => setBathroomCount('1')}
                      label="1"
                    />
                    <RadioButton
                      selected={bathroomCount === '2'}
                      onPress={() => setBathroomCount('2')}
                      label="2"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Cozinhas*</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={kitchenCount === '1'}
                      onPress={() => setKitchenCount('1')}
                      label="1"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Varanda</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={varanda}
                      onPress={() => setVaranda(true)}
                      label="Sim"
                    />
                    <RadioButton
                      selected={!varanda}
                      onPress={() => setVaranda(false)}
                      label="Não"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Recursos</Text>
                  <View style={styles.switchContainer}>
                    <Text>Água</Text>
                    <Switch
                      value={hasWater}
                      onValueChange={setHasWater}
                      trackColor={{ false: '#767577', true: '#1A7526' }}
                      thumbColor={hasWater ? '#f4f3f4' : '#f4f3f4'}
                    />
                  </View>
                  <View style={styles.switchContainer}>
                    <Text>Energia Elétrica</Text>
                    <Switch
                      value={hasElectricity}
                      onValueChange={setHasElectricity}
                      trackColor={{ false: '#767577', true: '#1A7526' }}
                      thumbColor={hasElectricity ? '#f4f3f4' : '#f4f3f4'}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Localização*</Text>
                    <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
                      {isLoadingLocation ? (
                        <ActivityIndicator color="#1A7526" />
                      ) : (
                        <Text style={styles.locationButtonText}>
                          {location || 'Obter Localização'}
                        </Text>
                      )}
                    </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Preço (kz)*</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: 150000"
                      keyboardType="numeric"
                      value={price}
                      onChangeText={setPrice}
                    />
                </View>
              </>
            )}

            {/* Campos específicos para Vivenda */}
            {typeResi === 'Vivenda' && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Tipologia*</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={typology === 'T2'}
                      onPress={() => setTypology('T2')}
                      label="T2"
                    />
                    <RadioButton
                      selected={typology === 'T3'}
                      onPress={() => setTypology('T3')}
                      label="T3"
                    />
                    <RadioButton
                      selected={typology === 'T4'}
                      onPress={() => setTypology('T4')}
                      label="T4"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Salas*</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={livingRoomCount === '1'}
                      onPress={() => setLivingRoomCount('1')}
                      label="1"
                    />
                    <RadioButton
                      selected={livingRoomCount === '2'}
                      onPress={() => setLivingRoomCount('2')}
                      label="2"
                    />
                    <RadioButton
                      selected={livingRoomCount === '3'}
                      onPress={() => setLivingRoomCount('3')}
                      label="3+"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Banheiros*</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={bathroomCount === '1'}
                      onPress={() => setBathroomCount('1')}
                      label="1"
                    />
                    <RadioButton
                      selected={bathroomCount === '2'}
                      onPress={() => setBathroomCount('2')}
                      label="2"
                    />
                    <RadioButton
                      selected={bathroomCount === '3'}
                      onPress={() => setBathroomCount('3')}
                      label="3+"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Cozinhas*</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={kitchenCount === '1'}
                      onPress={() => setKitchenCount('1')}
                      label="1"
                    />
                    <RadioButton
                      selected={kitchenCount === '2'}
                      onPress={() => setKitchenCount('2')}
                      label="2"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Jardim</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={quintal}
                      onPress={() => setQuintal(true)}
                      label="Sim"
                    />
                    <RadioButton
                      selected={!quintal}
                      onPress={() => setQuintal(false)}
                      label="Não"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Garagem</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={garagem}
                      onPress={() => setGaragem(true)}
                      label="Sim"
                    />
                    <RadioButton
                      selected={!garagem}
                      onPress={() => setGaragem(false)}
                      label="Não"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                <Text style={[styles.label, errors.andares && styles.errorLabel]}>
                  Número de Andares*
                </Text>
                <View style={styles.radioContainer}>
                  <RadioButton
                    selected={andares === '1'}
                    onPress={() => setAndares('1')}
                    label="1"
                  />
                  <RadioButton
                    selected={andares === '2'}
                    onPress={() => setAndares('2')}
                    label="2"
                  />
                  <RadioButton
                    selected={andares === '3'}
                    onPress={() => setAndares('3')}
                    label="3+"
                  />
                </View>
                {errors.andares && (
                  <Text style={styles.errorMessage}>{errors.andares}</Text>
                )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Recursos</Text>
                  <View style={styles.switchContainer}>
                    <Text>Água</Text>
                    <Switch
                      value={hasWater}
                      onValueChange={setHasWater}
                      trackColor={{ false: '#767577', true: '#1A7526' }}
                    />
                  </View>
                  <View style={styles.switchContainer}>
                    <Text>Energia Elétrica</Text>
                    <Switch
                      value={hasElectricity}
                      onValueChange={setHasElectricity}
                      trackColor={{ false: '#767577', true: '#1A7526' }}
                    />
                  </View>
                </View>
             

                  {/* Campos comuns a todos os tipos */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Localização*</Text>
                    <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
                      {isLoadingLocation ? (
                        <ActivityIndicator color="#1A7526" />
                      ) : (
                        <Text style={styles.locationButtonText}>
                          {location || 'Obter Localização'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Preço (kz)*</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: 150000"
                      keyboardType="numeric"
                      value={price}
                      onChangeText={setPrice}
                    />
                  </View>
                </>
                )}
             </>
            )}

          {typeResi !== "" && (
            <>
              <Text style={styles.requiredFieldsText}>* Campos obrigatórios</Text>
              
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Cadastrar Residência</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}