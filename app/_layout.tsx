import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/**
 * App-wide layout configuration with navigation stack and theme
 */
export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: 'Task List' }}
        />
        <Stack.Screen
          name="add"
          options={{ title: 'Add Task' }}
        />
        <Stack.Screen
          name="[id]"
          options={{ title: 'Task Details' }}
        />
        <Stack.Screen
          name="+not-found"
          options={{ title: 'Not Found' }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
