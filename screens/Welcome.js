import { View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { themeColors } from '../styles/Theme';
import { welcomeStyles } from '../styles/welcomeStyle';

export default function Welcome() {
    const navigation = useNavigation();
  return (
    <View style={[welcomeStyles.container, { backgroundColor: themeColors.white }]}>
      <View style={welcomeStyles.inner}>
        <Text style={welcomeStyles.title}>Vamos Começar!</Text>
      </View>
        <View style={welcomeStyles.inner}>
            <Image source={require('../assets/welcome.jpeg')} 
            style={welcomeStyles.image} />
        </View>
        <View className="space-y-4">
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}
                style={{ 
                    backgroundColor: themeColors.secondary, 
                    padding: 6, 
                    borderRadius: 8, 
                    marginVertical: 25,
                    width: '80%', 
                    alignSelf: 'center' }}>
                <Text 
                    style={{ color: themeColors.dark, fontSize: 18, textAlign: 'center' }}>
                    Signup
                </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text 
                    style={{ color: themeColors.text, fontSize: 15, marginVertical: 20, }}>
                        Já tem uma conta? 
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}
                    style={{ marginLeft: 1,marginVertical: 20 }}>
                    <Text 
                        style={{ color: themeColors.secondary, fontSize: 15 }}>
                            Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}
