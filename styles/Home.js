import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: SCREEN_HEIGHT * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SCREEN_WIDTH * 0.04,
  },
  headerLeft: {
    width: SCREEN_WIDTH * 0.13,
  },
  headerRight: {
    width: SCREEN_WIDTH * 0.13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    marginHorizontal: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  input: {
    flex: 1,
    height: SCREEN_HEIGHT * 0.06,
    paddingLeft: SCREEN_WIDTH * 0.025,
    fontSize: SCREEN_WIDTH * 0.04,
  },
  typeHouseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  typeHouseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  typeHouseText: {
    fontSize: 14,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: SCREEN_HEIGHT * 0.025,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_WIDTH * 0.025,
  },
  card: {
    width: SCREEN_WIDTH / 2 - SCREEN_WIDTH * 0.05,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: SCREEN_HEIGHT * 0.025,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardButton: {
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardInfo: {
    padding: SCREEN_WIDTH * 0.025,
  },
  cardInfoTitle: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  cardInfoSubTitle: {
    fontSize: SCREEN_WIDTH * 0.035,
    color: '#666',
  },
  cardInfoBuy: {
    flexDirection: 'column', // <-- muda de 'row' para 'column'
    alignItems: 'flex-start', // alinha à esquerda (opcional)
    padding: SCREEN_WIDTH * 0.025,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
    gap: 8, // adiciona espaço entre preço e botões (pode ajustar)
  },  
  cardInfoText: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
    color: '#333',
  },

  // Adiciona estilos responsivos ao final do arquivo:
input: {
  flex: 1,
  height: SCREEN_HEIGHT * 0.06,
  paddingLeft: SCREEN_WIDTH * 0.025,
  fontSize: SCREEN_WIDTH * 0.04,
},
cardInfoTitle: {
  fontSize: SCREEN_WIDTH * 0.04,
  fontWeight: 'bold',
  marginBottom: 5,
},
cardInfoSubTitle: {
  fontSize: SCREEN_WIDTH * 0.035,
  color: '#666',
},
cardInfoText: {
  fontSize: SCREEN_WIDTH * 0.04,
  fontWeight: 'bold',
  color: '#333',
},

activeFilterButton: {
  backgroundColor: '#007AFF',
  borderColor: '#007AFF',
},
activeFilterText: {
  color: 'white',
  fontWeight: 'bold',
},

});