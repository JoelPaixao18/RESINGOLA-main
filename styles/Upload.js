import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    // Somente para iOS - sombra sutil
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
    marginTop: 9, // Ajuste para centralizar o título
  },
  headerRight: {
    width: 24, // Mesma largura do botão de voltar para manter o balanceamento
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10, // Reduzido para compensar o cabeçalho
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
  imageUploadContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A7526',
    borderRadius: 10,
    borderStyle: 'dashed',
    marginBottom: 15,
  },
  uploadButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
  uploadSubText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  imageNumberText: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 12,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#1A7526',
    borderRadius: 5,
    marginTop: 10,
  },
  addMoreButtonText: {
    color: '#1A7526',
    marginLeft: 5,
    fontSize: 14,
  },
  photoOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  photoOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#1A7526',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  photoOptionButtonText: {
    color: '#1A7526',
    marginLeft: 5,
    fontSize: 14,
  },
  takePhotoButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  takePhotoButtonText: {
    color: '#1A7526',
    textDecorationLine: 'underline',
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
    color: '#000',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 0,
    fontSize: 14,
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
    padding: 12,
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
    fontSize: 14,
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
suggestionsContainer: {
  maxHeight: 150,
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 5,
  marginTop: 5,
},
suggestionItem: {
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
loadingContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  backgroundColor: '#f9f9f9',
  borderRadius: 5,
  marginTop: 5,
},
loadingText: {
  marginLeft: 10,
  color: '#666',
  fontSize: 12,
},
});