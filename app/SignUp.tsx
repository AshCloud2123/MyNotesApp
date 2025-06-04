import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signUp } from '../authUtils';
import { useRouter } from 'expo-router';
import { useTheme } from './ThemeContext';


export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { theme, colors, toggleTheme } = useTheme();

  const handleSignUp = async () => {
    setError('');
    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password);
      router.replace('/'); // Navigate to login screen after successful sign up
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        setError('Email already in use.');
      } else if (e.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (e.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to sign up.');
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: colors.primary },
    subtitle: { fontSize: 16, color: colors.subtitle, marginBottom: 24, textAlign: 'center' },
    input: { borderWidth: 0, backgroundColor: colors.input, color: colors.text, borderRadius: 14, padding: 16, marginBottom: 14, fontSize: 16, elevation: 2 },
    error: { color: colors.error, marginBottom: 12, textAlign: 'center' },
    button: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 12, elevation: 2 },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: colors.buttonText, fontSize: 18, fontWeight: 'bold' },
    linkButton: { alignItems: 'center', marginTop: 8 },
    linkText: { color: colors.subtitle, fontSize: 15 },
    toggleButton: { alignItems: 'center', marginBottom: 18 },
    toggleButtonText: { color: colors.link, fontSize: 15, fontWeight: 'bold' },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={toggleTheme}
      >
      </TouchableOpacity>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={colors.subtitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={colors.subtitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor={colors.subtitle}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color={colors.buttonText} /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.linkText}>Already have an account? <Text style={{ color: colors.link, fontWeight: 'bold' }}>Login</Text></Text>
      </TouchableOpacity>
    </View>
  );
}