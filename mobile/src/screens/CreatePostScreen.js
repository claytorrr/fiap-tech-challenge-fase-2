import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createPost } from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function CreatePostScreen({ navigation }) {
  const { user } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [autor, setAutor] = useState(user?.nome || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!titulo.trim() || !conteudo.trim() || !autor.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await createPost({ titulo: titulo.trim(), conteudo: conteudo.trim(), autor: autor.trim() });
      Alert.alert('Sucesso', 'Post publicado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Erro', err?.response?.data?.error || 'Erro ao criar post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          placeholder="Título do post"
          placeholderTextColor="#94A3B8"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Autor *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do autor"
          placeholderTextColor="#94A3B8"
          value={autor}
          onChangeText={setAutor}
        />

        <Text style={styles.label}>Conteúdo *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Escreva o conteúdo do post..."
          placeholderTextColor="#94A3B8"
          value={conteudo}
          onChangeText={setConteudo}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Publicar Post</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  textArea: { height: 200, paddingTop: 14 },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
