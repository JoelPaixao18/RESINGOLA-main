import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  cover: {
    marginTop: 20,
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  coverContent: {
    alignItems: 'center',
  },
  coverText: {
    marginTop: 10,
    color: '#1A7526',
    fontSize: 16,
    fontWeight: '500',
  },
  imagesList: {
    paddingVertical: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOptionText: {
    color: '#1A7526',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 22,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#1A7526',
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 0,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 0,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
  },
  locationButton: {
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  locationButtonText: {
    color: '#1A7526',
    fontWeight: '600',
    fontSize: 15,
  },
  requiredFieldsText: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#1A7526',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  disabledButton: {
    backgroundColor: '#a5d6a7',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
    backgroundColor: '#fff',  // Fundo branco para o container
    padding: 10,             // Padding interno
    borderRadius: 8,         // Bordas arredondadas
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
    paddingHorizontal: 10,   // Espaçamento horizontal
    paddingVertical: 6,      // Espaçamento vertical
    borderRadius: 6,         // Bordas arredondadas
    backgroundColor: '#fff', // Fundo branco
  },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#1A7526',  // Verde para a borda
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',  // Fundo branco
  },
  radioCheckedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1A7526',  // Verde para o círculo selecionado
  },
  radioLabel: {
    fontSize: 15,
    color: '#000',  // Texto preto
    fontWeight: '500',
  },

  // Estilo para opção selecionada (adicione esta classe)
  radioOptionSelected: {
    backgroundColor: '#e8f5e9',  // Verde muito claro para fundo da opção selecionada
  },

  // Adicione ao seu arquivo de estilos
errorInput: {
  borderColor: '#ff4444',
  backgroundColor: '#fff9f9',
},
errorLabel: {
  color: '#ff4444',
},
errorMessage: {
  color: '#ff4444',
  fontSize: 12,
  marginTop: 5,
},
});