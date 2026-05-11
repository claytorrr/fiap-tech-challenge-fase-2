import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPosts, deletePost } from '../api';

export default function AdminPostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchPosts);
    return unsubscribe;
  }, [navigation, fetchPosts]);

  const handleDelete = (id, titulo) => {
    Alert.alert('Excluir Post', `Deseja excluir "${titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(id);
            setPosts((prev) => prev.filter((p) => p._id !== id));
          } catch (err) {
            Alert.alert('Erro', err?.response?.data?.error || 'Não foi possível excluir o post.');
          }
        },
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const renderPost = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
        <Text style={styles.cardAuthor}>Por {item.autor}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => navigation.navigate('EditPost', { post: item })}
        >
          <Ionicons name="pencil-outline" size={18} color="#2563EB" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item._id, item.titulo)}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.newButton}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Ionicons name="add" size={22} color="#FFF" />
        <Text style={styles.newButtonText}>Novo Post</Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="document-outline" size={56} color="#CBD5E1" />
            <Text style={styles.emptyText}>Nenhum post cadastrado.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    margin: 16,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  newButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardContent: { flex: 1, marginRight: 12 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  cardAuthor: { fontSize: 13, color: '#64748B' },
  cardActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 9, borderRadius: 8 },
  editBtn: { backgroundColor: '#EFF6FF' },
  deleteBtn: { backgroundColor: '#FEF2F2' },
  emptyText: { fontSize: 15, color: '#94A3B8', marginTop: 14 },
});
