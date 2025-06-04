import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signIn } from '../authUtils'; 
import { useRouter } from 'expo-router';
import { useTheme } from './ThemeContext';

export default function LoginScreen() { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { theme, colors, toggleTheme } = useTheme();

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/Home'); 
    } catch (e: any) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        setError('Invalid credentials.');
      } else if (e.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Failed to login.');
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
        <Text style={styles.toggleButtonText}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </Text>
      </TouchableOpacity>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to your account</Text>
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
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color={colors.buttonText} /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace('/SignUp')}
      >
        <Text style={styles.linkText}>Don't have an account? <Text style={{ color: colors.link, fontWeight: 'bold' }}>Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
  );
}