import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Switch, ActivityIndicator, FlatList, Alert, ActionSheetIOS, Platform } from 'react-native';
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
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({
    address: '',
    coordinates: {
      lat: null,
      lng: null
    }
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [price, setPrice] = useState('');
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Adicione no início do componente Upload, após os outros estados
  const [userId, setUserId] = useState(null);

// Adicione este useEffect para carregar o ID do usuário quando o componente montar
useEffect(() => {
  const loadUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        setUserId(id);
      }
    } catch (error) {
      console.error('Erro ao carregar ID do usuário:', error);
    }
  };

  loadUserId();
}, []);

const isFormValid = () => {
    const newErrors = {};
    
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
    else if (typeResi === 'Vivenda' || typeResi === 'Moradia') {
      if (!typology) {
        Alert.alert("Erro", `Selecione a tipologia da ${typeResi} (T2, T3, T4)`);
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
  
    if (!location.address || !location.coordinates || !location.coordinates.lat || !location.coordinates.lng) {
      Alert.alert("Erro", "Selecione uma localização válida das sugestões");
      return false;
    }
  
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert("Erro", "Informe um preço válido");
      return false;
    }

    if (description.length > 500) {
    Alert.alert("Erro", "A descrição não pode exceder 500 caracteres");
    return false;
  }
  
    return true;
};

const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permissão para acessar a galeria foi negada!');
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false, // Removido ou definido como false quando allowsMultipleSelection=true
    aspect: [4, 3],
    quality: 1,
    allowsMultipleSelection: true, // Mantenha true para seleção múltipla
  });

  if (!result.canceled && result.assets) {
    const validImages = [];
    
    for (let asset of result.assets) {
      try {
        const newPath = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
        await FileSystem.copyAsync({
          from: asset.uri,
          to: newPath,
        });
        
        const fileInfo = await FileSystem.getInfoAsync(newPath);
        if (fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert("Erro", "Imagem excede 5MB e foi ignorada.");
          continue;
        }
        
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

// Substitua a função handleSubmit no Upload.js por esta versão modificada
const handleSubmit = async () => {
  console.log('Iniciando processo de cadastro...');

  if (!userId) {
    Alert.alert('Erro', 'Você precisa estar logado para cadastrar um imóvel');
    navigation.navigate('Login');
    return;
  }

  if (!isFormValid()) {
    console.log('Cadastro bloqueado: formulário inválido');
    return;
  }

  try {
    const formData = new FormData();
    
    images.forEach((uri, index) => {
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      
      formData.append('images[]', {
        uri,
        name: `image_${index}.${match ? match[1] : 'jpg'}`,
        type
      });
    });

    formData.append('houseSize', houseSize);
    formData.append('status', status);
    formData.append('typeResi', typeResi);
    formData.append('typology', typology);
    formData.append('livingRoomCount', livingRoomCount);
    formData.append('kitchenCount', kitchenCount);
    formData.append('hasWater', hasWater);
    formData.append('hasElectricity', hasElectricity);
    formData.append('bathroomCount', bathroomCount);
    formData.append('quintal', quintal);
    formData.append('andares', andares);
    formData.append('garagem', garagem);
    formData.append('varanda', varanda);
    formData.append('location', location.address);
    formData.append('latitude', location.coordinates.lat);
    formData.append('longitude', location.coordinates.lng);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('user_id', userId);

    console.log('Enviando dados...');
    
    const response = await fetch('http://192.168.213.25/RESINGOLA-main/Backend/conect.php', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    const result = await response.json();
    console.log('Resposta:', result);

    if (!response.ok || result.status !== 'success') {
      throw new Error(result.message || 'Erro no servidor');
    }

    Alert.alert(
      'Cadastro Concluído', 
      'Imóvel registrado com sucesso! Ele será exibido após aprovação do administrador.',
      [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
    );
    
    resetForm();

  } catch (error) {
    console.error('Falha no cadastro:', error);
    Alert.alert(
      'Erro no Cadastro',
      `Ocorreu um erro ao cadastrar: ${error.message}`,
      [{ text: 'Entendi' }]
    );
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
    setAndares('1'); // Mantém como string
    setGaragem(false);
    setVaranda(false);
    // Alterado de null para objeto vazio
    setLocation({
      address: '',
      coordinates: {
        lat: null,
        lng: null
      }
    });
    setDescription('');
    setPrice('');
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Tirar Foto', 'Escolher da Galeria', 'Cancelar'],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) takePhoto();
          if (buttonIndex === 1) pickImage();
        }
      );
    } else {
      // Para Android, mostramos um Alert com as opções
      Alert.alert(
        'Selecionar imagem',
        'Escolha uma opção',
        [
          { text: 'Tirar Foto', onPress: () => takePhoto() },
          { text: 'Escolher da Galeria', onPress: () => pickImage() },
          { text: 'Cancelar', style: 'cancel' },
        ],
        { cancelable: true }
      );
    }
  };

  const searchLocations = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
  
    try {
      setIsSearching(true);
      const apiKey = '45f8077e-cd8f-4919-be26-31ce1a691183';
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodeURIComponent(query + ', Angola')}&lang=pt`
      );
      
      const data = await response.json();
      const features = data?.response?.GeoObjectCollection?.featureMember || [];
      
      const results = features.map(feature => {
        const components = feature.GeoObject.metaDataProperty?.GeocoderMetaData?.Address?.Components || [];
        const city = components.find(c => c.kind === 'locality')?.name || '';
        const district = components.find(c => c.kind === 'district')?.name || '';
        const province = components.find(c => c.kind === 'province')?.name || '';
        
        let displayName = '';
        
        if (city && district) {
          displayName = `${city}, ${district}`;
        } else if (district && province) {
          displayName = `${province}, ${district}`;
        } else {
          displayName = feature.GeoObject.name || feature.GeoObject.description || '';
        }
        
        displayName = displayName
                  .replace('Distrito do ', '')
          .replace('Distrito da ', '')
          .replace('Município do ', '')
          .replace('Município da ', '')
          .replace('Província do ', '')
          .replace('Província da ', '')
          .replace('Province of ', '');
        
        // Extrai as coordenadas (Yandex usa longitude primeiro)
        const [lng, lat] = feature.GeoObject.Point.pos.split(' ').map(Number);
        
        return {
          displayName: displayName,
          fullAddress: feature.GeoObject.description || '',
          coordinates: { lat, lng } // Armazena como objeto com lat e lng
        };
      })
      .filter(item => item.displayName)
      .filter((item, index, self) =>
        index === self.findIndex(i => i.displayName === item.displayName)
      )
      .slice(0, 8);
      
      setSuggestions(results);
      
    } catch (error) {
      console.error('Erro na busca de localização:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setLocation({
      address: suggestion.displayName,
      coordinates: suggestion.coordinates
    });
    setSuggestions([]); // Fecha a lista de sugestões
  };
  
  return (

    <View style={styles.screenContainer}>
    {/* Cabeçalho Fixo */}
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Cadastrar Imóvel</Text>
      <View style={styles.headerRight} />
    </View>

    {/* Conteúdo Rolável */}
    
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
      {images.length > 0 ? (
        <View>
          <FlatList
            horizontal
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: item }} 
                  style={styles.image}
                  resizeMode="cover"
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
                <Text style={styles.imageNumberText}>{index + 1}/{images.length}</Text>
              </View>
            )}
            contentContainerStyle={styles.imagesList}
            showsHorizontalScrollIndicator={false}
          />
          <TouchableOpacity 
            style={styles.addMoreButton}
            onPress={showImagePickerOptions}
          >
            <MaterialIcons name="add" size={24} color="#000" />
            <Text style={styles.addMoreButtonText}>Adicionar mais imagens</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imageUploadContainer}>
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={showImagePickerOptions}
          >
            <View style={styles.uploadContent}>
              <MaterialIcons name="cloud-upload" size={40} color="#1A7526" />
              <Text style={styles.uploadText}>Adicionar Imagens</Text>
              <Text style={styles.uploadSubText}>Toque para selecionar ou tirar foto</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      

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

                {/* Substitua o campo de localização por este bloco */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Localização*</Text>
                    <View style={styles.locationInputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Ex: Luanda, Talatona"
                        value={location.address} // Mostra apenas o endereço textual
                        onChangeText={(text) => {
                          setLocation(prev => ({...prev, address: text}));
                          searchLocations(text);
                        }}
                      />
                      
                      {/* Adicione o indicador de carregamento AQUI */}
                      {isSearching && (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator size="small" color="#1A7526" />
                          <Text style={styles.loadingText}>Buscando localizações em Angola...</Text>
                        </View>
                      )}
                      
                      {suggestions.length > 0 && !isSearching && (
                          <ScrollView 
                              style={styles.suggestionsContainer}
                              nestedScrollEnabled={true}
                              keyboardShouldPersistTaps="always"
                            >
                            {suggestions.map((item, index) => (
                              <TouchableOpacity 
                                  key={index.toString()}
                                  style={styles.suggestionItem}
                                  onPress={() => handleSelectSuggestion(item)}
                                >
                                <Text>{item.displayName}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                      )}
                    </View>
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
                      selected={typology === 'T1'}
                      onPress={() => setTypology('T1')}
                      label="T1"
                    />
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
                    <RadioButton
                      selected={typology === 'T5'}
                      onPress={() => setTypology('T5')}
                      label="T5"
                    />
                    <RadioButton
                      selected={typology === 'T6'}
                      onPress={() => setTypology('T6')}
                      label="T6"
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
                      label="3"
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
                      label="3"
                    />
                    <RadioButton
                      selected={bathroomCount === '4'}
                      onPress={() => setBathroomCount('4')}
                      label="4"
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
                  <Text style={styles.label}>Quintal</Text>
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
                    label="Nenhum"
                    selected={andares === '0'}
                    onPress={() => setAndares('0')}
                  />
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
             
                {/* Substitua o campo de localização por este bloco */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Localização*</Text>
                    <View style={styles.locationInputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Luanda, Talatona"
                        value={location.address} // Mostra apenas o endereço textual
                        onChangeText={(text) => {
                          setLocation(prev => ({...prev, address: text}));
                          searchLocations(text);
                        }}
                      />
                      
                      {/* Adicione o indicador de carregamento AQUI */}
                      {isSearching && (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator size="small" color="#1A7526" />
                          <Text style={styles.loadingText}>Buscando localizações em Angola...</Text>
                        </View>
                      )}
                      
                      {suggestions.length > 0 && !isSearching && (
                          <ScrollView 
                              style={styles.suggestionsContainer}
                              nestedScrollEnabled={true}
                              keyboardShouldPersistTaps="always"
                            >
                            {suggestions.map((item, index) => (
                              <TouchableOpacity 
                                  key={index.toString()}
                                  style={styles.suggestionItem}
                                  onPress={() => handleSelectSuggestion(item)}
                                >
                                <Text>{item.displayName}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                      )}
                    </View>
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

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descrição (opcional)</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]} // Ajuste para área de texto maior
                placeholder="Ex: Casa com vista para o mar, recém-renovada, perto de escolas..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>
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
    </View>
  );
}