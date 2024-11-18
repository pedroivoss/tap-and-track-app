import { Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';


export default function Home() {

  const [storageEmail, setStorageEmail] = useState(null)
  const [storageCode, setStorageCode] = useState(null)
  const [storageUrlApi, setStorageUrlApi] = useState(null)

  var globalTest = null;

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('my-key');
      if (value !== null) {
        setStorageUrlApi(value)
      }
    } catch (e) {
      console.log('value_error')
    }
  };

  function test(){
    getData();
    console.log('esse_tested')
    console.log(storageUrlApi)
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Register' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/index.tsx" title="Configurar o registro do ponto aqui" />

        <TouchableOpacity onPress={test} style={styles.button}>
            <Text style={styles.buttonText}>Test storage</Text>
          </TouchableOpacity>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  button: {
    backgroundColor: '#5352ed',
    //backgroundColor: colorButtonLogin,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
});
