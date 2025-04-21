import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Switch, ActivityIndicator, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/Upload';

export default function Upload() {
  const [images, setImages] = useState([]);
  const [houseSize, setHouseSize] = useState('');
  const [status, setStatus] = useState('');
  const [typeResi, setTypeResi] = useState('Apartamento'); // Renomeado de typology para typeResi
  const [typology, setTypology] = useState(''); // Agora será usado apenas para T2, T3, T4
  const [livingRoomCount, setLivingRoomCount] = useState('');
  const [kitchenCount, setKitchenCount] = useState('');
  const [hasWater, setHasWater] = useState(false);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [location, setLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [price, setPrice] = useState('');
  const navigation = useNavigation();

  const isFormValid = () => {
    // Validação básica de campos obrigatórios
    if (images.length === 0) {
      Alert.alert("Erro", "Adicione pelo menos uma imagem");
      return false;
    }
  
    if (!houseSize || isNaN(houseSize) || parseFloat(houseSize) <= 0) {
      Alert.alert("Erro", "Tamanho da casa inválido (deve ser um número positivo)");
      return false;
    }

    if (!status || status.trim() === "") {
      Alert.alert("Erro", "Este Imóvel é para? (diga se é para Venda ou Arrendamento)");
      return false;
    }
  
    if (!typeResi || typeResi.trim() === "") {
      Alert.alert("Erro", "Tipo de residência é obrigatório");
      return false;
    }
  
    if (!location || location.trim() === "") {
      Alert.alert("Erro", "Localização é obrigatória");
      return false;
    }
  
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert("Erro", "Preço inválido (deve ser um valor positivo)");
      return false;
    }
  
    // Validações específicas
    if (!typology || typology.trim() === "") {
      Alert.alert("Erro", "Tipologia (T2, T3, etc.) é obrigatória");
      return false;
    }
  
    if (!livingRoomCount || isNaN(livingRoomCount) || parseInt(livingRoomCount) < 0) {
      Alert.alert("Erro", "Número de salas inválido");
      return false;
    }
  
    if (!kitchenCount || isNaN(kitchenCount) || parseInt(kitchenCount) <= 0) {
      Alert.alert("Erro", "Número de cozinhas inválido");
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
      const formData = new FormData();
      formData.append('image', {
        uri: uri,
        type: 'image/jpeg',
        name: `imovel_${Date.now()}.jpg`
      });
  
      const response = await fetch('http://192.168.100.66/RESINGOLA-main/Backend/uploads/upload_image.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
  
      // 1. Primeiro obtenha a resposta como texto
      const responseText = await response.text();
      console.log('Resposta bruta:', responseText); // Para debug
  
      // 2. Depois tente parsear como JSON
      const result = JSON.parse(responseText);
  
      // 3. Verifique se o status é success
      if (result.status !== 'success') {
        throw new Error(result.message || 'Upload falhou');
      }
  
      // 4. Retorne a URL da imagem
      return result.imageUrl;
  
    } catch (error) {
      console.error('Erro no upload:', error);
      throw new Error('Falha ao enviar imagem: ' + error.message);
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
      // 1. Upload de imagens (mantido igual)
      const uploadedImages = [];
      for (const imgUri of images) {
        const imageUrl = await uploadImage(imgUri);
        uploadedImages.push(imageUrl);
      }
  
            // 2. Preparação dos dados (mantido igual)
            const residenceData = {
              imagem: uploadedImages[0],
              images: uploadedImages,
              houseSize: parseFloat(houseSize),
              status: status,
              typeResi: typeResi,
              typology: typology,
              livingRoomCount: parseInt(livingRoomCount),
              kitchenCount: parseInt(kitchenCount),
              hasWater: hasWater,
              hasElectricity: hasElectricity,
              location: location,
              price: parseFloat(price),
              createdAt: new Date().toISOString()
            };
  
      // 3. Envio para o servidor - CORREÇÃO PRINCIPAL
      const response = await fetch('http://192.168.100.66/RESINGOLA-main/Backend/conect.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(residenceData)
      });
  
      // 4. Tratamento INFALÍVEL da resposta
      const responseText = await response.text();
      
      if (!responseText) {
        // Se vazio mas status HTTP for 200, considera sucesso
        if (response.ok) {
          Alert.alert('Sucesso', 'Cadastro realizado!');
          navigation.navigate('Home');
          return;
        }
        throw new Error('Servidor retornou resposta vazia');
      }
  
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        // Se não for JSON mas tiver conteúdo
        if (response.ok && responseText.includes('sucesso')) {
          Alert.alert('Sucesso', 'Cadastro realizado!');
          navigation.navigate('Home');
          return;
        }
        throw new Error(`Resposta inválida: ${responseText.substring(0, 50)}`);
      }
  
      // 5. Verificação de sucesso
      if (response.ok && (result.status === 'success' || result.success)) {
        Alert.alert('Sucesso', result.message || 'Cadastro realizado!');
        navigation.navigate('Home');
      } else {
        throw new Error(result.message || result.error || 'Erro no servidor');
      }
  
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', error.message || 'Falha no cadastro');
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
          <Text style={styles.label}>Tamanho da casa (m²)*</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 120"
            keyboardType="numeric"
            value={houseSize}
            onChangeText={setHouseSize}
          />

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

          <Text style={styles.label}>Tipo de Imóvel*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={typeResi}
              onValueChange={(itemValue) => {
                setTypeResi(itemValue);
                setTypology('');
                setLivingRoomCount('');
                setKitchenCount('');
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o Tipo de Imóvel" value="" />
              <Picker.Item label="Apartamento" value="Apartamento" />
              <Picker.Item label="Vivenda" value="Vivenda" />
              <Picker.Item label="Moradia" value="Moradia" />
            </Picker>
          </View>

          {typeResi === 'Apartamento' && (
            <>
              <Text style={styles.label}>Tipologia do Imóvel*</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={typology}
                  onValueChange={setTypology}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione a Tipologia" value="" />
                  <Picker.Item label="T2" value="T2" />
                  <Picker.Item label="T3" value="T3" />
                  <Picker.Item label="T4" value="T4" />
                </Picker>
              </View>
            </>
          )}

          {(typeResi === 'Moradia' || typeResi === 'Vivenda') && (
            <>
              <Text style={styles.label}>Tipologia de Imóvel*</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={typology}
                  onValueChange={setTypology}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione o tipo" value="" />
                  <Picker.Item label="T2" value="T2" />
                  <Picker.Item label="T3" value="T3" />
                  <Picker.Item label="T4" value="T4" />
                </Picker>
              </View>
              
              <Text style={styles.label}>Número de Salas*</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                placeholder="Ex: 2"
                value={livingRoomCount} 
                onChangeText={setLivingRoomCount} 
              />
              
              <Text style={styles.label}>Número de Cozinhas*</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                placeholder="Ex: 1"
                value={kitchenCount} 
                onChangeText={setKitchenCount} 
              />
            </>
          )}

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
          
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              styles.disabledButton
            ]} 
            onPress={handleSubmit}
            activeOpacity={0.7}
          >
              <Text style={styles.submitButtonText}>Cadastrar Residência</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}