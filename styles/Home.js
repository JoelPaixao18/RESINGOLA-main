import { StyleSheet, Dimensions } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: RFPercentage(2),
    paddingTop: RFPercentage(5),
    paddingBottom: RFPercentage(2),
    backgroundColor: '#fff',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    marginTop: 15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: RFPercentage(2),
  },
  
  // Estilo da barra de pesquisa
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: RFValue(12),
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(4),
    marginHorizontal: RFPercentage(1),
    marginBottom: RFPercentage(2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    marginLeft: RFValue(10),
    fontSize: RFValue(14),
    color: '#333',
  },
  
  // Container dos tipos de casa
  typeHouseContainer: {
    flexDirection: 'row',
    paddingHorizontal: RFPercentage(2),
    marginBottom: RFPercentage(2),
  },
  typeHouseButton: {
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(8),
    borderRadius: RFValue(20),
    backgroundColor: '#fff',
    marginRight: RFValue(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  activeFilterButton: {
    backgroundColor: '#1A7526',
  },
  typeHouseText: {
    fontSize: RFValue(14),
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  
  // Grid de cards
  gridContainer: {
    paddingHorizontal: RFPercentage(2),
  },
  
  // Card individual
  card: {
    backgroundColor: '#fff',
    borderRadius: RFValue(15),
    marginBottom: RFPercentage(2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  cardButton: {
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: RFValue(200),
    borderTopLeftRadius: RFValue(15),
    borderTopRightRadius: RFValue(15),
  },
  
  // Informações do card
  cardInfo: {
    padding: RFPercentage(2),
  },
  cardInfoTitle: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: RFValue(4),
  },
  cardInfoSubTitle: {
    fontSize: RFValue(14),
    color: '#666',
    marginBottom: RFValue(8),
  },
  
  // Seção de detalhes do imóvel
  propertyDetailsContainer: {
    marginTop: RFValue(8),
    paddingTop: RFValue(8),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  propertyTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RFValue(8),
  },
  propertyTypeText: {
    fontSize: RFValue(14),
    color: '#1A7526',
    fontWeight: '600',
    marginRight: RFValue(8),
  },
  propertyFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: RFValue(8),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(4),
    borderRadius: RFValue(6),
    marginRight: RFValue(8),
    marginBottom: RFValue(8),
  },
  featureText: {
    fontSize: RFValue(12),
    color: '#666',
    marginLeft: RFValue(4),
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: RFValue(8),
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: RFValue(12),
    marginBottom: RFValue(4),
  },
  amenityText: {
    fontSize: RFValue(12),
    color: '#666',
    marginLeft: RFValue(4),
  },
  descriptionContainer: {
    marginTop: RFValue(8),
    paddingTop: RFValue(8),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  descriptionText: {
    fontSize: RFValue(12),
    color: '#666',
    lineHeight: RFValue(18),
  },
  
  // Seção de preço e status
  cardInfoBuy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: RFPercentage(2),
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  priceContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: RFValue(14),
    color: '#1A7526',
    fontWeight: '600',
    marginBottom: RFValue(4),
  },
  cardInfoText: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#333',
  },
  
  // Botões de ação
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: RFValue(15),
  },
  
  // Avatar do usuário
  userAvatar: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    backgroundColor: '#1A7526',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInitials: {
    color: '#fff',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
});

export default styles;