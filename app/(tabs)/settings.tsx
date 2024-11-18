import { Stack } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
//import { ScreenContent } from '~/components/ScreenContent';

//import AsyncStorage from '@react-native-async-storage/async-storage';

import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({ id:'myapp'})

export default function Home() {

  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState(null)
  const [code, setCode] = useState(null)
  const [urlApi, setUrlApi] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  const validateEmail = (email) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      return false;
    } else {
      return true;
    }
  }

  function testAndSaveSettingsHandler(){
    //realiza o fech e tras o AccessToken
    //variavel AccessToken com valores temporarios
    const accessToken = 'tokasdfnaosdfh32890fuqw84fsadf'
    storage.set('dataApp', JSON.stringify({email, code, urlApi, accessToken}))

    console.log('****************')

    const dataStorage = JSON.parse(storage.getString('dataApp'))

    setEmail(dataStorage.email)
    setCode(dataStorage.code)
    setUrlApi(dataStorage.urlApi)

    console.log(dataStorage)

    //storeData(valUrlApi)

    /*
      setIsLoading(true)

      setDisabledButtonLogin(true)asdfasdf
      setTxtButtonLogin('Loading...')
      setColorButtonLogin('#3498db')

      if (null == email || null == password || '' == email || '' == password || false == email || false == password) {
        setMessageError('Empty details')
        setIsLoading(false)
        setDisabledButtonLogin(false)
        setTxtButtonLogin('Login')
        setColorButtonLogin('#5352ed')
        return
      }

      setMessageError(null)

      //send request to server to authenticate
      await axios.post(`${base_url}/loginApi`, {
        email, password
      }).then(res => {

        const resData = res.data

        //console.log(resData)

        if (true == res.data.success) {
          //set the data
          setAuthdata(resData.data)
          //navigate to profile with data
          //navigation.navigate("Profile");
        } else {
          setIsLoading(false)
          setAuthdata(resData.success)
          setMessageError(resData.message)
          setDisabledButtonLogin(false)
          setTxtButtonLogin('Login')
          setColorButtonLogin('#5352ed')
        }
      }).catch(error => {
        console.log(error)
      })
    */
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <SafeAreaView  style={styles.container}>
        <View style={styles.contentPadding}></View>
        <View style={styles.content}>
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

          <TouchableOpacity onPress={testAndSaveSettingsHandler} style={styles.button}>
            <Text style={styles.buttonText}>Test & Save</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 24,
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
  input: {
    height: 40,
    borderColor: "#b2bec3",
    color:'#000',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10
  },
});
