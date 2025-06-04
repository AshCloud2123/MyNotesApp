import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { createNote, updateNote, getNote, Note } from '../firestoreUtils';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from './ThemeContext';

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
  const { theme, colors, toggleTheme } = useTheme();

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
      color: colors.primary,
    },
    input: {
      borderWidth: 0,
      backgroundColor: colors.input,
      color: colors.text,
      borderRadius: 14,
      padding: 16,
      marginBottom: 14,
      fontSize: 16,
      elevation: 2,
    },
    textArea: {
      height: 120,
      textAlignVertical: 'top',
    },
    error: {
      color: colors.error,
      marginBottom: 12,
      textAlign: 'center',
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 12,
      elevation: 2,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      color: colors.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: colors.card,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.input,
      elevation: 1,
    },
    cancelButtonText: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    toggleButton: { alignItems: 'center', marginBottom: 18 },
    toggleButtonText: { color: colors.link, fontSize: 15, fontWeight: 'bold' },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleTheme}
        >  
        </TouchableOpacity>
        <Text style={styles.title}>{noteId ? 'Edit Note' : 'Create Note'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={colors.subtitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          placeholderTextColor={colors.subtitle}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.buttonText} />
          ) : (
            <Text style={styles.buttonText}>Save</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}