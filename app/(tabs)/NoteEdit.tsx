import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createNote, updateNote, getNote, Note } from '../../firestoreUtils';
import { useRouter, useLocalSearchParams } from 'expo-router';

/**
 * NoteEdit screen for creating or editing a note.
 */
export default function NoteEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const noteId = params.id as string | undefined;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (noteId) {
      getNote(noteId)
        .then(note => {
          setTitle(note.title);
          setContent(note.content);
        })
        .catch(() => Alert.alert('Error', 'Failed to load note.'));
    }
  }, [noteId]);

  const handleSave = async () => {
    setError('');
    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }
    setLoading(true);
    try {
      if (noteId) {
        await updateNote(noteId, { title, content });
      } else {
        await createNote(title, content);
      }
      router.replace('/Home');
    } catch {
      setError('Failed to save note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{noteId ? 'Edit Note' : 'Create Note'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={6}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Saving...' : 'Save'} onPress={handleSave} disabled={loading} />
      <Button title="Cancel" onPress={() => router.back()} color="#888" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  textArea: { height: 120, textAlignVertical: 'top' },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
});