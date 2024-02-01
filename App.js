import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import ChatScreen from './src/screens/Chat';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.header}>
        <Text style={styles.headerText}>UMAT HELP</Text>
      </View>
      <ChatScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
