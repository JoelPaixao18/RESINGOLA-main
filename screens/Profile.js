import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Modal, Animated } from "react-native";
import styles from "../styles/Profile";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnim] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          console.error("ID do usuário não encontrado no AsyncStorage");
          return;
        }

        // Busca dados do usuário
        const userResponse = await fetch(`http://192.168.20.50/RESINGOLA-main/Backend/perfil.php?id=${userId}`);
        const userText = await userResponse.text();
        const userData = JSON.parse(userText);

        if (userData.status === "success") {
          setUser(userData.user);
        } else {
          console.error("Erro ao buscar dados do usuário:", userData.message);
        }

        // Busca imóveis do usuário
        const propertiesResponse = await fetch(`http://192.168.20.50/RESINGOLA-main/Backend/user_properties.php?user_id=${userId}`);
        const propertiesText = await propertiesResponse.text();
        const propertiesData = JSON.parse(propertiesText);

        if (propertiesData.status === "success") {
          setUserProperties(propertiesData.properties);
        } else {
          console.error("Erro ao buscar imóveis do usuário:", propertiesData.message);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (nome) => {
    if (!nome) return "";
    const partes = nome.trim().split(" ");
    const primeira = partes[0]?.[0] || "";
    const ultima = partes[partes.length - 1]?.[0] || "";
    return (primeira + ultima).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
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

  const showAboutApp = () => {
    alert(
      "🏡 REZINGOLA - O Futuro do Mercado Imobiliário na Palma da Sua Mão 🏡\n\n" +
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

  const handleEditarProfile = async () => {
    closeModal();
    navigation.navigate('EditarProfile', { user });
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      const response = await fetch(`http://192.168.20.50/RESINGOLA-main/Backend/deletar.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: propertyId })
      });
  
      const result = await response.json();
  
      if (result.status === 'success') {
        // Atualiza a lista removendo o imóvel deletado
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

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhum imóvel cadastrado</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.initialsCircle}>
          <Text style={styles.initialsText}>{getInitials(user?.nome)}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user?.nome || "Carregando..."}</Text>
          <Text style={styles.email}>{user?.email || ""}</Text>
          <Text style={styles.tel}>{user?.tel || ""}</Text>
        </View>

        <TouchableOpacity onPress={openModal}>
          <View style={styles.menuIconContainer}>
            <Icon name="menu" size={30} color="#fff" style={styles.menuIcon} />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalContent, { opacity: modalAnim }]}
          >
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuText}>Terminar Sessão</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleEditarProfile}>
              <Text style={styles.menuText}>Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={showAboutApp}>
              <Text style={styles.menuText}>Sobre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Carregando...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          data={userProperties}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <>
              <Text style={styles.sectionTitle}>Meus Imóveis</Text>
            </>
          }
          ListEmptyComponent={renderEmptyList}
          renderItem={({ item }) => (
            <View style={styles.listingCard}>
              <View style={styles.fakeImage} />
              <View style={styles.listingInfo}>
                <Text style={styles.listingTitle}>{item.titulo || "Sem título"}</Text>
                <Text style={styles.listingLocation}>{item.localizacao || "Localização não informada"}</Text>
                <Text style={styles.listingType}>{item.tipo || "Tipo não informado"}</Text>
                <Text style={styles.listingPrice}>{item.preco ? `Kz ${item.preco}` : "Preço não informado"}</Text>
                
                <View style={styles.actionsContainer}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditProperty(item)}
                  >
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteProperty(item.id)}
                  >
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}