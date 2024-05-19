import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from './src/navigator';
import { AppProvider } from './src/appContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <AppNavigator/>
    </AppProvider>
  );
}

