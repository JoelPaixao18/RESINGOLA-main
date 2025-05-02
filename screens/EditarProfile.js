import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const EditProfile = ({ route }) => {
  const { user, onProfileUpdated } = route.params;
  const navigation = useNavigation();
  
  // Garante valores padrão seguros para todos os campos
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    tel: user?.tel?.toString() || '' // Converte para string caso seja número
  });
  
  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    tel: ''
  });
  
  const [touched, setTouched] = useState({
    nome: false,
    email: false,
    tel: false
  });
  
  const [loading, setLoading] = useState(false);

  // Validação específica para telefones angolanos (9 dígitos começando com 9)
  const validarTelefoneAngola = (tel) => {
    const numeroLimpo = tel?.replace(/\D/g, '') || '';
    return /^9\d{8}$/.test(numeroLimpo);
  };

  const validateForm = () => {
    const newErrors = { nome: '', email: '', tel: '' };
    let valid = true;

    // Validação do nome
    if (!formData.nome || !formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      valid = false;
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
      valid = false;
    }

    // Validação do email
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      valid = false;
    }

    // Validação do telefone (segura contra null/undefined)
    if (!formData.tel || !formData.tel.trim()) {
      newErrors.tel = 'Telefone é obrigatório';
      valid = false;
    } else if (!validarTelefoneAngola(formData.tel)) {
      newErrors.tel = 'Digite 9 dígitos começando com 9 (Ex: 923456789)';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleUpdateProfile = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, corrija os campos destacados');
      return;
    }

    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('ID do usuário não encontrado');
      }

      // Remove todos os caracteres não numéricos antes de enviar
      const telLimpo = formData.tel.replace(/\D/g, '');

      const response = await fetch('http://192.168.66.25/RESINGOLA-main/Backend/editar_perfil.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          nome: formData.nome.trim(),
          email: formData.email.trim(),
          tel: telLimpo
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso', [
          { 
            text: 'OK', 
            onPress: () => {
              onProfileUpdated?.();
              navigation.goBack();
            }
          }
        ]);
      } else {
        throw new Error(result.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Perfil</Text>
        
        {/* Campo Nome */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <View style={[
            styles.inputWrapper,
            touched.nome && errors.nome && styles.inputError
          ]}>
            <TextInput
              style={styles.input}
              value={formData.nome}
              onChangeText={(text) => setFormData({...formData, nome: text})}
              onBlur={() => setTouched({...touched, nome: true})}
              placeholder="Digite seu nome"
              autoCapitalize="words"
            />
            {touched.nome && errors.nome && (
              <Icon name="alert-circle" size={20} color="#FF3B30" style={styles.errorIcon} />
            )}
          </View>
          {touched.nome && errors.nome && (
            <Text style={styles.errorText}>{errors.nome}</Text>
          )}
        </View>

        {/* Campo Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={[
            styles.inputWrapper,
            touched.email && errors.email && styles.inputError
          ]}>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              onBlur={() => setTouched({...touched, email: true})}
              placeholder="exemplo@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <Icon name="alert-circle" size={20} color="#FF3B30" style={styles.errorIcon} />
            )}
          </View>
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
        </View>

        {/* Campo Telefone - Atualizado com tratamento seguro */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone (Angola)</Text>
          <View style={[
            styles.inputWrapper,
            touched.tel && errors.tel && styles.inputError
          ]}>
            <TextInput
              style={styles.input}
              value={formData.tel}
              onChangeText={(text) => {
                // Remove caracteres não numéricos e limita a 9 dígitos
                const cleanedText = text.replace(/\D/g, '').slice(0, 9);
                setFormData({...formData, tel: cleanedText});
              }}
              onBlur={() => setTouched({...touched, tel: true})}
              placeholder="923456789"
              keyboardType="phone-pad"
              maxLength={9}
            />
            {touched.tel && errors.tel && (
              <Icon name="alert-circle" size={20} color="#FF3B30" style={styles.errorIcon} />
            )}
          </View>
          {touched.tel && errors.tel && (
            <Text style={styles.errorText}>{errors.tel}</Text>
          )}
        </View>

        <TouchableOpacity 
          style={[
            styles.button,
            loading && styles.buttonDisabled
          ]} 
          onPress={handleUpdateProfile}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#007AFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorIcon: {
    marginLeft: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A7C7FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;