import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F0FE', // tom azul claro
  },
  formContainer: {
    width: '90%',
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2C3E50',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputText: {
    fontSize: 16,
    paddingLeft: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  signUpRedirectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signUpText: {
    color: '#555',
    fontSize: 15,
  },
  signUpLink: {
    color: '#4A90E2',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loginRedirectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginText: {
    color: '#555',
    fontSize: 15,
  },
  loginLink: {
    color: '#4A90E2',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default styles;
