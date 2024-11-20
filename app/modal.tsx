import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

import React from 'react';
import { Text, View } from 'react-native';

export default function Modal() {
  return (
    <>
      {/*
      <ScreenContent path="app/modal.tsx" title="Modal" />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      */}
      <View>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Create a custom app just for you!</Text>
        <Text>Configure your own API and have a fully customized app.</Text>
        {/* ... other screen elements */}
      </View>
    </>
  );
}
