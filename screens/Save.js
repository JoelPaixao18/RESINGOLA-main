import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, Pressable, RefreshControl, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MagnifyingGlass, Trash } from 'phosphor-react-native';
import save from '../styles/Save';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import styles from '../styles/Home';

function Save() {

  const [residences, setResidences] = useState([]);
  const navigation = useNavigation();

  // Carregar as residências salvas
  useFocusEffect(
    React.useCallback(() => {
      const fetchResidences = async () => {
        try {
          const savedResidencesData = await AsyncStorage.getItem('savedResidences');
          const savedResidences = savedResidencesData ? JSON.parse(savedResidencesData) : [];
          console.log('Dados carregados:', savedResidences); // Verifique os dados carregados
          setResidences(savedResidences);
        } catch (error) {
          console.error('Erro ao carregar residências', error);
        }
      };

      fetchResidences();
    }, [])
  );

   // Navegar para a tela de detalhes com os dados da residência selecionada
  const handleDetails = (residence) => {
    navigation.navigate('Details', { residence }); // Passa a residência selecionada como parâmetro
  };


    //Atualizar os dados
  const [savedCards, setSavedCards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSavedCards = async () => {
    try {
      const savedCardsData = await AsyncStorage.getItem('savedCards');
      const savedCards = savedCardsData ? JSON.parse(savedCardsData) : [];
  
      console.log('Dados carregados:', savedCards); // Verifique se há duplicatas aqui
  
      // Filtra para garantir que não haja duplicatas
      const uniqueCards = savedCards.filter(
        (card, index, self) => index === self.findIndex((c) => c.id === card.id)
      );
  
      setSavedCards(uniqueCards);
    } catch (error) {
      console.error('Erro ao carregar os cards salvos', error);
    }
  };
  

  useEffect(() => {
    fetchSavedCards();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSavedCards().then(() => setRefreshing(false));
  }, []);

  const handleRemoveCard = async (cardId) => {
    try {
      const updatedSavedCards = savedCards.filter(card => card.id !== cardId);
      await AsyncStorage.setItem('savedCards', JSON.stringify(updatedSavedCards));
      setSavedCards(updatedSavedCards);
      alert('Card removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover o card', error);
    }
  };

 return (
  <View style={save.container}>
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.inputContainer}>
        <MagnifyingGlass size={30}  weight="thin" />
        <TextInput
          style={styles.input}
          placeholder="Pesquise sua casa"
          placeholderTextColor={"#606060"}
        />
      </View>

      {savedCards.length === 0 ? (
        <Text style={save.emptyText}>Nenhum card salvo!</Text>
      ) : (
        savedCards.map((card) => (
          <View key={card.id} style={styles.gridContainer}>
            <Pressable style={styles.cardButton} onPress={() => handleDetails(card)}>
              <Image source={{ uri: card.image }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardInfoTitle}>{card.typology}</Text>
                <Text style={styles.cardInfoSubTitle}>{card.location}</Text>
              </View>
              <View style={styles.cardInfoBuy}>
                <Text style={styles.cardInfoText}>{card.price} €</Text>
                <Pressable onPress={() => handleRemoveCard(card.id)}>
                  <Trash size={24} color="#FF0000" />
                </Pressable>
              </View>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  </View>
);

}

export default Save;

