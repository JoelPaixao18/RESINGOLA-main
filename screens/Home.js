import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, Dimensions, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { MagnifyingGlass, PlusSquare } from 'phosphor-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from '../styles/Home';

const screenWidth = Dimensions.get('window').width;

const Home = () => {
  const [residences, setResidences] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchResidences = async () => {
    try {
      const savedResidencesData = await AsyncStorage.getItem('savedResidences');
      const savedResidences = savedResidencesData ? JSON.parse(savedResidencesData) : [];
      
      const validatedResidences = savedResidences.map(res => ({
        ...res,
        image: res.image || 'https://via.placeholder.com/150'
      }));
      
      setResidences(validatedResidences);
    } catch (error) {
      console.error('Erro ao carregar residências', error);
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
      </View>

      <View style={styles.typeHouseContainer}>
        <Pressable style={styles.typeHouseButton} onPress={() => handleDetails(residences[0] || {})}>
          <Text style={styles.typeHouseText}>Vivenda</Text>
        </Pressable>

        <Pressable style={styles.typeHouseButton}>
          <Text style={styles.typeHouseText}>Apartamento</Text>
        </Pressable>

        <Pressable style={styles.typeHouseButton}>
          <Text style={styles.typeHouseText}>Condomínio</Text>
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
                    source={{ uri: residence.image }}
                    resizeMode="cover"
                    onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
                  />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardInfoTitle}>{residence.typology}</Text>
                    <Text style={styles.cardInfoSubTitle}>{residence.location}</Text>
                  </View>
                </Pressable>
                <View style={styles.cardInfoBuy}>
                  <Text style={styles.cardInfoText}>{residence.price} €</Text>
                  <Pressable onPress={() => handleSaveCard(residence)}>
                    <PlusSquare size={40} color='#00FF38' weight='fill' />
                  </Pressable>
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