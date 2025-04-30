import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Modal, Animated } from "react-native";
import styles from "../styles/Profile";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons"; // Importando a biblioteca de ícones

const listings = [
  {
    id: "1",
    image: "https://via.placeholder.com/300x200",
    title: "Apartamento T2 - Lisboa",
    location: "Lisboa, Portugal",
    type: "Venda",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/300x200",
    title: "Quarto para arrendar",
    location: "Porto, Portugal",
    type: "Arrendamento",
  },
  {
    id: "3",
    image: "https://via.placeholder.com/300x200",
    title: "Moradia com jardim",
    location: "Coimbra, Portugal",
    type: "Venda",
  },
];

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnim] = useState(new Animated.Value(0)); // Para animação de entrada do modal
  const navigation = useNavigation();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          console.error("ID do usuário não encontrado no AsyncStorage");
          return;
        }

        const response = await fetch(`http:////172.16.40.20/RESINGOLA-main/Backend/perfil.php?id=${userId}`);
        const text = await response.text();
        const data = JSON.parse(text);

        if (data.status === "success") {
          setUser(data.user);
        } else {
          console.error("Erro ao buscar dados do usuário:", data.message);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
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
      await AsyncStorage.removeItem("userId"); // Remove o ID salvo
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], // Substitua "Login" pelo nome real da sua tela de login
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

        {/* Ícone para abrir o modal de menu - removendo o contorno azul */}
        <TouchableOpacity onPress={openModal}>
          <View style={styles.menuIconContainer}>
            <Icon name="menu" size={30} color="#fff" style={styles.menuIcon} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal com o menu */}
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
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
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

      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={listings}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Text style={styles.sectionTitle}>Meus Imóveis</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.listingCard}>
            <View style={styles.fakeImage} />
            <View style={styles.listingInfo}>
              <Text style={styles.listingTitle}>{item.title}</Text>
              <Text style={styles.listingLocation}>{item.location}</Text>
              <Text style={styles.listingType}>{item.type}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
