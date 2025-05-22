import { Bookmark, CaretLeft, MapPin, PhoneCall, Drop, Lightning, House, Ruler, Car, Stairs, Tree, Images } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Text, View, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/Details';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function Details() {
  const navigation = useNavigation();
  const route = useRoute();
  const { residence } = route.params;
  const [owner, setOwner] = useState(null);
  const [loadingOwner, setLoadingOwner] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Verifica se images é um array ou uma string e normaliza para array
  const images = Array.isArray(residence.images) 
    ? residence.images 
    : residence.images 
      ? [residence.images] 
      : residence.image 
        ? [residence.image] 
        : [];

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await fetch(`${API_URL}/get_user.php?user_id=${residence.user_id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setOwner({
            nome: data.user.nome,
            tel: data.user.tel
          });
        }
      } catch (error) {
        console.error('Error fetching owner data:', error);
      } finally {
        setLoadingOwner(false);
      }
    };

    if (residence?.user_id) {
      fetchOwnerData();
    } else {
      setLoadingOwner(false);
    }
  }, [residence?.user_id]);

  const handlePhoneCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

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

  const formatLocation = (locationString) => {
    if (!locationString) return 'Local não especificado';
    
    try {
      if (typeof locationString === 'string' && locationString.startsWith('{')) {
        const location = JSON.parse(locationString);
        return location.address || locationString;
      }
      
      return locationString
        .replace('Província ', '')
        .replace('Município ', '')
        .replace('Distrito ', '');
    } catch (e) {
      return locationString;
    }
  };

  const renderFeature = (icon, label, value) => (
    <View style={styles.featureItem}>
      {icon}
      <Text style={styles.featureText}>{label}: <Text style={styles.featureValue}>{value}</Text></Text>
    </View>
  );

  const renderImageItem = ({ item }) => (
    <Image 
      source={{ uri: item }} 
      style={styles.carouselImage}
      resizeMode="cover"
    />
  );

  const renderImageIndicator = () => {
    if (images.length <= 1) return null;
    
    return (
      <View style={styles.imageIndicatorContainer}>
        <View style={styles.imageIndicator}>
          <Images size={16} color="#fff" />
          <Text style={styles.imageIndicatorText}>
            {activeIndex + 1}/{images.length}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {images.length > 0 ? (
          <FlatList
            data={images}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveIndex(index);
            }}
          />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <House size={50} color="#ccc" />
          </View>
        )}
        
        {renderImageIndicator()}
        
        <View style={styles.headerInfoButtons}>
          <TouchableOpacity onPress={handleGoBack}>
            <CaretLeft size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerInfoButtonsText}>Detalhes</Text>
          <TouchableOpacity onPress={() => handleSaveCard(residence)}>
            <Bookmark size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.infoNameText}>{residence.typology || residence.typeResi}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{residence.price}</Text>
        </View>

        <View style={styles.contentAddress}>
          <MapPin size={20} color='#1A7526' weight='fill' />
          <Text style={styles.contentAddressText}>{formatLocation(residence.location)}</Text>
        </View>

        <View style={styles.separator} />

        {/* Seção de Características Principais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureColumn}>
              {renderFeature(<House size={20} color="#1A7526" />, 'Tipo', residence.typeResi)}
              {renderFeature(<Ruler size={20} color="#1A7526" />, 'Área', residence.houseSize)}
              {renderFeature(<Stairs size={20} color="#1A7526" />, 'Andares', residence.andares || '1')}
            </View>
            <View style={styles.featureColumn}>
              {renderFeature(<House size={20} color="#1A7526" />, 'Quartos', residence.bedroomCount || 'N/A')}
              {renderFeature(<Drop size={20} color="#1A7526" />, 'Banheiros', residence.bathroomCount)}
              {renderFeature(<Car size={20} color="#1A7526" />, 'Garagens', residence.garagem || '0')}
            </View>
          </View>
        </View>

        {/* Seção de Comodidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comodidades</Text>
          <View style={styles.amenitiesContainer}>
            {residence.hasWater && renderFeature(<Drop size={20} color="#1A7526" />, 'Água', 'Disponível')}
            {residence.hasElectricity && renderFeature(<Lightning size={20} color="#1A7526" />, 'Energia', 'Disponível')}
            {residence.quintal && renderFeature(<Tree size={20} color="#1A7526" />, 'Quintal', 'Sim')}
            {residence.varanda && renderFeature(<House size={20} color="#1A7526" />, 'Varanda', 'Sim')}
          </View>
        </View>

        {/* Seção de Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>
            {residence.description || 'Nenhuma descrição fornecida.'}
          </Text>
        </View>

        {/* Seção do Proprietário */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          {loadingOwner ? (
            <ActivityIndicator size="small" color="#1A7526" />
          ) : owner ? (
            <View style={styles.ownerContainer}>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>{owner.nome}</Text>
                <Text style={styles.ownerLabel}>Proprietário</Text>
              </View>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handlePhoneCall(owner.tel)}
              >
                <PhoneCall size={20} color="#fff" />
                <Text style={styles.contactButtonText}>Contactar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.noOwnerText}>Informações do proprietário não disponíveis</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default Details;