import { StyleSheet, Dimensions } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.35,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerInfoButtons: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.05,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfoButtonsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  infoNameText: {
    fontSize: 24,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 20,
    color: '#333',
  },
  priceContainer: {
    paddingHorizontal: 20,
    marginTop: 5,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A7526',
  },
  contentAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  contentAddressText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  section: {
    marginTop: RFValue(24),
    paddingHorizontal: RFValue(16),
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontWeight: '600',
    color: '#333',
    marginBottom: RFValue(8),
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RFValue(8),
  },
  featureColumn: {
    flex: 1,
    gap: RFValue(12),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 8,
  },
  featureValue: {
    fontWeight: '600',
    color: '#333',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: RFValue(12),
    marginTop: RFValue(8),
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(8),
    borderRadius: RFValue(8),
    gap: RFValue(8),
  },
  amenityText: {
    fontSize: RFValue(14),
    color: '#333',
  },
  descriptionText: {
    fontSize: RFValue(14),
    color: '#666',
    lineHeight: RFValue(20),
  },
  ownerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ownerLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A7526',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  noOwnerText: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
  },

    carouselImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.35,
  },
  noImagePlaceholder: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.35,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIndicatorContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.05,
    right: 20,
    zIndex: 2,
  },
  imageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  imageIndicatorText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RFValue(16),
    marginBottom: RFValue(8),
  },
  
  statusText: {
    fontSize: RFValue(14),
    color: '#1A7526',
    fontWeight: '600',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(4),
    borderRadius: RFValue(16),
  },
  
  typeText: {
    fontSize: RFValue(14),
    color: '#666',
  },
  booleanFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  booleanFeatureText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
});

export default styles;