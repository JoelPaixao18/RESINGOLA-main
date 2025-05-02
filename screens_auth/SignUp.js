import React, { useState } from "react";
import { 
  TouchableOpacity, 
  View, 
  Image, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { welcomeStyles } from '../styles/welcomeStyle';
import { themeColors } from '../styles/Theme';
import { TextInput } from "react-native-gesture-handler";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get('window');

export default function SignUp() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [tel, setTel] = useState('');
  const [BI, setBI] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validação de campos vazios
    if (!nome || !tel || !BI || !email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Validação do nome
    if (!/^[a-zA-ZÀ-ÿ\s]{3,}$/.test(nome)) {
      Alert.alert('Erro', 'Nome inválido. Deve conter pelo menos 3 caracteres e apenas letras');
      return;
    }

    // Validação do email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Erro', 'Formato de email inválido');
      return;
    }

    // Validação do BI
    if (!/^\d{9}[A-Z]{2}\d{3}$/.test(BI)) {
      Alert.alert('Erro', 'Número de BI inválido. Formato esperado: 123456789LA123');
      return;
    }

    // Validação do telefone
    if (!/^9\d{8}$/.test(tel)) {
      Alert.alert('Erro', 'Número de telefone inválido. Deve começar com 9 e ter 9 dígitos');
      return;
    }

    // Validação da senha
    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.17.25/RESINGOLA-main/Backend/cadastrar.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          tel: tel,
          BI: BI,
          email: email,
          senha: senha,
          confirmSenha: senha
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        Alert.alert('Sucesso', result.message, [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Erro', result.message);
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', 'Não foi possível Criar a conta. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: themeColors.background }}
    >
      {/* Cabeçalho */}
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
          onPress={() => navigation.goBack()}
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
          Criar Conta
        </Text>
      </View>

      {/* Conteúdo */}
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, alignItems: 'center', padding: RFPercentage(2) }}>

          <Image 
            source={require('../assets/welcom.png')}
            style={{
              width: width * 0.35,
              height: width * 0.35,
              borderRadius: (width * 0.35) / 2,
              marginTop: RFPercentage(5),
              borderWidth: 3,
              borderColor: themeColors.secondary,
            }} 
          />

          <View 
            style={{
              backgroundColor: themeColors.white,
              borderTopLeftRadius: RFPercentage(4),
              borderTopRightRadius: RFPercentage(4),
              marginTop: RFPercentage(4),
              padding: RFPercentage(3),
              width: '100%',
              flex: 1,
              minHeight: RFPercentage(70),
            }}
          >
            <View style={{ marginBottom: RFPercentage(3) }}>

              {/* Campo Nome */}
              <Text style={welcomeStyles.label}>Nome</Text>
              <View style={welcomeStyles.inputContainer}>
                <Icon 
                  name="user" 
                  size={RFValue(20)} 
                  color="#666" 
                  style={welcomeStyles.icon} 
                />
                <TextInput
                  placeholder="Seu nome completo"
                  onChangeText={(value) => setNome(value)}
                  style={welcomeStyles.inputText}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={{ height: RFPercentage(2) }} />

              {/* Campo Telefone */}
              <Text style={welcomeStyles.label}>Telefone</Text>
              <View style={welcomeStyles.inputContainer}>
                <Icon 
                  name="phone" 
                  size={RFValue(20)} 
                  color="#666" 
                  style={welcomeStyles.icon} 
                />
                <TextInput
                  placeholder="9xxxxxxxx"
                  onChangeText={(value) => {
                    // Remove qualquer caractere não numérico
                    const numericValue = value.replace(/[^0-9]/g, '');
                    // Limita a 9 dígitos
                    if (numericValue.length <= 9) {
                      setTel(numericValue);
                    }
                  }}
                  value={tel}
                  keyboardType="phone-pad"
                  maxLength={9} // Isso mostra o contador e impede fisicamente mais digitação
                  style={welcomeStyles.inputText}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={{ height: RFPercentage(2) }} />

              {/* Campo Nº BI */}
              <Text style={welcomeStyles.label}>Nº do BI</Text>
              <View style={welcomeStyles.inputContainer}>
                <Icon 
                  name="id-card" 
                  size={RFValue(20)} 
                  color="#666" 
                  style={welcomeStyles.icon} 
                />
                <TextInput
                  placeholder="1234567LA123"
                  onChangeText={(value) => {
                    // Remove caracteres inválidos (só permite números e letras)
                    let cleanedValue = value.replace(/[^0-9A-Za-z]/g, '');
                    
                    // Converte letras para maiúsculas
                    cleanedValue = cleanedValue.toUpperCase();
                    
                    // Limita a 14 caracteres
                    if (cleanedValue.length <= 14) {
                      setBI(cleanedValue);
                    }
                  }}
                  value={BI}
                  keyboardType="default"
                  maxLength={14}
                  autoCapitalize="characters"
                  style={welcomeStyles.inputText}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={{ height: RFPercentage(2) }} />

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
                  name="lock" 
                  size={RFValue(20)} 
                  color="#666" 
                  style={welcomeStyles.icon} 
                />
                <TextInput
                  placeholder="* * * * * * *"
                  onChangeText={(value) => setSenha(value)}
                  secureTextEntry={true}
                  style={welcomeStyles.inputText}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Botão Criar Conta */}
              <TouchableOpacity 
                onPress={handleSignUp}
                disabled={loading}
                style={{ 
                  backgroundColor: loading ? '#ccc' : themeColors.secondary, 
                  paddingVertical: RFPercentage(1.5), 
                  borderRadius: RFPercentage(1),
                  marginTop: RFPercentage(4),
                  width: '100%', 
                  alignSelf: 'center',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Text 
                  style={{ 
                    color: themeColors.dark, 
                    fontSize: RFValue(16), 
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {loading ? 'Carregando...' : 'Criar Conta'}
                </Text>
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
                  Já tem uma conta? 
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={{ color: themeColors.secondary, fontSize: RFValue(12), marginLeft: 5 }}>
                    Iniciar Sessão
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