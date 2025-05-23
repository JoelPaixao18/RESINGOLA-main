import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, Pressable, RefreshControl, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MagnifyingGlass, Trash, MapPin, Eye, House } from 'phosphor-react-native';
import save from '../styles/Save';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

function Save() {
  const [savedCards, setSavedCards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const navigation = useNavigation();

  const fetchSavedCards = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        Alert.alert('Erro', 'Você precisa estar logado para ver os imóveis salvos');
        navigation.navigate('Login');
        return;
      }

      const user = JSON.parse(userData);
      const savedCardsKey = `savedCards_${user.id}`;
      
      const savedCardsData = await AsyncStorage.getItem(savedCardsKey);
      const savedCards = savedCardsData ? JSON.parse(savedCardsData) : [];

      const sortedCards = savedCards.sort((a, b) => 
        new Date(b.savedAt) - new Date(a.savedAt)
      );

      setSavedCards(sortedCards);
      setFilteredCards(sortedCards);
    } catch (error) {
      console.error('Erro ao carregar os imóveis salvos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os imóveis salvos');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSavedCards();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSavedCards().finally(() => setRefreshing(false));
  }, []);

  const handleRemoveCard = async (cardId) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) return;

      const user = JSON.parse(userData);
      const savedCardsKey = `savedCards_${user.id}`;

      const updatedCards = savedCards.filter(card => card.id !== cardId);
      
      await AsyncStorage.setItem(savedCardsKey, JSON.stringify(updatedCards));
      setSavedCards(updatedCards);
      setFilteredCards(updatedCards);
      
      Alert.alert('Sucesso', 'Imóvel removido da sua lista!');
    } catch (error) {
      console.error('Erro ao remover o imóvel:', error);
      Alert.alert('Erro', 'Não foi possível remover o imóvel');
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = savedCards.filter(card => 
        card.typology?.toLowerCase().includes(text.toLowerCase()) ||
        card.location?.toLowerCase().includes(text.toLowerCase()) ||
        card.price?.toLowerCase().includes(text.toLowerCase()) ||
        card.status?.toLowerCase().includes(text.toLowerCase()) ||
        card.typeResi?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards(savedCards);
    }
  };

  const handleDetails = (residence) => {
    navigation.navigate('Details', { residence });
  };

  const formatLocation = (location) => {
    if (!location) return 'Localização não informada';
    return location.length > 35 ? location.substring(0, 35) + '...' : location;
  };

  return (
    <View style={save.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#1A7526']}
            tintColor="#1A7526"
          />
        }
      >
        <View style={save.searchContainer}>
          <View style={[save.cardContainer, { padding: 10 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MagnifyingGlass size={24} color="#666" />
              <TextInput
                style={{ 
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 16,
                  color: '#333'
                }}
                placeholder="Pesquisar imóveis salvos"
                placeholderTextColor="#666"
                value={searchText}
                onChangeText={handleSearch}
              />
            </View>
          </View>
        </View>

        {filteredCards.length === 0 ? (
          <View style={save.emptyContainer}>
            <House size={50} color="#666" style={save.emptyIcon} />
            <Text style={save.emptyText}>
              {searchText ? 'Nenhum imóvel encontrado' : 'Nenhum imóvel salvo!'}
            </Text>
          </View>
        ) : (
          filteredCards.map((card) => (
            <View key={card.id} style={save.cardContainer}>
              <Image 
                source={{ uri: card.image }} 
                style={save.cardImage}
                resizeMode="cover"
              />
              
              <View style={save.cardContent}>
                <View style={save.cardHeader}>
                  <Text style={save.propertyTitle}>{card.typology}</Text>
                  <Text style={save.propertyPrice}>{card.price}</Text>
                </View>

                <View style={save.statusContainer}>
                  <Text style={[save.statusText, { color: '#1A7526' }]}>
                    {card.status}
                  </Text>
                  <Text style={save.typeText}>
                    {card.typeResi}
                  </Text>
                </View>

                <View style={save.locationContainer}>
                  <MapPin size={16} color="#666" />
                  <Text style={save.locationText}>
                    {formatLocation(card.location)}
                  </Text>
                </View>

                {card.houseSize && (
                  <View style={save.detailsContainer}>
                    <View style={save.detailItem}>
                      <House size={16} color="#666" />
                      <Text style={save.detailText}>{card.houseSize} m²</Text>
                    </View>
                  </View>
                )}

                <View style={save.actionsContainer}>
                  <Pressable 
                    style={[save.actionButton, save.viewButton]}
                    onPress={() => handleDetails(card)}
                  >
                    <Eye size={20} color="#fff" />
                    <Text style={save.buttonText}>Ver Detalhes</Text>
                  </Pressable>

                  <Pressable 
                    style={[save.actionButton, save.deleteButton]}
                    onPress={() => handleRemoveCard(card.id)}
                  >
                    <Trash size={20} color="#FF0000" />
                    <Text style={save.deleteButtonText}>Remover</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

export default Save;

