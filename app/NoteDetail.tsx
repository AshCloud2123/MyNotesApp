import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { getNote, Note } from '../firestoreUtils';
import { useRouter, useLocalSearchParams } from 'expo-router';

/**
 * NoteDetail screen for viewing a single note's details.
 */
export default function NoteDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const noteId = typeof params.id === 'string' ? params.id : null;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!noteId) {
      setError('Invalid note ID');
      setLoading(false);
      return;
    }

    getNote(noteId)
      .then((fetchedNote) => {
        if (!fetchedNote) {
          setError('Note not found');
        } else {
          setNote(fetchedNote);
        }
      })
      .catch((err) => {
        console.error('Failed to load note:', err);
        setError('Failed to load note');
        Alert.alert('Error', 'Failed to load note. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [noteId]);

  const handleEditPress = () => {
    if (!note?.id) return;
    router.push({
      pathname: '/NoteEdit',
      params: { id: note.id }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4f8cff" />
      </View>
    );
  }

  if (error || !note) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error || 'Note not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.date}>
            {note.createdAt.toDate().toLocaleString()}
          </Text>
          <Text style={styles.content}>{note.content}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Text style={styles.editButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f4f6fb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 0,
  },
  container: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    marginBottom: 36,
    width: '100%',
    elevation: 4,
    shadowColor: '#4f8cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#4f8cff',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 13,
    color: '#8fa1b3',
    marginBottom: 22,
    textAlign: 'center',
  },
  content: {
    fontSize: 17,
    marginBottom: 8,
    lineHeight: 26,
    color: '#222',
    textAlign: 'left',
    backgroundColor: '#f7faff',
    borderRadius: 10,
    padding: 14,
    minHeight: 80,
  },
  error: {
    color: 'red',
    marginBottom: 18,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    width: '100%',
  },
  editButton: {
    backgroundColor: '#4f8cff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: 'center',
    marginRight: 8,
    elevation: 2,
    shadowColor: '#4f8cff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
    shadowColor: '#4f8cff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  backButtonText: {
    color: '#4f8cff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});