import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, Dimensions, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { MagnifyingGlass, PlusSquare, MinusSquare, X } from 'phosphor-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import { LayoutAnimation, UIManager, Platform } from 'react-native';
import styles from '../styles/Home';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const baseImageUrl = "http://192.168.20.50/RESINGOLA-main/uploads/";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Home = ({ route }) => {
  const [residences, setResidences] = useState([]);
  const [filteredResidences, setFilteredResidences] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [userInitials, setUserInitials] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'sale', 'rent'

  // Extrai as iniciais do nome do usuário
  useEffect(() => {
    const userName = route.params?.userData?.name || route.params?.userData?.nome;
    if (userName) {
      const names = userName.split(' ');
      let initials = '';
      
      if (names.length > 0) {
        initials += names[0].charAt(0).toUpperCase();
      }
      if (names.length > 1) {
        initials += names[names.length - 1].charAt(0).toUpperCase();
      }
      
      setUserInitials(initials);
    }
  }, [route.params]);

  // Função para filtrar as residências
  const filterResidences = useCallback(() => {
    let filtered = residences;
    
    // Aplicar filtro por tipo (venda/arrendamento)
    if (activeFilter === 'sale') {
      filtered = filtered.filter(res => 
        res.status.toLowerCase().includes('venda') 
      );
    } else if (activeFilter === 'rent') {
      filtered = filtered.filter(res => 
        res.status.toLowerCase().includes('arrendamento') 
      );
    }
    // Se for 'all', não aplica filtro de status
    
    // Aplicar filtro de pesquisa
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(res => 
        res.status.toLowerCase().includes(searchLower) ||
        res.typeResi.toLowerCase().includes(searchLower) ||
        res.typology.toLowerCase().includes(searchLower) ||
        res.location.toLowerCase().includes(searchLower) ||
        res.price.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredResidences(filtered);
  }, [residences, activeFilter, searchText]);

  useEffect(() => {
    filterResidences();
  }, [filterResidences]);

  const fetchResidences = async () => {
    try {
      let localResidences = [];
      let serverResidences = [];

      // 1. Buscar do AsyncStorage
      try {
        const savedCardsData = await AsyncStorage.getItem('savedCards');
        localResidences = savedCardsData ? JSON.parse(savedCardsData) : [];
      } catch (localError) {
        console.warn('Erro ao buscar do AsyncStorage:', localError);
      }

      // 2. Buscar do servidor
      try {
        const response = await fetch('http://192.168.20.50/RESINGOLA-main/Backend/listar_residences.php');
        const result = await response.json();
        if (result.status === 'success') {
          serverResidences = result.data || [];
        }
      } catch (serverError) {
        console.warn('Erro ao buscar do servidor:', serverError);
      }

      // 3. Formatar os dados
      const formatResidence = (res) => ({
        id: res.id || Date.now().toString(),
        image: res.imagem ? `${baseImageUrl}${res.imagem}` : res.image || res.images?.[0] || 'https://via.placeholder.com/150',
        images: res.images || (res.imagem ? [`${baseImageUrl}${res.imagem}`] : []),
        status: res.status || 'Status não especificado',
        typology: res.typology || res.typeResi || 'Tipo não especificado',
        typeResi: res.typeResi || 'Não especificado',
        houseSize: res.houseSize ? `${res.houseSize} m²` : 'Tamanho não especificado',
        location: res.location || 'Localização não especificada',
        price: res.price ? `Kz ${Number(res.price).toLocaleString()}` : 'Preço não especificado',
        livingRoomCount: res.livingRoomCount || 0,
        kitchenCount: res.kitchenCount || 0,
        hasWater: res.hasWater || false,
        hasElectricity: res.hasElectricity || false,
        createdAt: res.createdAt || new Date().toISOString(),
        usuario_id: res.usuario_id || null
      });

      const formattedLocal = localResidences.map(formatResidence);
      const formattedServer = serverResidences.map(formatResidence);

      // Evitar duplicatas (pelo ID)
      const combinedResidences = [...formattedServer];
      formattedLocal.forEach((localRes) => {
        if (!combinedResidences.some((res) => res.id === localRes.id)) {
          combinedResidences.push(localRes);
        }
      });

      // Ordenar por data de criação
      combinedResidences.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setResidences(combinedResidences);
    } catch (error) {
      console.error('Erro ao carregar residências', error);
      Alert.alert('Erro', 'Não foi possível carregar as residências');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchResidences();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchResidences();
    setRefreshing(false);
  }, []);

  const handleDetails = (residence) => {
    navigation.navigate('Details', { residence });
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleSaveCard = async (card) => {
    try {
      const savedCardsData = await AsyncStorage.getItem('savedCards');
      let savedCards = savedCardsData ? JSON.parse(savedCardsData) : [];

      if (savedCards.some((savedCard) => savedCard.id === card.id)) {
        alert('Este card já foi salvo!');
        return;
      }

      savedCards.push(card);
      await AsyncStorage.setItem('savedCards', JSON.stringify(savedCards));
      alert('Card salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar card', error);
    }
  };

  const handleDeleteCard = (cardId) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente remover esta residência?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sim', 
          onPress: async () => {
            try {
              const response = await fetch('http://192.168.20.50/RESINGOLA-main/Backend/deletar.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: cardId })
              });
  
              const result = await response.json();
  
              if (result.status === 'success') {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                const updatedResidences = residences.filter(res => res.id !== cardId);
                setResidences(updatedResidences);
              } else {
                Alert.alert('Erro', result.message);
              }
            } catch (error) {
              console.error('Erro ao deletar card', error);
              Alert.alert('Erro', 'Não foi possível deletar a residência');
            }
          } 
        },
      ]
    );
  };  

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.header}>
        <View style={styles.headerLeft}></View>
        <View style={styles.headerRight}></View>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: SCREEN_WIDTH * 0.04, marginBottom: SCREEN_HEIGHT * 0.03}}>
        <View style={[styles.inputContainer, {flex: 1}]}>
          <MagnifyingGlass size={30} weight="thin" />
          <TextInput
            style={styles.input}
            placeholder="Pesquise sua casa"
            placeholderTextColor={"#606060"}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />

          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <X size={24} weight="bold" color="black" />
            </TouchableOpacity>
          )}
        </View>

        <Pressable onPress={handleProfile} style={{ marginLeft: SCREEN_WIDTH * 0.04 }}>
          {userInitials ? (
            <View style={styles.userAvatar}>
              <Text style={styles.userInitials}>{userInitials}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <View style={styles.typeHouseContainer}>
        <Pressable 
          style={[styles.typeHouseButton, activeFilter === 'all' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.typeHouseText, activeFilter === 'all' && styles.activeFilterText]}>Todos</Text>
        </Pressable>

        <Pressable 
          style={[styles.typeHouseButton, activeFilter === 'sale' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('sale')}
        >
          <Text style={[styles.typeHouseText, activeFilter === 'sale' && styles.activeFilterText]}>Venda</Text>
        </Pressable>

        <Pressable 
          style={[styles.typeHouseButton, activeFilter === 'rent' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('rent')}
        >
          <Text style={[styles.typeHouseText, activeFilter === 'rent' && styles.activeFilterText]}>Arrendamento</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
            />
          }
        >
          <View style={styles.gridContainer}>
            {filteredResidences.map((residence) => (
              <View key={residence.id} style={styles.card}>
                <Pressable style={styles.cardButton} onPress={() => handleDetails(residence)}>
                  <Image
                    style={styles.cardImage}
                    source={{
                      uri: residence.image,
                      cache: 'reload',
                    }}
                    resizeMode="cover"
                    onError={(e) => {
                      console.log('Erro ao carregar imagem:', e.nativeEvent.error);
                      if (residence.images?.[0] && residence.images[0] !== residence.image) {
                        residence.image = residence.images[0];
                        setResidences([...residences]);
                      }
                    }}
                  />

                  <View style={styles.cardInfo}>
                    <Text style={styles.cardInfoTitle}>{residence.typology}</Text>
                    <Text style={styles.cardInfoSubTitle}>{residence.location}</Text>
                  </View>
                </Pressable>
                <View style={styles.cardInfoBuy}>
                  <Text style={styles.cardInfoText}>{residence.status}</Text>
                  <Text style={styles.cardInfoText}>{residence.price}</Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <Pressable onPress={() => handleSaveCard(residence)}>
                      <PlusSquare size={40} color='#00FF38' weight='fill' />
                    </Pressable>
  
                    {route.params?.userData?.id && residence.usuario_id && 
                    route.params.userData.id.toString() === residence.usuario_id.toString() && (
                      <Pressable onPress={() => handleDeleteCard(residence.id)}>
                        <MinusSquare size={40} color='#FF0000' weight='fill' />
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;