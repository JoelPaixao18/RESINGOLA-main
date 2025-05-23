import { StyleSheet, Dimensions } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get('window');

const save = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: RFPercentage(2),
  },
  
  // Estilo do container de pesquisa
  searchContainer: {
    paddingHorizontal: RFPercentage(2),
    marginBottom: RFPercentage(2),
  },
  
  // Estilo para quando a lista está vazia
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: RFPercentage(10),
  },
  emptyText: {
    fontSize: RFValue(16),
    color: '#666',
    textAlign: 'center',
    marginTop: RFPercentage(2),
  },
  emptyIcon: {
    marginBottom: RFPercentage(2),
  },

  // Estilos do card
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: RFValue(15),
    marginHorizontal: RFPercentage(2),
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
  
  // Imagem do card
  cardImage: {
    width: '100%',
    height: RFValue(200),
    borderTopLeftRadius: RFValue(15),
    borderTopRightRadius: RFValue(15),
  },
  
  // Conteúdo do card
  cardContent: {
    padding: RFPercentage(2),
  },
  
  // Cabeçalho do card
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFPercentage(1),
  },
  
  // Status e tipo do imóvel
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RFPercentage(1),
    backgroundColor: '#f5f5f5',
    padding: RFValue(8),
    borderRadius: RFValue(8),
  },
  statusText: {
    fontSize: RFValue(14),
    fontWeight: '600',
    marginRight: RFValue(10),
  },
  typeText: {
    fontSize: RFValue(14),
    color: '#666',
    fontWeight: '500',
  },
  
  // Título do imóvel
  propertyTitle: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  
  // Preço do imóvel
  propertyPrice: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#1A7526',
  },
  
  // Localização
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RFPercentage(1),
  },
  locationText: {
    fontSize: RFValue(14),
    color: '#666',
    marginLeft: RFValue(5),
  },
  
  // Detalhes do imóvel
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: RFPercentage(1),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: RFValue(15),
  },
  detailText: {
    fontSize: RFValue(12),
    color: '#666',
    marginLeft: RFValue(4),
  },
  
  // Botões de ação
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: RFPercentage(1.5),
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: RFPercentage(1.5),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: RFValue(8),
    borderRadius: RFValue(8),
  },
  viewButton: {
    backgroundColor: '#1A7526',
    paddingHorizontal: RFValue(15),
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  buttonText: {
    color: '#fff',
    marginLeft: RFValue(5),
    fontSize: RFValue(14),
    fontWeight: '500',
  },
  deleteButtonText: {
    color: '#FF0000',
    marginLeft: RFValue(5),
    fontSize: RFValue(14),
    fontWeight: '500',
  },
});

export default save;

