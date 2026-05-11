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
import { getUsers, deleteUser } from '../../api';

export default function TeacherListScreen({ navigation }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchTeachers = useCallback(async (pageNum = 1, append = false) => {
    try {
      const data = await getUsers({ role: 'teacher', page: pageNum, limit: 10 });
      setTeachers((prev) => (append ? [...prev, ...data.users] : data.users));
      setTotalPages(data.totalPages);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os professores.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPage(1);
      fetchTeachers(1, false);
    });
    return unsubscribe;
  }, [navigation, fetchTeachers]);

  const loadMore = () => {
    if (page < totalPages && !loadingMore) {
      const next = page + 1;
      setPage(next);
      setLoadingMore(true);
      fetchTeachers(next, true);
    }
  };

  const handleDelete = (id, nome) => {
    Alert.alert('Excluir Professor', `Deseja excluir "${nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(id);
            setTeachers((prev) => prev.filter((t) => t._id !== id));
          } catch (err) {
            Alert.alert('Erro', err?.response?.data?.error || 'Não foi possível excluir.');
          }
        },
      },
    ]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchTeachers(1, false);
  };

  const renderTeacher = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.nome.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.nome}</Text>
        <Text style={styles.cardEmail}>{item.email}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => navigation.navigate('EditTeacher', { teacher: item })}
        >
          <Ionicons name="pencil-outline" size={18} color="#2563EB" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item._id, item.nome)}
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
        onPress={() => navigation.navigate('CreateTeacher')}
      >
        <Ionicons name="add" size={22} color="#FFF" />
        <Text style={styles.newButtonText}>Novo Professor</Text>
      </TouchableOpacity>

      <FlatList
        data={teachers}
        keyExtractor={(item) => item._id}
        renderItem={renderTeacher}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator color="#2563EB" style={{ padding: 16 }} /> : null
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="school-outline" size={56} color="#CBD5E1" />
            <Text style={styles.emptyText}>Nenhum professor cadastrado.</Text>
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
    padding: 14,
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#2563EB' },
  cardContent: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  cardEmail: { fontSize: 13, color: '#64748B', marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 9, borderRadius: 8 },
  editBtn: { backgroundColor: '#EFF6FF' },
  deleteBtn: { backgroundColor: '#FEF2F2' },
  emptyText: { fontSize: 15, color: '#94A3B8', marginTop: 14 },
});
