// Adicionei a chamada à API e o redirecionamento no arquivo Login.js

import React, { useState } from "react";
import { TouchableOpacity, View, Image, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { welcomeStyles } from '../styles/welcomeStyle';
import { themeColors } from '../styles/Theme';
import { TextInput } from "react-native-gesture-handler";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controlar o loading

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('http://192.168.20.50/RESINGOLA-main/Backend/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: senha
        })
      });
  
      if (!response.ok) {
        throw new Error('Erro na conexão com o servidor');
      }
  
      const result = await response.json();
  
      if (result.status === 'success') {
        // 🔐 SALVA O ID DO USUÁRIO PARA USO FUTURO (ex: tela de perfil)
        await AsyncStorage.setItem("userId", result.user.id.toString());
  
        // Redireciona para Home
        navigation.navigate('_TabsLayout', { userData: result.user, screen: 'Home' });
      } else {
        Alert.alert('Erro', result.message || 'Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      if (error.message === 'Network request failed') {
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível Iniciar Sessão. Verifique sua conexão com a internet.'
        );
      } else {
        Alert.alert('Erro', 'Ocorreu um problema durante o login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = async () => {
    // Limpa o AsyncStorage se necessário
    await AsyncStorage.removeItem("userId");
    navigation.navigate('Welcome');
  }
   

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: themeColors.background }}
    >
      {/* Cabeçalho fixo */}
      <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: RFPercentage(5),
          paddingHorizontal: RFPercentage(2),
          paddingBottom: RFPercentage(2),
          backgroundColor: themeColors.background,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        }}>
        <TouchableOpacity 
          onPress={handleGoBack}
          style={{
            backgroundColor: themeColors.white,
            borderRadius: 50,
            padding: RFPercentage(1),
            width: RFPercentage(6),
            height: RFPercentage(6),
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <ArrowLeftIcon 
            size={RFValue(20)} 
            color={themeColors.dark}
          />
        </TouchableOpacity>

        <Text style={{
          fontSize: RFValue(20),
          fontWeight: 'bold',
          marginLeft: RFPercentage(2),
          color: themeColors.dark,
        }}>
          Iniciar Sessão
        </Text>
      </View>

      {/* Conteúdo rolável */}
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, alignItems: 'center', padding: RFPercentage(2) }}>

          {/* Imagem de boas-vindas */}
          <Image 
            source={require('../assets/login.png')}
            style={{
              width: width * 0.35,
              height: width * 0.35,
              borderRadius: (width * 0.35) / 2,
              marginTop: RFPercentage(5),
              borderWidth: 3,
              borderColor: themeColors.secondary,
            }} 
          />

          {/* Formulário */}
          <View 
            style={{
              backgroundColor: themeColors.white,
              borderTopLeftRadius: RFPercentage(4),
              borderTopRightRadius: RFPercentage(4),
              marginTop: RFPercentage(4),
              padding: RFPercentage(3),
              width: '100%',
              flex: 1,
              minHeight: RFPercentage(60),
            }}
          >
            <View style={{ marginBottom: RFPercentage(3) }}>
              
              {/* Campo Email */}
              <Text style={welcomeStyles.label}>E-mail</Text>
              <View style={welcomeStyles.inputContainer}>
                <Icon 
                  name="envelope" 
                  size={RFValue(20)} 
                  color="#666" 
                  style={welcomeStyles.icon} 
                />
                <TextInput
                  placeholder="email@gmail.com"
                  onChangeText={(value) => setEmail(value)}
                  keyboardType="email-address"
                  style={welcomeStyles.inputText}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={{ height: RFPercentage(2) }} />

              {/* Campo Senha */}
              <Text style={welcomeStyles.label}>Senha</Text>
              <View style={welcomeStyles.inputContainer}>
                <Icon 
                  name="key" 
                  size={RFValue(20)} 
                  color="#666" 
                  style={welcomeStyles.icon} 
                />
                <TextInput
                  placeholder="* * * * * * *"
                  onChangeText={(value) => setSenha(value)}
                  keyboardType="default"
                  secureTextEntry={true}
                  style={welcomeStyles.inputText}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Link de esquecer senha */}
              <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: RFPercentage(1.5) }}>
                <Text style={{ color: themeColors.blue, fontSize: RFValue(12) }}>
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>

              {/* Botão Login */}
              <TouchableOpacity 
                onPress={handleLogin}
                disabled={loading}
                style={{ 
                  backgroundColor: loading ? '#ccc' : themeColors.secondary, 
                  paddingVertical: RFPercentage(1.5), 
                  borderRadius: RFPercentage(1),
                  marginTop: RFPercentage(3),
                  width: '100%', 
                  alignSelf: 'center',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={themeColors.dark} />
                ) : (
                  <Text 
                    style={{ 
                      color: themeColors.dark, 
                      fontSize: RFValue(16), 
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    Login
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider "Ou" */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: RFPercentage(3) }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
                <Text style={{ marginHorizontal: 10, color: '#666' }}>Ou</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
              </View>

              {/* Redes sociais */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: RFPercentage(3) }}>
                <TouchableOpacity style={{ marginHorizontal: 10 }}>
                  <Image 
                    source={require('../assets/google.png')}
                    style={{ width: RFPercentage(5), height: RFPercentage(5), borderRadius: RFPercentage(2.5) }}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginHorizontal: 10 }}>
                  <Image 
                    source={require('../assets/facebook.png')}
                    style={{ width: RFPercentage(5), height: RFPercentage(5), borderRadius: RFPercentage(2.5) }}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginHorizontal: 10 }}>
                  <Image 
                    source={require('../assets/apple.png')}
                    style={{ width: RFPercentage(5), height: RFPercentage(5), borderRadius: RFPercentage(2.5) }}
                  />
                </TouchableOpacity>
              </View>

              {/* Link para criar conta */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: RFPercentage(3) }}>
                <Text style={{ color: themeColors.text, fontSize: RFValue(12) }}>
                  Não tem uma conta? 
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={{ color: themeColors.secondary, fontSize: RFValue(12), marginLeft: 5 }}>
                    Criar conta
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}