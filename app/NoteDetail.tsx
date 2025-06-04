import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { getNote, Note } from '../firestoreUtils';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from './ThemeContext';

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
  const { theme, colors, toggleTheme } = useTheme();

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

  const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: colors.background,
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
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 28,
      marginBottom: 36,
      width: '100%',
      elevation: 4,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 10,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      color: colors.primary,
      letterSpacing: 0.5,
    },
    date: {
      fontSize: 13,
      color: colors.subtitle,
      marginBottom: 22,
      textAlign: 'center',
    },
    content: {
      fontSize: 17,
      marginBottom: 8,
      lineHeight: 26,
      color: colors.text,
      textAlign: 'left',
      backgroundColor: theme === 'dark' ? '#23262f' : '#f7faff',
      borderRadius: 10,
      padding: 14,
      minHeight: 80,
    },
    error: {
      color: colors.error,
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
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 36,
      alignItems: 'center',
      marginRight: 8,
      elevation: 2,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.10,
      shadowRadius: 4,
    },
    editButtonText: {
      color: colors.buttonText,
      fontSize: 17,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    backButton: {
      backgroundColor: colors.card,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 36,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.input,
      elevation: 1,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
    },
    backButtonText: {
      color: colors.primary,
      fontSize: 17,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    toggleButton: { alignItems: 'center', marginBottom: 18 },
    toggleButtonText: { color: colors.link, fontSize: 15, fontWeight: 'bold' },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
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
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleTheme}
        >
        </TouchableOpacity>
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