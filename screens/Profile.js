import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Modal, Animated, ActivityIndicator, Image, Alert, Dimensions } from "react-native";
import styles from "../styles/Profile";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { RefreshControl } from 'react-native';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnim] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  const [imageUrlCache, setImageUrlCache] = useState(new Map());
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const windowWidth = Dimensions.get('window').width;

  // Referência para o FlatList de imagens usando useRef
  const carouselRefs = useRef({});

  const baseImageUrl = "http://192.168.32.25/RESINGOLA-main/Backend/uploads/";

  // Função para processar o caminho da imagem
  const getImageUrl = (imageName) => {
    if (!imageName) return null;

    if (imageUrlCache.has(imageName)) {
      return imageUrlCache.get(imageName);
    }
    
    if (imageName.startsWith('http')) {
      return imageName;
    }
    
    let cleanImageName = imageName.replace(/^\//, '').replace(/^uploads/, '');
    
    if (imageUrlCache.has(`uploads${cleanImageName}`)) {
      return imageUrlCache.get(`uploads${cleanImageName}`);
    }
    
    return `${baseImageUrl}${cleanImageName}`;
  };

  // Função para verificar se uma imagem existe
  const checkImageExists = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Função para tentar diferentes variações da imagem
  const tryAlternativeImagePaths = async (imageName) => {
    const baseImageName = imageName.replace(/^uploads/, '');
    
    const variations = [
      `${baseImageUrl}${baseImageName}`,
      `${baseImageUrl}uploads${baseImageName}`
    ];

    for (let url of variations) {
      if (await checkImageExists(url)) {
        setImageUrlCache(prev => new Map(prev.set(imageName, url)));
        return url;
      }
    }

    return null;
  };

  // Função para lidar com erro no carregamento de imagens
  const handleImageError = async (imageUrl, imageName) => {
    if (failedImages.has(imageUrl)) {
      return;
    }

    const alternativeUrl = await tryAlternativeImagePaths(imageName);
    if (alternativeUrl) {
      setFailedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageUrl);
        return newSet;
      });
    } else {
      setFailedImages(prev => new Set([...prev, imageUrl]));
    }
  };

  // Função para buscar notificações
  const fetchNotifications = async (userId) => {
    try {
      setLoadingNotifications(true);
      const response = await fetch(
        `http://192.168.32.25/RESINGOLA-main/Backend/get_notifications.php?user_id=${userId}`
      );
      const data = await response.json();

      if (data.status === 'success') {
        setNotifications(data.notifications || []);
        const unread = data.notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      } else {
        console.error('Erro ao buscar notificações:', data.message);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Função para marcar notificação como lida
  const markNotificationAsRead = async (notificationId) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('ID do usuário não encontrado');
      }
      const response = await fetch(
        'http://192.168.32.25/RESINGOLA-main/Backend/mark_notification_read.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            notification_id: notificationId,
            user_id: userId
          })
        }
      );

      const result = await response.json();
      if (result.status === 'success') {
        setNotifications(prev => {
          const updated = prev.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
          );
          setUnreadCount(updated.filter(n => !n.read).length);
          return updated;
        });
      } else {
        Alert.alert('Erro', result.message);
      }
    } catch (error) {
      console.error('Erro ao marcar notificação:', error);
      Alert.alert('Erro', 'Não foi possível marcar a notificação como lida');
    }
  };

  // Função para atualizar os dados
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setFailedImages(new Set());
    
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Erro', 'Por favor, faça login novamente.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }

      // Atualiza os imóveis
      const propertiesResponse = await fetch(
        `http://192.168.32.25/RESINGOLA-main/Backend/user_properties.php?user_id=${userId}`
      );
      const propertiesData = await propertiesResponse.json();
      
      if (propertiesData.status === 'success') {
        setUserProperties(propertiesData.properties);
      }

      // Atualiza as notificações
      await fetchNotifications(userId);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setRefreshing(false);
    }
  }, [navigation]);

  // Função para buscar os dados do usuário
  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('Não foi encontrado ID do usuário no AsyncStorage');
        Alert.alert('Erro', 'Por favor, faça login novamente.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }

      // Busca os dados do usuário
      const userResponse = await fetch(`http://192.168.32.25/RESINGOLA-main/Backend/perfil.php?id=${userId}`);
      const userData = await userResponse.json();

      if (userData.status === 'success') {
        setUser(userData.user);
      } else {
        console.error('Erro ao buscar dados do usuário:', userData.message);
      }

      // Busca os imóveis do usuário
      const propertiesResponse = await fetch(`http://192.168.32.25/RESINGOLA-main/Backend/user_properties.php?user_id=${userId}`);
      const propertiesData = await propertiesResponse.json();

      if (propertiesData.status === 'success') {
        setUserProperties(propertiesData.properties);
      } else {
        console.error('Erro ao buscar imóveis do usuário:', propertiesData.message);
      }

      // Busca notificações
      await fetchNotifications(userId);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Atualiza os dados quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const getInitials = (nome) => {
    if (!nome) return "";
    const partes = nome.trim().split(" ");
    const primeira = partes[0]?.[0] || "";
    const ultima = partes[partes.length - 1]?.[0] || "";
    return (primeira + ultima).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user_id');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout.');
    }
  };

  const handleUpload = () => {
    navigation.navigate('Upload');
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const showAbout = () => {
    Alert.alert(
      "🏡 REZINGOLA - O Futuro do Mercado Imobiliário na Palma da Sua Mão 🏡",
      "✨ Revolucionando a maneira como você encontra, anuncia e negocia imóveis!\n\n" +
      "🔍 O QUE É O RESINGOLA?\n" +
      "A plataforma definitiva que conecta proprietários, imobiliárias e interessados " +
      "através de geolocalização inteligente, criando pontes digitais entre sonhos e endereços.\n\n" +
      "🌐 COMO TRANSFORMAMOS O MERCADO:\n" +
      "• Mapa interativo com imóveis que surgem como estrelas no seu caminho\n" +
      "• Filtros inteligentes para encontrar exatamente o que você precisa\n" +
      "• Conexão direta entre oferta e demanda, sem intermediários desnecessários\n" +
      "• Visualização geográfica que elimina deslocamentos sem propósito\n\n" +
      "🚀 BENEFÍCIOS EXCLUSIVOS:\n" +
      "Para Proprietários:\n" +
      "- Anuncie com precisão cirúrgica para seu público-alvo\n" +
      "- Controle total sobre suas listagens\n" +
      "\nPara Compradores/Inquilinos:\n" +
      "- Busca por localização exata, preço e características\n" +
      "- Economia de tempo e recursos com visualização prévia\n" +
      "- Transparência total em todas as negociações\n\n" +
      "💡 NOSSO DIFERENCIAL:\n" +
      "Não somos apenas um app - somos a evolução natural do mercado imobiliário, " +
      "trazendo agilidade, tecnologia e humanização para cada transação.\n\n" +
      "📲 Baixe, explore e descubra como encontrar seu próximo lar " +
      "nunca foi tão intuitivo e emocionante!"
    );
  };

  const handleEditarProfile = () => {
    closeModal();
    navigation.navigate('EditarProfile', { 
      user,
      onProfileUpdated: () => {
        fetchUserData();
      }
    });
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      const response = await fetch(`http://192.168.32.25/RESINGOLA-main/Backend/deletar.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: propertyId })
      });

      const result = await response.json();

      if (result.status === 'success') {
        setUserProperties(prev => prev.filter(prop => prop.id !== propertyId));
        Alert.alert('Sucesso', 'Imóvel removido com sucesso');
      } else {
        Alert.alert('Erro', result.message || 'Falha ao remover imóvel');
      }
    } catch (error) {
      console.error('Erro ao deletar imóvel:', error);
      Alert.alert('Erro', 'Não foi possível remover o imóvel');
    }
  };

  const handleEditProperty = (property) => {
    navigation.navigate('EditarImovel', { 
      property,
      onPropertyUpdated: () => {
        fetchUserData();
      }
    });
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="home-outline" size={50} color="#ccc" />
      <Text style={styles.emptyText}>Nenhum imóvel cadastrado</Text>
    </View>
  );

  const renderEmptyNotifications = () => (
    <View style={styles.emptyContainer}>
      <Icon name="notifications-outline" size={50} color="#ccc" />
      <Text style={styles.emptyText}>Nenhuma notificação</Text>
    </View>
  );

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => !item.read && markNotificationAsRead(item.id)}
    >
      <View style={styles.notificationIconContainer}>
        <Icon 
          name={item.read ? "notifications-outline" : "notifications"} 
          size={24} 
          color={item.read ? "#555" : "#1A7526"} 
        />
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.notificationContent}>
        <Text style={[
          styles.notificationText,
          !item.read && styles.unreadNotificationText
        ]}>
          {item.message}
        </Text>
        <Text style={styles.notificationDate}>{item.created_at}</Text>
      </View>
    </TouchableOpacity>
  );

  const nextImage = (propertyId, currentIndex, totalImages) => {
    if (currentIndex < totalImages - 1) {
      carouselRefs.current[propertyId]?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    }
  };

  const previousImage = (propertyId, currentIndex) => {
    if (currentIndex > 0) {
      carouselRefs.current[propertyId]?.scrollToIndex({
        index: currentIndex - 1,
        animated: true
      });
    }
  };

  const handleScroll = (propertyId, event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(contentOffset / windowWidth);
    
    setActiveImageIndex(prev => ({
      ...prev,
      [propertyId]: newIndex
    }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header com informações do usuário */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{getInitials(user?.nome)}</Text>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user?.nome || "Carregando..."}</Text>
            
            {user?.email && (
              <View style={styles.contactInfo}>
                <Icon name="mail-outline" size={16} color="#fff" />
                <Text style={styles.contactText} numberOfLines={1} ellipsizeMode="tail">
                  {user.email}
                </Text>
              </View>
            )}
            
            {user?.tel && (
              <View style={styles.contactInfo}>
                <Icon name="call-outline" size={16} color="#fff" />
                <Text style={styles.contactText}>
                  {user.tel}
                </Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={openModal} style={styles.menuButton}>
          <Icon name="ellipsis-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Modal de opções */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={closeModal}
        >
          <Animated.View
            style={[styles.modalContent, { 
              opacity: modalAnim,
              transform: [{
                translateY: modalAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }]}
          >
            <TouchableOpacity style={styles.menuItem} onPress={handleEditarProfile}>
              <Icon name="create-outline" size={20} color="#555" />
              <Text style={styles.menuText}>Editar Perfil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                closeModal();
                navigation.navigate('Notifications', { 
                  notifications, 
                  onMarkAsRead: markNotificationAsRead 
                });
              }}
            >
              <Icon name="notifications-outline" size={20} color="#555" />
              <Text style={styles.menuText}>
                Notificações {unreadCount > 0 ? `(${unreadCount})` : ''}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={showAbout}>
              <Icon name="information-circle-outline" size={20} color="#555" />
              <Text style={styles.menuText}>Sobre o App</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
              <Icon name="log-out-outline" size={20} color="#e74c3c" />
              <Text style={[styles.menuText, styles.logoutText]}>Terminar Sessão</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Conteúdo principal */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meus Imóveis</Text>
            <TouchableOpacity onPress={handleUpload} style={styles.addButton}>
              <Icon name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            contentContainerStyle={styles.propertyList}
            data={userProperties}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#1A7526']}
                tintColor="#1A7526"
              />
            }
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.propertyCard}>
                {/* Carrossel de imagens */}
                {item.imagens && item.imagens.length > 0 ? (
                  <View style={styles.imageCarousel}>
                    <FlatList
                      ref={ref => carouselRefs.current[item.id] = ref}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      snapToInterval={windowWidth}
                      decelerationRate="fast"
                      bounces={false}
                      data={item.imagens}
                      keyExtractor={(imgName, index) => index.toString()}
                      onScroll={(e) => handleScroll(item.id, e)}
                      scrollEventThrottle={16}
                      getItemLayout={(data, index) => ({
                        length: windowWidth,
                        offset: windowWidth * index,
                        index,
                      })}
                      renderItem={({ item: imgName, index }) => {
                        const imageUrl = getImageUrl(imgName);
                        const hasImageFailed = failedImages.has(imageUrl);
                        
                        return (
                          <View style={[styles.carouselImageContainer, { width: windowWidth }]}>
                            <Image
                              source={hasImageFailed ? 
                                require('../assets/logo_resi.png') : 
                                { 
                                  uri: imageUrl,
                                  headers: {
                                    'Cache-Control': 'no-cache'
                                  }
                                }
                              }
                              style={styles.carouselImage}
                              resizeMode="cover"
                              onError={() => handleImageError(imageUrl, imgName)}
                            />
                            
                            {item.imagens.length > 1 && (
                              <>
                                {index > 0 && (
                                  <TouchableOpacity
                                    style={[styles.carouselButton, styles.carouselButtonLeft]}
                                    onPress={() => previousImage(item.id, activeImageIndex[item.id] || 0)}
                                    activeOpacity={0.7}
                                  >
                                    <Icon name="chevron-back" size={28} color="#fff" />
                                  </TouchableOpacity>
                                )}
                                
                                {index < item.imagens.length - 1 && (
                                  <TouchableOpacity
                                    style={[styles.carouselButton, styles.carouselButtonRight]}
                                    onPress={() => nextImage(item.id, activeImageIndex[item.id] || 0, item.imagens.length)}
                                    activeOpacity={0.7}
                                  >
                                    <Icon name="chevron-forward" size={28} color="#fff" />
                                  </TouchableOpacity>
                                )}
                                
                                <View style={styles.imageCounter}>
                                  <Text style={styles.imageCounterText}>
                                    {`${(activeImageIndex[item.id] || 0) + 1}/${item.imagens.length}`}
                                  </Text>
                                </View>
                              </>
                            )}
                          </View>
                        );
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.propertyImagesPlaceholder}>
                    <Icon name="home" size={40} color="#3498db" />
                    <Text style={{ marginTop: 10, color: '#666' }}>Sem imagens disponíveis</Text>
                  </View>
                )}

                <View style={styles.propertyDetails}>
                  <View style={styles.propertyHeader}>
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                      {item.tipo || "Tipo não informado"}
                    </Text>
                    <Text style={styles.propertyPrice}>{item.preco}</Text>
                  </View>
                  
                  <View style={styles.propertyMetaContainer}>
                    {item.area && (
                      <View style={styles.propertyMetaItem}>
                        <Icon name="resize-outline" size={16} color="#555" />
                        <Text style={styles.propertyMetaText}>{item.area} m²</Text>
                      </View>
                    )}
                    
                    {item.quartos && (
                      <View style={styles.propertyMetaItem}>
                        <Icon name="bed-outline" size={16} color="#555" />
                        <Text style={styles.propertyMetaText}>{item.quartos}</Text>
                      </View>
                    )}
                    
                    {item.banheiros && (
                      <View style={styles.propertyMetaItem}>
                        <Icon name="water-outline" size={16} color="#555" />
                        <Text style={styles.propertyMetaText}>{item.banheiros}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.propertyLocation}>
                    <Icon name="location-outline" size={16} color="#555" />
                    <Text style={styles.propertyLocationText} numberOfLines={1}>
                      {item.localizacao || "Local não informado"}
                    </Text>
                  </View>
                  
                  <View style={styles.propertyDescription}>
                    <Text style={styles.propertyDescriptionText} numberOfLines={5}>
                      {item.descricao || "Nenhuma descrição fornecida"}
                    </Text>
                  </View>
                  
                  <View style={styles.propertyActions}>
                    <TouchableOpacity 
                      style={[styles.propertyActionButton, styles.editButton]}
                      onPress={() => handleEditProperty(item)}
                    >
                      <Icon name="create-outline" size={16} color="#fff" />
                      <Text style={styles.propertyActionText}>Editar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.propertyActionButton, styles.deleteButton]}
                      onPress={() => handleDeleteProperty(item.id)}
                    >
                      <Icon name="trash-outline" size={16} color="#fff" />
                      <Text style={styles.propertyActionText}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}