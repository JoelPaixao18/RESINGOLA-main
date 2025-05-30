import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, TouchableOpacity, Image, FlatList, Platform, ActionSheetIOS, Switch, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import styles from '../styles/Upload'; // Reutilizando os estilos do Upload

// Custom Radio Button Component
const RadioButton = ({ selected, onPress, label }) => (
  <TouchableOpacity 
    style={[
      styles.radioOption,
      selected && styles.radioOptionSelected
    ]} 
    onPress={onPress}
  >
    <View style={styles.radioCircle}>
      {selected && <View style={styles.radioCheckedCircle} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

const EditarImovel = ({ route, navigation }) => {
  const { property, onPropertyUpdated } = route.params;
  
  const [images, setImages] = useState([]);
  const baseImageUrl = "http://192.168.213.25/RESINGOLA-main/Backend/uploads/";
  const [failedImages, setFailedImages] = useState(new Set());
  const [formData, setFormData] = useState({
    tipo: property.tipo || '',
    preco: property.preco?.replace(/[^\d]/g, '') || '',
    area: property.area?.toString() || '',
    status: property.status || '',
    typology: property.typology || '',
    livingRoomCount: property.livingRoomCount?.toString() || '',
    kitchenCount: property.kitchenCount?.toString() || '',
    bathroomCount: property.bathroomCount?.toString() || '',
    andares: property.andares?.toString() || '',
    description: property.descricao || ''
  });

  const [hasWater, setHasWater] = useState(property.hasWater === '1' || property.hasWater === true);
  const [hasElectricity, setHasElectricity] = useState(property.hasElectricity === '1' || property.hasElectricity === true);
  const [quintal, setQuintal] = useState(property.quintal === '1' || property.quintal === true);
  const [garagem, setGaragem] = useState(property.garagem === '1' || property.garagem === true);
  const [varanda, setVaranda] = useState(property.varanda === '1' || property.varanda === true);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [location, setLocation] = useState({
    address: property.localizacao || '',
    coordinates: {
      lat: property.latitude || null,
      lng: property.longitude || null
    }
  });

  // Função para processar o caminho da imagem
// EditarImovel.js - atualize a função getImageUrl
const getImageUrl = (imageName) => {
  if (!imageName) return null;
  
  // Se a imagem já é uma URL completa, retorna ela mesma
  if (imageName.startsWith('http')) {
    return imageName;
  }
  
  // Remove qualquer barra inicial e o prefixo 'uploads' se existir
  let cleanImageName = imageName.replace(/^\/?uploads\//, '');
  cleanImageName = cleanImageName.replace(/^\/?/, ''); // Remove qualquer barra restante
  
  // Constrói a URL final
  return `${baseImageUrl}${cleanImageName}`;
};

  // Carregar imagens existentes quando o componente montar
useEffect(() => {
    console.log('Dados do imóvel recebidos:', property);
    
    if (property.images) {
        let processedImages = [];
        
        if (typeof property.images === 'string') {
            processedImages = property.images.split(',')
                .map(img => img.trim())
                .filter(img => img.length > 0);
        } else if (Array.isArray(property.images)) {
            processedImages = property.images.filter(img => img);
        }
        
        console.log('Imagens processadas:', processedImages);
        
        const imageUrls = processedImages.map(img => {
            const cleanPath = img.replace(/^\/?uploads\//, '');
            return `http://192.168.213.25/RESINGOLA-main/Backend/Uploads/${cleanPath}?t=${Date.now()}`;
        });
        
        console.log('URLs das imagens:', imageUrls);
        setImages(imageUrls);
    }
}, [property]);

  // Função para lidar com erro no carregamento da imagem
  const handleImageError = (failedUrl) => {
    console.log('Erro ao carregar imagem:', failedUrl);
    setFailedImages(prev => new Set([...prev, failedUrl]));
  };

const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permissão para acessar a galeria foi negada!');
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
        const validImages = [];
        console.log('Imagens selecionadas:', result.assets.map(asset => asset.uri));

        for (let asset of result.assets) {
            try {
                const newPath = `${FileSystem.documentDirectory}${Date.now()}_${asset.assetId || Math.random()}.jpg`;
                console.log(`Copiando imagem de ${asset.uri} para ${newPath}`);
                await FileSystem.copyAsync({
                    from: asset.uri,
                    to: newPath,
                });

                const fileInfo = await FileSystem.getInfoAsync(newPath);
                console.log(`Informações do arquivo ${newPath}:`, fileInfo);
                if (fileInfo.size > 5 * 1024 * 1024) {
                    Alert.alert("Erro", `Imagem ${asset.fileName || 'desconhecida'} excede 5MB e foi ignorada.`);
                    continue;
                }

                validImages.push(newPath);
            } catch (error) {
                console.error(`Erro ao processar imagem ${asset.uri}:`, error);
                Alert.alert("Erro", `Falha ao processar imagem ${asset.fileName || 'desconhecida'}.`);
                continue;
            }
        }

        console.log('Imagens válidas para adicionar ao estado:', validImages);
        if (validImages.length > 0) {
            setImages(prev => {
                const newImages = [...prev, ...validImages];
                console.log('Estado images atualizado:', newImages);
                return newImages;
            });
        } else {
            console.log('Nenhuma imagem válida selecionada.');
        }
    } else {
        console.log('Seleção de imagens cancelada ou sem ativos.');
    }
};

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Permissão para acessar a câmera foi negada!');
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
    setImages(prev => prev.filter((_, i) => i !== index));
    // Limpar o cache de falhas se a imagem for removida
    const removedUrl = images[index];
    if (failedImages.has(removedUrl)) {
      setFailedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(removedUrl);
        return newSet;
      });
    }
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
          coordinates: { lat, lng }
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

const handleUpdate = async () => {
    try {
        setLoading(true);
        console.log('Iniciando atualização do imóvel...');
        console.log('Imagens no estado:', images);

        // Validações
        if (!formData.tipo) throw new Error('Selecione o tipo de imóvel');
        if (!formData.status) throw new Error('Selecione o status do imóvel');
        if (!formData.area) throw new Error('Informe a área do imóvel');
        if (!formData.preco) throw new Error('Informe o preço do imóvel');
        if (!location.address) throw new Error('Informe a localização do imóvel');

        const updateData = new FormData();

        // Processar imagens
        console.log('Processando imagens:', images.length, 'imagens');
        images.forEach((uri, index) => {
            if (uri.startsWith('http')) {
                const filename = uri.split('/').pop().split('?')[0];
                console.log(`Adicionando existing_images[${index}]:`, filename);
                updateData.append('existing_images[]', filename);
            } else {
                console.log(`Adicionando new_images[${index}]:`, uri);
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';
                updateData.append('new_images[]', {
                    uri,
                    name: `image_${index}_${Date.now()}.${match ? match[1] : 'jpg'}`,
                    type,
                });
            }
        });

        // Se não houver imagens existentes, envie um array vazio explicitamente
        if (!images.some(uri => uri.startsWith('http'))) {
            console.log('Nenhuma imagem existente, enviando existing_images[] vazio');
            updateData.append('existing_images[]', '');
        }

        // Adicionar outros campos
        const fieldsToUpdate = {
            id: property.id,
            tipo: formData.tipo,
            preco: formData.preco,
            localizacao: location.address,
            latitude: location.coordinates.lat?.toString() || '',
            longitude: location.coordinates.lng?.toString() || '',
            area: formData.area,
            status: formData.status,
            typology: formData.typology,
            livingRoomCount: formData.livingRoomCount,
            kitchenCount: formData.kitchenCount,
            bathroomCount: formData.bathroomCount,
            andares: formData.andares,
            hasWater: hasWater ? '1' : '0',
            hasElectricity: hasElectricity ? '1' : '0',
            quintal: quintal ? '1' : '0',
            garagem: garagem ? '1' : '0',
            varanda: varanda ? '1' : '0',
            descricao: formData.description,
        };

        console.log('Dados a serem enviados:', fieldsToUpdate);
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                updateData.append(key, value);
            }
        });

        console.log('FormData final:');
        for (let [key, value] of updateData._parts) {
            console.log(key, typeof value === 'object' ? { uri: value.uri, name: value.name, type: value.type } : value);
        }

        const response = await fetch('http://192.168.213.25/RESINGOLA-main/Backend/editar_imovel.php', {
            method: 'POST',
            body: updateData,
            headers: {
                'Accept': 'application/json',
            },
        });

        console.log('Status da resposta:', response.status);
        const responseText = await response.text();
        console.log('Resposta completa:', responseText);

        let result;
        try {
            result = JSON.parse(responseText);
            console.log('Resposta parseada:', result);
        } catch (e) {
            console.error('Erro ao parsear JSON:', e, responseText);
            throw new Error('Resposta inválida do servidor');
        }

        if (result.status === 'success') {
            const processedImages = Array.isArray(result.property.images)
                ? result.property.images.map(img => img.trim()).filter(img => img)
                : result.property.images && typeof result.property.images === 'string'
                ? result.property.images.split(',').map(img => img.trim()).filter(img => img)
                : [];
            const imageUrls = processedImages.map(img =>
                img.startsWith('http') ? img : `http://192.168.213.25/RESINGOLA-main/Backend/Uploads/${img.replace(/^\/?Uploads\//, '')}?t=${Date.now()}`
            );

            console.log('URLs finais das imagens:', imageUrls);

            Alert.alert('Sucesso', 'Imóvel atualizado com sucesso', [
                {
                    text: 'OK',
                    onPress: () => {
                        if (onPropertyUpdated) {
                            onPropertyUpdated({
                                ...result.property,
                                images: imageUrls,
                            });
                        }
                        navigation.goBack();
                    },
                },
            ]);
        } else {
            throw new Error(result.message || 'Erro ao atualizar imóvel');
        }
    } catch (error) {
        console.error('Erro detalhado:', error);
        Alert.alert('Erro', error.message || 'Não foi possível atualizar o imóvel');
    } finally {
        setLoading(false);
    }
};

const renderImage = ({ item: uri, index }) => {
    console.log(`Renderizando imagem ${index}:`, uri);
    
    const isLocalImage = uri.startsWith('file:') || uri.startsWith('/') || !uri.startsWith('http');

    return (
        <View style={styles.imageContainer} key={`${uri}-${index}`}>
            <Image 
                source={isLocalImage ? 
                    { uri } : 
                    { 
                        uri: `${uri.split('?')[0]}?t=${Date.now()}`,
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Pragma': 'no-cache',
                        },
                    }
                }
                style={styles.image}
                resizeMode="cover"
                onError={(e) => {
                    console.log(`Erro ao carregar imagem ${index}:`, e.nativeEvent.error, uri);
                    handleImageError(uri);
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
    );
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
        <Text style={styles.headerTitle}>Editar Imóvel</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Conteúdo Rolável */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Seção de Imagens */}
          {images.length > 0 ? (
            <View>
              // Na seção de renderização:
              <FlatList
                  horizontal
                  data={images}
                  keyExtractor={(item, index) => `${item}-${index}`}
                  renderItem={renderImage}
                  contentContainerStyle={styles.imagesList}
                  showsHorizontalScrollIndicator={false}
                  extraData={images} // Força re-renderização quando images mudar
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
                  <MaterialIcons name="cloud-upload" size={40} color="#007AFF" />
                  <Text style={styles.uploadText}>Adicionar Imagens</Text>
                  <Text style={styles.uploadSubText}>Toque para selecionar ou tirar foto</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tamanho da casa (m²)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 120"
                keyboardType="numeric"
                value={formData.area}
                onChangeText={(text) => setFormData({...formData, area: text})}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Imóvel Para</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="Este Imóvel é para" value="" />
                  <Picker.Item label="Venda" value="Venda" />
                  <Picker.Item label="Arrendamento" value="Arrendamento" />
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tipo de Imóvel</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.tipo}
                  onValueChange={(value) => setFormData({...formData, tipo: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione o Tipo de Imóvel" value="" />
                  <Picker.Item label="Apartamento" value="Apartamento" />
                  <Picker.Item label="Vivenda" value="Vivenda" />
                  <Picker.Item label="Moradia" value="Moradia" />
                </Picker>
              </View>
            </View>

            {/* Campos específicos para Apartamento */}
            {formData.tipo === 'Apartamento' && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Tipologia</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={formData.typology === 'T2'}
                      onPress={() => setFormData({...formData, typology: 'T2'})}
                      label="T2"
                    />
                    <RadioButton
                      selected={formData.typology === 'T3'}
                      onPress={() => setFormData({...formData, typology: 'T3'})}
                      label="T3"
                    />
                    <RadioButton
                      selected={formData.typology === 'T4'}
                      onPress={() => setFormData({...formData, typology: 'T4'})}
                      label="T4"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Salas</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={String(formData.livingRoomCount) === '1'}
                      onPress={() => setFormData({...formData, livingRoomCount: '1'})}
                      label="1"
                    />
                    <RadioButton
                      selected={String(formData.livingRoomCount) === '2'}
                      onPress={() => setFormData({...formData, livingRoomCount: '2'})}
                      label="2"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Banheiros</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={String(formData.bathroomCount) === '1'}
                      onPress={() => setFormData({...formData, bathroomCount: '1'})}
                      label="1"
                    />
                    <RadioButton
                      selected={String(formData.bathroomCount) === '2'}
                      onPress={() => setFormData({...formData, bathroomCount: '2'})}
                      label="2"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Cozinhas</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={String(formData.kitchenCount) === '1'}
                      onPress={() => setFormData({...formData, kitchenCount: '1'})}
                      label="1"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Varanda</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={varanda === true}
                      onPress={() => setVaranda(true)}
                      label="Sim"
                    />
                    <RadioButton
                      selected={varanda === false}
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
                      trackColor={{ false: '#767577', true: '#007AFF' }}
                      thumbColor={hasWater ? '#f4f3f4' : '#f4f3f4'}
                    />
                  </View>
                  <View style={styles.switchContainer}>
                    <Text>Energia Elétrica</Text>
                    <Switch
                      value={hasElectricity}
                      onValueChange={setHasElectricity}
                      trackColor={{ false: '#767577', true: '#007AFF' }}
                      thumbColor={hasElectricity ? '#f4f3f4' : '#f4f3f4'}
                    />
                  </View>
                </View>
              </>
            )}

            {/* Campos específicos para Vivenda/Moradia */}
            {(formData.tipo === 'Vivenda' || formData.tipo === 'Moradia') && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Tipologia</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={formData.typology === 'T1'}
                      onPress={() => setFormData({...formData, typology: 'T1'})}
                      label="T1"
                    />
                    <RadioButton
                      selected={formData.typology === 'T2'}
                      onPress={() => setFormData({...formData, typology: 'T2'})}
                      label="T2"
                    />
                    <RadioButton
                      selected={formData.typology === 'T3'}
                      onPress={() => setFormData({...formData, typology: 'T3'})}
                      label="T3"
                    />
                    <RadioButton
                      selected={formData.typology === 'T4'}
                      onPress={() => setFormData({...formData, typology: 'T4'})}
                      label="T4"
                    />
                    <RadioButton
                      selected={formData.typology === 'T5'}
                      onPress={() => setFormData({...formData, typology: 'T5'})}
                      label="T5"
                    />
                    <RadioButton
                      selected={formData.typology === 'T6'}
                      onPress={() => setFormData({...formData, typology: 'T6'})}
                      label="T6"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Salas</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={String(formData.livingRoomCount) === '1'}
                      onPress={() => setFormData({...formData, livingRoomCount: '1'})}
                      label="1"
                    />
                    <RadioButton
                      selected={String(formData.livingRoomCount) === '2'}
                      onPress={() => setFormData({...formData, livingRoomCount: '2'})}
                      label="2"
                    />
                    <RadioButton
                      selected={String(formData.livingRoomCount) === '3'}
                      onPress={() => setFormData({...formData, livingRoomCount: '3'})}
                      label="3"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Banheiros</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={String(formData.bathroomCount) === '1'}
                      onPress={() => setFormData({...formData, bathroomCount: '1'})}
                      label="1"
                    />
                    <RadioButton
                      selected={String(formData.bathroomCount) === '2'}
                      onPress={() => setFormData({...formData, bathroomCount: '2'})}
                      label="2"
                    />
                    <RadioButton
                      selected={String(formData.bathroomCount) === '3'}
                      onPress={() => setFormData({...formData, bathroomCount: '3'})}
                      label="3"
                    />
                    <RadioButton
                      selected={String(formData.bathroomCount) === '4'}
                      onPress={() => setFormData({...formData, bathroomCount: '4'})}
                      label="4"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Cozinhas</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={String(formData.kitchenCount) === '1'}
                      onPress={() => setFormData({...formData, kitchenCount: '1'})}
                      label="1"
                    />
                    <RadioButton
                      selected={String(formData.kitchenCount) === '2'}
                      onPress={() => setFormData({...formData, kitchenCount: '2'})}
                      label="2"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Quintal</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={quintal === true}
                      onPress={() => setQuintal(true)}
                      label="Sim"
                    />
                    <RadioButton
                      selected={quintal === false}
                      onPress={() => setQuintal(false)}
                      label="Não"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Garagem</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      selected={garagem === true}
                      onPress={() => setGaragem(true)}
                      label="Sim"
                    />
                    <RadioButton
                      selected={garagem === false}
                      onPress={() => setGaragem(false)}
                      label="Não"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Andares</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton
                      label="Nenhum"
                      selected={String(formData.andares) === '0'}
                      onPress={() => setFormData({...formData, andares: '0'})}
                    />
                    <RadioButton
                      selected={String(formData.andares) === '1'}
                      onPress={() => setFormData({...formData, andares: '1'})}
                      label="1"
                    />
                    <RadioButton
                      selected={String(formData.andares) === '2'}
                      onPress={() => setFormData({...formData, andares: '2'})}
                      label="2"
                    />
                    <RadioButton
                      selected={String(formData.andares) === '3'}
                      onPress={() => setFormData({...formData, andares: '3'})}
                      label="3+"
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
                      trackColor={{ false: '#767577', true: '#007AFF' }}
                    />
                  </View>
                  <View style={styles.switchContainer}>
                    <Text>Energia Elétrica</Text>
                    <Switch
                      value={hasElectricity}
                      onValueChange={setHasElectricity}
                      trackColor={{ false: '#767577', true: '#007AFF' }}
                    />
                  </View>
                </View>
              </>
            )}

            {/* Campos comuns para todos os tipos */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Localização</Text>
              <View style={styles.locationInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Luanda, Talatona"
                  value={location.address}
                  onChangeText={(text) => {
                    setLocation(prev => ({...prev, address: text}));
                    searchLocations(text);
                  }}
                />
                
                {isSearching && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#007AFF" />
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
              <Text style={styles.label}>Preço (kz)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 150000"
                keyboardType="numeric"
                value={formData.preco}
                onChangeText={(text) => setFormData({...formData, preco: text.replace(/\D/g, '')})}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Ex: Casa com vista para o mar, recém-renovada, perto de escolas..."
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleUpdate}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditarImovel;