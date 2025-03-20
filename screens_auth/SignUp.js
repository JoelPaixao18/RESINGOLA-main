import React, { useState } from "react";
import { TouchableOpacity, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/SignUp";

function SignUp() {
  const navigation = useNavigation();
  const [nome_user, setNome_user] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  const handleCadastro = () => {
    // No server request, directly navigate to Login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }], // Redirect to login screen
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Cadastro</Text>

        <Input
          placeholder="Nome"
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={(value) => setNome_user(value)}
          containerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
        />

        <Input
          placeholder="E-mail"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(value) => setEmail(value)}
          keyboardType="email-address"
          containerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
        />

        <Input
          placeholder="Senha"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          secureTextEntry={true}
          onChangeText={(value) => setSenha(value)}
          containerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
        />

        <Input
          placeholder="Confirme a Senha"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          secureTextEntry={true}
          onChangeText={(value) => setConfirmSenha(value)}
          containerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
        />

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default SignUp;
