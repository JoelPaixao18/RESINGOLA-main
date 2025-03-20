import { Bookmark, CaretLeft, MapPin } from 'phosphor-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Importando o hook useNavigation
import styles from '../styles/Details';

function Details() {
  const navigation = useNavigation(); // Inicializando a navegação

  // Função que será chamada ao clicar no ícone "CaretLeft"
  const handleGoBack = () => {
    navigation.goBack();  // Volta para a tela anterior
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.headerImage} source={require("../assets/Image_1.png")} />

        <View style={styles.headerInfoButtons}>
          {/* Botão que chama a função handleGoBack ao ser pressionado */}
          <CaretLeft size={32} onPress={handleGoBack} /> 

          <Text style={styles.headerInfoButtonsText}>Detalhes</Text>

          <View style={styles.headerInfoButtonsRight}>
            <Bookmark size={32} />
          </View>
        </View>

      </View>

      <Text style={styles.infoNameText}>Zango 3</Text>

      <View style={styles.contentAddress}>
        <MapPin size={36} color='#00FF38'/>
        <Text style={styles.contentAddressText}>Luanda, Zango 3, Rua da Dira</Text>
      </View>

      <View style={styles.separator} />

    </View>
  );
}

export default Details;
