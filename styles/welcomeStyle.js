import { StyleSheet, Dimensions } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get('window');

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-around',
    marginVertical: RFPercentage(2),
    marginTop: RFPercentage(-15),
  },
  title: {
    color: '#0A1F44',
    fontWeight: 'bold',
    fontSize: RFValue(24),
    textAlign: 'center',
  },
  image: {
    width: width * 0.9, // 60% da largura
    height: width * 0.8,
    borderRadius: width * 0.3, // metade da largura
    alignSelf: 'center',
    marginTop: -height * 0.15,
  },
  label: {
    marginBottom: RFPercentage(0.5),
    fontSize: RFValue(14),
    color: '#333',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  inputText: {
    flex: 1,
    fontSize: RFValue(12),
    color: '#333',
  },
});