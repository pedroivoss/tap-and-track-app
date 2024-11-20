import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from "axios";
//import { ScreenContent } from '~/components/ScreenContent';

//import AsyncStorage from '@react-native-async-storage/async-storage';

import { MMKV, useMMKV, useMMKVString } from 'react-native-mmkv'

const storage = new MMKV({ id:'myapp'})

export default function Home() {

  const [refreshing, setRefreshing] = useState(false);

  const [isLoading, setIsLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(false)

  const [email, setEmail] = useState(null)
  const [code, setCode] = useState(null)
  const [urlApi, setUrlApi] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  const [currentClientName, setCurrentClientName] = useState(null)
  const [currentName, setCurrentName] = useState(null)
  const [currentEmail, setCurrentEmail] = useState(null)
  const [currentUrlApi, setCurrentUrlApi] = useState(null)

  const [valStorageData, alStorageData] = useState(null)

  const dataStorage = useMMKV({ id: 'myapp' })
  const [settingsDataApp, setSettingsDataApp] = useMMKVString('dataApp', dataStorage)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
        chckStorage()
        setRefreshing(false);
    }, 1000);
  }, []);

  const chckStorage = () => {
    //console.log(JSON.parse(storage.getString('dataApp'))
    if(null == settingsDataApp || undefined == settingsDataApp){
      setIsLogin(false)
      setCurrentClientName(null)
      setCurrentName(null)
      setCurrentEmail(null)
      setCurrentUrlApi(null)
    }else{
      const valDataStorage = JSON.parse(storage.getString('dataApp'))
      setIsLogin(true)
      setCurrentClientName(valDataStorage.dataApp.clientName)
      setAccessToken(valDataStorage.dataApp.token)
      setCurrentName(valDataStorage.dataApp.user.name)
      setCurrentEmail(valDataStorage.dataApp.user.email)
      setCurrentUrlApi(valDataStorage.urlApi)
    }
  }//fim chckStorage

  useEffect(() => {
    chckStorage()
  },[])

  function testAndSaveSettingsHandle(){
    //send request to server to authenticate
    let password = code

    if (null == urlApi || null == urlApi || '' == urlApi ||
       '' == code || false == code || false == code ||
      '' == email || false == email || false == email ) {
      Alert.alert('Empty details')
      return
    }

    axios.post(`${urlApi}/loginApi`, {
      email, password
    }).then(res => {

      const resData = res.data

      //console.log(resData)

      if (true == resData.success) {
        //set the data
        const dataApp = resData.data

        storage.set('dataApp', JSON.stringify({
          dataApp,
          urlApi
        }))
        const valDataStorage = storage.getString('dataApp')

        setSettingsDataApp(valDataStorage)

        chckStorage()

        setIsLogin(true)

        Alert.alert(resData.message)

      } else {
        Alert.alert(resData.message)
      }
    }).catch(error => {
      console.log(error)
    })

  }//fim testAndSaveSettingsHandle

const clearSettingsHandle = () => {
    //setAuthdata(null)

    Alert.alert('Do you really want to logout?', '', [
        {
            text: 'Cancel',
            onPress: () => Alert.alert('Canceled'),
            style: 'cancel',
        },
        {
            text: 'Yes, I Do',
            onPress: () => logoutFunction()
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            'This alert was dismissed by tapping outside of the alert dialog.',
          ),
      });
}

  function logoutFunction(){

    if(null == settingsDataApp || undefined == settingsDataApp){
      console.log('no data')
    }else{
      console.log(settingsDataApp)
      console.log(accessToken)

      const authDataToken = accessToken

      axios.post(`${urlApi}/logoutApi`, {
        authDataToken
      }).then(res => {

        const resData = res.data


        if (true == resData.success) {
          storage.clearAll()
          setIsLogin(false);
        }

        Alert.alert(resData.message)
      }).catch(error => {
        console.log(error)
      })
      //storage.clearAll()
      //setIsLogin(false);
    }

  }//fim clearSettingsHandle

  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <SafeAreaView  style={styles.container}>
        <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          <View style={styles.contentPadding}></View>
        {(true == isLogin) &&
          <View style={styles.content}>
            <Text style={styles.title}>Current Settings</Text>

            <Text style={styles.txtCt}>Company: {currentClientName}</Text>
            <Text style={styles.txtCt}>Your Name: {currentName}</Text>
            <Text style={styles.txtCt}>Your Email: {currentEmail}</Text>
            <Text style={styles.txtCt}>API: {currentUrlApi}</Text>
            <View style={styles.hr} />
            <View style={{ paddingBottom: 15}} />

            <TouchableOpacity onPress={clearSettingsHandle} style={styles.buttonDanger}>
              <Text style={styles.buttonText}>Clean Settings</Text>
            </TouchableOpacity>
          </View>
        }
          <View style={styles.contentPadding}></View>
          <View style={styles.content}>
          <Text style={styles.title}>Setup Settings</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#b2bec3"
              value={email}
              onChangeText={setEmail}
              autoFocus={true}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your code"
              placeholderTextColor="#b2bec3"
              value={code}
              onChangeText={setCode}
              autoFocus={true}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter url api"
              placeholderTextColor="#b2bec3"
              value={urlApi}
              onChangeText={setUrlApi}
              autoFocus={true}
            />

            <TouchableOpacity onPress={testAndSaveSettingsHandle} style={styles.button}>
              <Text style={styles.buttonText}>Test & Save</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 24,
    backgroundColor: '#2d3436',
  },
  scrollView: {
    backgroundColor: '#2d3436',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    //overflow: 'hidden',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    }
  },
  contentPadding: {
    paddingBottom: 20,
    backgroundColor: '#2d3436',
  },
  txtCt: {
    paddingBottom: 5,
  },
  authContainer: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    //overflow: 'hidden',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  button: {
    backgroundColor: '#0984e3',
    //backgroundColor: colorButtonLogin,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonDanger: {
    backgroundColor: '#e17055',
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
  input: {
    height: 40,
    borderColor: "#b2bec3",
    color:'#000',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  hr: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginLeft: 5,
    marginRight: 5,
    paddingBottom: 10,
  }
});
