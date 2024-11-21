import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

import React, { useState } from 'react';

export default function Modal() {

  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    // Logic to save the configuration, like storing in AsyncStorage
    console.log('API URL:', apiUrl);
    console.log('API Key:', apiKey);
  };

  return (
    <>
      {/*
      <ScreenContent path="app/modal.tsx" title="Modal" />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      */}
      <ScrollView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Customize Your API</Text>
        <Text>
          Take control of your data by configuring your own API. Our app offers unparalleled flexibility, allowing you to integrate with any API of your choice.
        </Text>
        <Text style={{ marginTop: 20 }}>
          Simply provide your API endpoint and credentials in the app settings. Once configured, the app will seamlessly save your data to your preferred location.
        </Text>
        <Text style={{ fontSize: 18, marginTop: 20 }}>Why use a custom API?</Text>
        <Text style={{ marginLeft: 20 }}>
          Data sovereignty: Keep your data where you want it.</Text>
        <Text style={{ marginLeft: 20 }}>
          Customization: Tailor the app to your specific needs.</Text>
         <Text style={{ marginLeft: 20 }}>
          Integration: Connect with existing systems and services.</Text>
        <Text style={{ fontSize: 18, marginTop: 20 }}>Getting Started</Text>

        <Text style={{ marginLeft: 20 }}>1. Navigate to the app settings.</Text>
        <Text style={{ marginLeft: 20 }}>2. Find the API configuration section.</Text>
        <Text style={{ marginLeft: 20 }}>3. Enter your API endpoint and authentication details.</Text>
        <Text style={{ marginLeft: 20 }}>4. Save the changes.</Text>
      </View>
    </ScrollView>
    </>
  );
}
