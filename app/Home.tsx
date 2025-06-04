import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
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
      router.replace('../index');
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
  if (!item.id) return null; // Guard clause

  return (
    <TouchableOpacity
      style={styles.note}
      onPress={() => {
        router.push({
          pathname: '/(tabs)/NoteDetail',
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
      <Button
        title="Delete"
        color="red"
        onPress={() => handleDelete(item.id!)} // item.id is guaranteed to be string here
      />
    </TouchableOpacity>
  );
};

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotes();
  }, [fetchNotes]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <Button title="Logout" onPress={handleLogout} color="#888" />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Search notes..."
        value={search}
        onChangeText={setSearch}
        clearButtonMode="while-editing"
      />

      <Button
        title="Create New Note"
        onPress={() => router.push('/(tabs)/NoteEdit')}
      />

      {loading && !refreshing ? (
        <ActivityIndicator style={styles.loading} size="large" />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  list: {
    flexGrow: 1,
    marginTop: 16,
  },
  note: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noteContent: {
    flex: 1,
    marginRight: 16,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 32,
  },
  loading: {
    marginTop: 32,
  },
});