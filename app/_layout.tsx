import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Login', headerShown: false }} />
      <Stack.Screen name="SignUp" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="Home" options={{ title: 'My Notes', headerLeft: () => null }} />
      <Stack.Screen name="NoteDetail" options={{ title: 'Note Detail' }} />
      <Stack.Screen name="NoteEdit" options={{ title: 'Edit Note' }} />
      <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
    </Stack>
  );
}
