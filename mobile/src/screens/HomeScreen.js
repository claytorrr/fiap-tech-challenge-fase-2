import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPosts, searchPosts } from '../api';

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);

  const fetchAllPosts = useCallback(async () => {
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
    // Recarrega posts sempre que a tela recebe foco (ex: ao voltar do admin)
    const unsubscribe = navigation.addListener('focus', () => {
      if (search.trim() === '') {
        fetchAllPosts();
      }
    });
    return unsubscribe;
  }, [navigation, fetchAllPosts, search]);

  // Busca conectada ao endpoint /posts/search — TOTALMENTE FUNCIONAL
  const handleSearch = async (text) => {
    setSearch(text);
    if (text.trim() === '') {
      fetchAllPosts();
      return;
    }
    setSearching(true);
    try {
      const results = await searchPosts(text.trim());
      setPosts(results);
    } catch {
      Alert.alert('Erro', 'Não foi possível realizar a busca.');
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearch('');
    fetchAllPosts();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setSearch('');
    await fetchAllPosts();
    setRefreshing(false);
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PostDetail', { id: item._id })}
      activeOpacity={0.75}
    >
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.titulo}
      </Text>
      <Text style={styles.cardAuthor}>Por {item.autor}</Text>
      <Text style={styles.cardExcerpt} numberOfLines={3}>
        {item.conteudo}
      </Text>
      <Text style={styles.cardDate}>
        {new Date(item.criadoEm).toLocaleDateString('pt-BR')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Campo de busca — conectado ao endpoint /posts/search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#64748B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar posts por palavras-chave..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={handleSearch}
          returnKeyType="search"
          autoCorrect={false}
        />
        {search.length > 0 && !searching && (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color="#94A3B8" />
          </TouchableOpacity>
        )}
        {searching && (
          <ActivityIndicator size="small" color="#2563EB" style={{ marginLeft: 8 }} />
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderPost}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2563EB']}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="document-text-outline" size={56} color="#CBD5E1" />
              <Text style={styles.emptyText}>
                {search
                  ? `Nenhum resultado para "${search}".`
                  : 'Nenhum post disponível.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#1E293B',
  },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B', marginBottom: 6 },
  cardAuthor: { fontSize: 13, color: '#2563EB', fontWeight: '600', marginBottom: 8 },
  cardExcerpt: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  cardDate: { fontSize: 12, color: '#94A3B8', marginTop: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: '#94A3B8', marginTop: 14, textAlign: 'center', paddingHorizontal: 24 },
});
