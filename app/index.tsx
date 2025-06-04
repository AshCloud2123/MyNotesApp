import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signIn } from '../authUtils'; 
import { useRouter } from 'expo-router';


export default function LoginScreen() { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to your account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#aaa"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace('/SignUp')}
      >
        <Text style={styles.linkText}>Don't have an account? <Text style={{ color: '#4f8cff', fontWeight: 'bold' }}>Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f4f6fb' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: '#4f8cff' },
  subtitle: { fontSize: 16, color: '#888', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 0, backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, fontSize: 16, elevation: 2 },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
  button: { backgroundColor: '#4f8cff', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 12, elevation: 2 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkButton: { alignItems: 'center', marginTop: 8 },
  linkText: { color: '#888', fontSize: 15 },
});