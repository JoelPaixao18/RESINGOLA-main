import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, Dimensions, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { MagnifyingGlass, PlusSquare, MinusSquare, X } from 'phosphor-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import { LayoutAnimation, UIManager, Platform } from 'react-native';
import styles from '../styles/Home';

const screenWidth = Dimensions.get('window').width;

// Configuração do LayoutAnimation

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Home = () => {
  const [residences, setResidences] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  const fetchResidences = async () => {
    try {
      // 1. Tentar obter do servidor
      let serverResidences = [];
      try {
        const response = await fetch('http://192.168.100.66/RESINGOLA-main/Backend/listar_residences.php'); // Substitua pela URL real da API
        const result = await response.json();
        if (result.status === 'success') {
          serverResidences = result.data || [];
        }
      } catch (serverError) {
        console.warn('Erro ao buscar do servidor:', serverError);
      }
      
      // Combinar e formatar os dados
      const allResidences = [...serverResidences].map(res => ({
        id: res.id || Date.now().toString(),
        image: res.imagem || res.images?.[0] || 'https://via.placeholder.com/150',
        images: res.images || [res.imagem] || [],
        status: res.status || res.status || 'Status não especificado',
        typology: res.typology || res.typeResi || 'Tipo não especificado',
        typeResi: res.typeResi || 'Não especificado',
        houseSize: res.houseSize ? `${res.houseSize} m²` : 'Tamanho não especificado',
        location: res.location || 'Localização não especificada',
        price: res.price ? `Kz ${res.price.toLocaleString()}` : 'Preço não especificado',
        livingRoomCount: res.livingRoomCount || 0,
        kitchenCount: res.kitchenCount || 0,
        hasWater: res.hasWater || false,
        hasElectricity: res.hasElectricity || false,
        createdAt: res.createdAt || new Date().toISOString()
      }));
  
      // Ordenar por data mais recente
      allResidences.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setResidences(allResidences);
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
              // Chamada à API para deletar do banco
              const response = await fetch('http://192.168.100.66/RESINGOLA-main/Backend/deletar.php', {
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

      <View style={styles.inputContainer}>
        <MagnifyingGlass size={30} weight="thin" />
        <TextInput
          style={styles.input}
          placeholder="Pesquise sua casa"
          placeholderTextColor={"#606060"}
        />

      {searchText.length > 0 && (
        <TouchableOpacity onPress={() => setSearchText("")}>
          <X size={24} weight="bold" color="black" />
        </TouchableOpacity>
      )}
      </View>

      <View style={styles.typeHouseContainer}>
        <Pressable style={styles.typeHouseButton} onPress={() => handleDetails(residences[0] || {})}>
          <Text style={styles.typeHouseText}>Venda</Text>
        </Pressable>

        <Pressable style={styles.typeHouseButton}>
          <Text style={styles.typeHouseText}>Arrendamento</Text>
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
            {residences.map((residence) => (
              <View key={residence.id} style={styles.card}>
                <Pressable style={styles.cardButton} onPress={() => handleDetails(residence)}>
                  <Image
                    style={styles.cardImage}
                    source={{ 
                      uri: residence.image,
                      cache: 'reload'
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
                  <Pressable onPress={() => handleDeleteCard(residence.id)}>
                    <MinusSquare size={40} color='#FF0000' weight='fill' />
                  </Pressable>
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