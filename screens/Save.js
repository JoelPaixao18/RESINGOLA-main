import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trash } from 'phosphor-react-native'; // Importando ícone de remoção
import styles from '../styles/Home'; // Importando os estilos para os cards que virão da tela Home
import save from '../styles/Save'; // Importando os estilos específicos para esta tela

function Save() {
  const [savedCards, setSavedCards] = useState([]);

  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        const savedCardsData = await AsyncStorage.getItem('savedCards');
        if (savedCardsData) {
          setSavedCards(JSON.parse(savedCardsData));
        }
      } catch (error) {
        console.error('Erro ao carregar os cards salvos', error);
      }
    };

    fetchSavedCards();
  }, []);

  // Função para remover o card do AsyncStorage
  const handleRemoveCard = async (cardId) => {
    try {
      // Filtrando o card a ser removido
      const updatedSavedCards = savedCards.filter(card => card.id !== cardId);

      // Atualizando o AsyncStorage com os cards restantes
      await AsyncStorage.setItem('savedCards', JSON.stringify(updatedSavedCards));

      // Atualizando o estado com os cards restantes
      setSavedCards(updatedSavedCards);

      alert('Card removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover o card', error);
    }
  };

  return (
    <View style={save.container}>
      <ScrollView>
        {savedCards.length === 0 ? (
          <Text style={save.emptyText}>Nenhum card salvo!</Text>
        ) : (
          savedCards.map((card, index) => (
            <View key={index} style={styles.card}> {/* Usando o estilo de card da Home */}
              <Image source={require('../assets/Image_1.png')} style={styles.cardImage} /> {/* Usando a imagem salva */}
              <View style={styles.cardInfo}>
                <Text style={styles.cardInfoTitle}>{card.title}</Text> {/* Usando o estilo para o título */}
                <Text style={styles.cardInfoSubTitle}>{card.subtitle}</Text> {/* Usando o estilo para o subtítulo */}
              </View>
              <View style={styles.cardInfoBuy}>
                <Text style={styles.cardInfoText}>{card.price}</Text> {/* Usando o estilo para o preço */}
                <Pressable onPress={() => handleRemoveCard(card.id)}>
                  <Trash size={24} color="#FF0000" /> {/* Ícone de remoção */}
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

export default Save;