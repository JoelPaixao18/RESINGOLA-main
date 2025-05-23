import { Bookmark, CaretLeft, MapPin, PhoneCall, Drop, Lightning, House, Ruler, Car, Stairs, Tree, Images, Coffee, Armchair, DoorOpen } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Text, View, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/Details';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const normalizeResidenceData = (residence) => {
  // Se residence já tem user_id, não precisa normalizar
  if (residence.user_id) return residence;
  
  // Caso contrário, verifica se tem usuario_id (que vem da Home)
  return {
    ...residence,
    user_id: residence.user_id || null
  };
};

function Details() {
  const navigation = useNavigation();
  const route = useRoute();
  const { residence: rawResidence } = route.params;
  
  // Normaliza os dados do imóvel
  const residence = normalizeResidenceData(rawResidence);
  
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
        // Usa explicitamente user_id, já que foi confirmado como o campo correto
        const ownerId = residence?.user_id;

        if (!ownerId) {
          console.log('user_id não encontrado no objeto residence:', JSON.stringify(residence, null, 2));
          setOwner(null);
          setLoadingOwner(false);
          return;
        }

        console.log(`Buscando dados do proprietário com user_id: ${ownerId}`);
        const response = await fetch(`${API_URL}/get_user.php?user_id=${ownerId}`);
        const data = await response.json();
        
        console.log('Resposta da API get_user.php:', JSON.stringify(data, null, 2));
        
        if (data.status === 'success' && data.user) {
          setOwner({
            nome: data.user.nome || data.user.name || data.user.full_name || 'Proprietário',
            tel: data.user.tel || data.user.telefone || data.user.phone || 'Número não disponível'
          });
        } else {
          console.log('Resposta da API não contém dados válidos do proprietário:', data);
          setOwner(null);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do proprietário:', error.message, error.stack);
        setOwner(null);
      } finally {
        setLoadingOwner(false);
      }
    };

    fetchOwnerData();
  }, [residence]);

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
        {/* Status e Tipo */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{residence.status}</Text>
          <Text style={styles.typeText}>{residence.typeResi}</Text>
        </View>

        <Text style={styles.infoNameText}>{residence.typology}</Text>
        
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
              {renderFeature(<Ruler size={20} color="#1A7526" />, 'Área', `${residence.houseSize} m²`)}
              {renderFeature(<Stairs size={20} color="#1A7526" />, 'Andares', residence.andares || '1')}
            </View>
            <View style={styles.featureColumn}>
              {renderFeature(<Armchair size={20} color="#1A7526" />, 'Salas', residence.livingRoomCount || '0')}
              {renderFeature(<Coffee size={20} color="#1A7526" />, 'Cozinhas', residence.kitchenCount || '0')}
              {renderFeature(<Drop size={20} color="#1A7526" />, 'Banheiros', residence.bathroomCount || '0')}
            </View>
          </View>
        </View>

        {/* Seção de Comodidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comodidades</Text>
          <View style={styles.amenitiesContainer}>
            {residence.hasWater && (
              <View style={styles.amenityItem}>
                <Drop size={20} color="#1A7526" />
                <Text style={styles.amenityText}>Água</Text>
              </View>
            )}
            {residence.hasElectricity && (
              <View style={styles.amenityItem}>
                <Lightning size={20} color="#1A7526" />
                <Text style={styles.amenityText}>Energia</Text>
              </View>
            )}
            {residence.garagem && (
              <View style={styles.amenityItem}>
                <Car size={20} color="#1A7526" />
                <Text style={styles.amenityText}>Garagem</Text>
              </View>
            )}
            {residence.quintal && (
              <View style={styles.amenityItem}>
                <Tree size={20} color="#1A7526" />
                <Text style={styles.amenityText}>Quintal</Text>
              </View>
            )}
            {residence.varanda && (
              <View style={styles.amenityItem}>
                <DoorOpen size={20} color="#1A7526" />
                <Text style={styles.amenityText}>Varanda</Text>
              </View>
            )}
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