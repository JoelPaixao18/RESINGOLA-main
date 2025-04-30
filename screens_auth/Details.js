import { Bookmark, CaretLeft, MapPin, PhoneCall } from 'phosphor-react-native';
import React from 'react';
import { Image, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/Details';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Details() {
  const navigation = useNavigation();
  const route = useRoute(); // Acessa os parâmetros da navegação
  const { residence } = route.params; // Extrai a residência dos parâmetros

  // Função para gerar o texto descritivo da residência
  const generateDescription = (residence) => {
    const resources = [];
    if (residence.hasWater) resources.push('Água');
    if (residence.hasElectricity) resources.push('Energia Elétrica');
    
    return (
      <View style={styles.descriptionView}>
        <Text style={styles.description}>Descrição</Text>
        <Text style={styles.descriptionText}>
          Esta residência é um/a {residence.typeResi.toLowerCase()} {residence.typology ? `(${residence.typology})` : ''} localizado em {residence.location}. 
          Possui {residence.houseSize} de área construída, com:
          {"\n"}- {residence.livingRoomCount} sala(s)
          {"\n"}- {residence.kitchenCount} cozinha(s)
          {"\n\n"}Recursos disponíveis: {resources.length > 0 ? resources.join(', ') : 'Nenhum recurso disponível'}.
        </Text>
      </View>
    );
  };

    // Salvar um card (opcional)
    const handleSaveCard = async (card) => {
      try {
        const savedCardsData = await AsyncStorage.getItem('savedCards');
        const savedCards = savedCardsData ? JSON.parse(savedCardsData) : [];
  
        const isCardSaved = savedCards.some((savedCard) => savedCard.id === card.id);
  
        if (isCardSaved) {
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
  

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.headerImage} source={{ uri: residence.image }} />

        <View style={styles.headerInfoButtons}>
          <CaretLeft size={32} onPress={handleGoBack} />
          <Text style={styles.headerInfoButtonsText}>Detalhes</Text>
          <View style={styles.headerInfoButtonsRight}>
            <Bookmark size={32} onPress={() => handleSaveCard(residence)} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.infoNameText}>{residence.typology}</Text>

        <View style={styles.contentAddress}>
          <MapPin size={36} color='#1A7526' weight='fill' />
          <Text style={styles.contentAddressText}>{residence.location}</Text>
          <Text style={styles.contentAddressPrice}>{residence.price}</Text>
        </View>

        <View style={styles.separator} />

        {/* Exibir a descrição da residência */}
        <Text style={styles.descriptionText}>
          {generateDescription(residence)}
        </Text>

        <View style={styles.sellerInfo}>
          <View style={styles.sellerInfoLeft}>
            <Text style={styles.sellerInfoTextName}>Ana Casiana</Text>
            <Text style={styles.sellerInfoTextSeller}>Vendedor/a</Text>
          </View>

          <View style={styles.sellerInfoRight}>
            <PhoneCall size={32} weight='fill' color='#808080'/>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

export default Details;