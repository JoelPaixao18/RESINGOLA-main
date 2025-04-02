import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    inputContainer: {
        width: "90%",
        height: 56,
        backgroundColor: "white",
        borderStyle: "solid",
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        position: 'absolute',
        top: 60,

    },
    input: {
        flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
    addressContainer: {
      position: 'absolute',  // Certifica que ficará sobre o mapa
      bottom: 10,            // Coloca na parte inferior da tela
      width: '100%',         // Ocupa a largura inteira
      padding: 15,           // Padding para o texto não ficar grudado
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo transparente
      borderRadius: 5,      // Bordas arredondadas
      alignItems: 'center', // Centraliza o texto
    },
    addressText: {
      fontSize: 16,        // Tamanho da fonte
      fontWeight: 'bold',  // Deixa o texto mais visível
    },
    waitMapText:{
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
      justifyContent: 'center',
      marginVertical: 50,
      paddingVertical: 50,
    },
  });

  export default styles;