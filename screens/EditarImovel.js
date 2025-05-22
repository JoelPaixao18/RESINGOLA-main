import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EditarImovel = ({ route, navigation }) => {
  const { property } = route.params;
  
  const [formData, setFormData] = useState({
    tipo: property.tipo,
    preco: property.preco.replace('R$ ', '').replace('.', ''),
    localizacao: property.localizacao,
    area: property.area.toString(),
  });

  const formatarPreco = (valor) => {
    // Remove todos os caracteres não numéricos
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Formata como moeda brasileira
    return parseFloat(apenasNumeros).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleUpdate = async () => {
    try {
      // Validação básica
      if (!formData.tipo || !formData.preco || !formData.localizacao || !formData.area) {
        Alert.alert('Atenção', 'Por favor, preencha todos os campos');
        return;
      }

      const response = await fetch('http://192.168.20.217/RESINGOLA-main/Backend/editar_imovel.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: property.id,
          tipo: formData.tipo,
          preco: formData.preco,
          localizacao: formData.localizacao,
          area: formData.area
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        Alert.alert('Sucesso', 'Imóvel atualizado com sucesso');
        navigation.goBack();
      } else {
        Alert.alert('Erro', result.message || 'Falha ao atualizar imóvel');
      }
    } catch (error) {
      console.error('Erro ao atualizar imóvel:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Imóvel</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tipo de Imóvel</Text>
        <TextInput
          style={styles.input}
          value={formData.tipo}
          onChangeText={(text) => setFormData({...formData, tipo: text})}
          placeholder="Ex: Apartamento, Casa, etc."
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Preço (R$)</Text>
        <TextInput
          style={styles.input}
          value={`R$ ${formData.preco}`}
          onChangeText={(text) => {
            const apenasNumeros = text.replace(/\D/g, '');
            setFormData({...formData, preco: apenasNumeros});
          }}
          keyboardType="numeric"
          placeholder="Ex: 500000"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Localização</Text>
        <TextInput
          style={styles.input}
          value={formData.localizacao}
          onChangeText={(text) => setFormData({...formData, localizacao: text})}
          placeholder="Endereço completo"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Área (m²)</Text>
        <TextInput
          style={styles.input}
          value={formData.area}
          onChangeText={(text) => setFormData({...formData, area: text.replace(/[^0-9]/g, '')})}
          keyboardType="numeric"
          placeholder="Ex: 80"
        />
      </View>

      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleUpdate}
      >
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1A7526',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: '500',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#1A7526',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditarImovel;