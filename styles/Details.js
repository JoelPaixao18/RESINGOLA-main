import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.4,
  },
  headerImage: {
    width: SCREEN_WIDTH * 0.88,
    height: SCREEN_HEIGHT * 0.27,
    position: 'absolute',
    marginHorizontal: SCREEN_WIDTH * 0.1,
    top: SCREEN_HEIGHT * 0.14,
    borderRadius: SCREEN_WIDTH * 0.03,
  },
  headerInfoButtons: {
    marginTop: SCREEN_HEIGHT * 0.06,
    paddingHorizontal: SCREEN_WIDTH * 0.08,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfoButtonsText: {
    fontSize: SCREEN_WIDTH * 0.04,
  },
  headerInfoButtonsRight: {
    flexDirection: 'row',
    gap: SCREEN_WIDTH * 0.025,
  },
  infoNameText: {
    fontSize: SCREEN_WIDTH * 0.07,
    fontWeight: '600',
    paddingHorizontal: SCREEN_WIDTH * 0.1,
    paddingTop: SCREEN_HEIGHT * 0.025,
  },
  contentAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.025,
    paddingHorizontal: SCREEN_WIDTH * 0.08,
    paddingTop: SCREEN_HEIGHT * 0.02,
  },
  contentAddressText: {
    fontSize: SCREEN_WIDTH * 0.03,
  },
  contentAddressPrice: {
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '400',
    marginHorizontal: SCREEN_WIDTH * 0.3,
  },
  separator: {
    height: 1,
    marginHorizontal: SCREEN_WIDTH * 0.08,
    marginTop: SCREEN_HEIGHT * 0.02,
    backgroundColor: '#dddddd',
  },
  descriptionView: {
    paddingTop: SCREEN_HEIGHT * 0.025,
    paddingHorizontal: SCREEN_WIDTH * 0.1,
    paddingBottom: SCREEN_HEIGHT * 0.025,
  },
  description: {
    paddingBottom: SCREEN_HEIGHT * 0.01,
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: '600',
  },
  descriptionText: {
    fontWeight: '400',
    fontSize: SCREEN_WIDTH * 0.035,
  },
  sellerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_WIDTH * 0.1,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  sellerInfoTextName: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '600',
  },
  sellerInfoTextSeller: {
    fontSize: SCREEN_WIDTH * 0.03,
  },
  sellerInfoRight: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.06,
    backgroundColor: 'white',
    borderRadius: SCREEN_WIDTH * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#1A7526',
    padding: SCREEN_HEIGHT * 0.018,
    borderRadius: SCREEN_WIDTH * 0.04,
    alignItems: 'center',
    margin: SCREEN_WIDTH * 0.065,
  },
  buttonText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
  },
});

export default styles;