import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/Login"; // assuming you have a styles file for styling

function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Directly navigate to the 'Tabs' screen without checking or handling any credentials
    navigation.reset({
      index: 0,
      routes: [{ name: '_layout' }],
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View>
        <Text style={styles.title}>RESINGOLA</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>

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
          onChangeText={(value) => setPassword(value)}
          containerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Login;
