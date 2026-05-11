import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getPostById } from '../api';

export default function PostDetailScreen({ route }) {
  const { id } = route.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostById(id)
      .then(setPost)
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar o post.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Post não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{post.titulo}</Text>
      <View style={styles.meta}>
        <Text style={styles.author}>Por {post.autor}</Text>
        <Text style={styles.date}>
          {new Date(post.criadoEm).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.body}>{post.conteudo}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, paddingBottom: 48 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 14,
    lineHeight: 34,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  author: { fontSize: 14, color: '#2563EB', fontWeight: '700' },
  date: { fontSize: 13, color: '#94A3B8' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 22 },
  body: { fontSize: 16, color: '#334155', lineHeight: 28 },
  errorText: { fontSize: 16, color: '#EF4444' },
});
