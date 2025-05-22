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
        
      </View>
        <View style={welcomeStyles.inner}>
            <Image source={require('../assets/welcome.png')} 
            style={welcomeStyles.image} />
        </View>
        <View className="space-y-4">
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}
                style={{ 
                    backgroundColor: themeColors.verde, 
                    padding: 6, 
                    borderRadius: 8, 
                    marginVertical: 25,
                    width: '80%', 
                    alignSelf: 'center' }}>
                <Text 
                    style={{ color: themeColors.white, fontSize: 18, textAlign: 'center' }}>
                    Sign up
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
                        style={{ color: themeColors.verde, fontSize: 15 }}>
                            Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}
