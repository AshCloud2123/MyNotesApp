import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { getNotes, searchNotes, deleteNote, Note } from '../firestoreUtils'
import { logout } from '../authUtils';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = search ? await searchNotes(search) : await getNotes();
      setNotes(data.filter((note): note is Note => !!note.id));
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      Alert.alert('Error', 'Failed to fetch notes. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(id);
              await fetchNotes();
            } catch (error) {
              console.error('Failed to delete note:', error);
              Alert.alert('Error', 'Failed to delete note. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Note }) => {
    if (!item.id) return null;
    return (
      <TouchableOpacity
        style={styles.note}
        activeOpacity={0.85}
        onPress={() => {
          router.push({
            pathname: '/NoteDetail',
            params: { id: item.id }
          });
        }}
      >
        <View style={styles.noteContent}>
          <Text style={styles.noteTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.noteDate}>
            {item.createdAt.toDate().toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id!)}
        >
          <Text style={styles.deleteButtonText}>🗑</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotes();
  }, [fetchNotes]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📝 My Notes</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="🔍 Search notes..."
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/NoteEdit')}
          >
            <Text style={styles.addButtonText}>＋</Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator style={styles.loading} size="large" color="#4f8cff" />
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(item: Note): string => {
              if (!item.id) {
                return `temp-${Math.random()}`;
              }
              return item.id;
            }}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.empty}>
                {search ? 'No notes found matching your search.' : 'No notes yet. Create one!'}
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6fb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: Platform.OS === 'android' ? 48 : 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4f8cff',
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  logoutButtonText: {
    color: '#4f8cff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  addButton: {
    backgroundColor: '#4f8cff',
    borderRadius: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#4f8cff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -2,
  },
  list: {
    flexGrow: 1,
    marginTop: 12,
    paddingBottom: 24,
  },
  note: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 3,
    shadowColor: '#4f8cff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  noteContent: {
    flex: 1,
    marginRight: 12,
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
    color: '#222',
  },
  noteDate: {
    fontSize: 12,
    color: '#8fa1b3',
    marginBottom: 6,
  },
  deleteButton: {
    backgroundColor: '#ffeaea',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#e74c3c',
  },
  empty: {
    textAlign: 'center',
    color: '#b0b0b0',
    fontSize: 17,
    marginTop: 48,
  },
  loading: {
    marginTop: 70,
  },
});