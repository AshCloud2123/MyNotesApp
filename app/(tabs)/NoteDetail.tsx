import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getNote, Note } from '../../firestoreUtils';
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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !note) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error || 'Note not found'}</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.date}>
        {note.createdAt.toDate().toLocaleString()}
      </Text>
      <Text style={styles.content}>{note.content}</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Edit" 
          onPress={handleEditPress}
        />
        <View style={styles.buttonSpacer} />
        <Button 
          title="Back" 
          onPress={() => router.back()} 
          color="#888" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonSpacer: {
    width: 16,
  },
});