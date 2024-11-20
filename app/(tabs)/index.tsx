import { Stack } from 'expo-router';

import { ScreenContent } from '~/components/ScreenContent';

import { TouchableOpacity, StyleSheet, Text, View, Alert, RefreshControl, ScrollView, InteractionManager, TextInput} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
//import { PageAlertLocationContext } from "../ctx/PageAlertLocationContext";
import axios from "axios";
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
//import * as Location from "expo-location";
import {
    getCurrentPositionAsync,
    LocationAccuracy,
    LocationObject,
    requestForegroundPermissionsAsync,
    watchPositionAsync,
} from "expo-location";

//import AsyncStorage from '@react-native-async-storage/async-storage';

import { useMMKV, useMMKVString } from 'react-native-mmkv';

export default function Home() {

  const [storageNameUser, setStorageNameUser] = useState(null)
  const [storageClientName, setStorageClientName] = useState(null)
  const [storageIdUser, setStorageIdUser] = useState(null)
  const [storageIdClient, setStorageIdClient] = useState(null)
  const [storageUrlApi, setStorageUrlApi] = useState(null)
  const [storageAccessToken, setStorageAccessToken] = useState(null)

  const globalStorage = useMMKV()
  const dataStorage = useMMKV({ id: 'myapp' })

  const [settingsDataApp, setSettingsDataApp] = useMMKVString('dataApp', dataStorage)

  const [valueStore, setValueStore] = useState(null);
  const [statusEnableObs, setStatusEnableObs] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [dataListStore, setDataListStore] = useState([]);
  const [dataListEmployers, setDataListEmployers] = useState([]);
  const [qtdListEmployers, setQtdListEmployers] = useState(0);
  const [valChangeUserEmployer, setValChangeUserEmployer] = useState(null);

  const [refreshing, setRefreshing] = React.useState(false);

  //const [status, requestPermission] = Location.useBackgroundPermissions();

  const [location, setLocation] = useState<LocationObject | null>(null)
  const [erroMsg, setErroMsg] = useState(null)
  const [region, setRegion] = useState();
  const [type, setType] = useState('checkIn');
  const [txtButtonSave, setTxtButtonSave] = useState('Check In');
  const [colorButtonSave, setColorButtonSave] = useState('#2ecc71');
  const [disabledButtonSave, setDisabledButtonSave] = useState(false);

  const [valStoreName, setValStoreName] = useState();
  const [valStoreLatitude, setValStoreLatitude] = useState();
  const [valStoreLongitude, setValStoreLongitude] = useState();
  const [valStoreCode, setValStoreCode] = useState();
  const [valStoreTimestamp, setValStoreTimestamp] = useState();
  const [valStoreObs, setValStoreObs] = useState();
  const [obsDescription, setObsDescription] = useState('');

  const [valLatitude, setValLatitude] = useState('waiting')
  const [valLongitude, setValLongitude] = useState('waiting')

  /**
   * control Company or not
   */
  const [ifAdmin, setIfAdmin] = useState(0);
  const [ifLogin, setIfLogin] = useState(false);
  const [codeCompany, setCodeCompany] = useState(null);

  const renderLabel = () => {
    return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
            Job List
        </Text>
    );
  };

  const getListStoreClient = async () => {

        let _authDataToken = storageAccessToken
        let _authDataIdClient = storageIdClient
        let _authDataIdUser = storageIdUser
      /*console.log('bucetão')
      console.log(storageAccessToken)
      console.log(storageIdClient)
      console.log(storageIdUser)*/
        await axios.post(`${storageUrlApi}/getListStoreClient`,{
            _authDataToken,
            _authDataIdClient,
            _authDataIdUser
          }).then(res=>{

            const resData = res.data

            if(true == res.data.success){
                setDataListStore(resData.data.ListStoreAll)
            }
        }).catch(error =>{
            //console.log(error)
        })
  }

  const getListStoreEmployers = async () => {
        if(1 == ifAdmin){
            let _authDataIdUser = storageIdUser

            await axios.post(`${storageUrlApi}/getListStoreEmployers`,{
                codeCompany,
                _authDataIdUser
              }).then(res=>{

                const resData = res.data

                if(true == res.data.success){
                    setDataListEmployers(resData.data.List)
                    setQtdListEmployers(resData.data.qtdList)
                }
            }).catch(error =>{
                //console.log(error)
            })
        }
  }

  const checkCheckIn = async () => {
        let _authDataToken = storageAccessToken
        let _authDataUserId = storageIdUser

        await axios.post(`${storageUrlApi}/checkCheckIn`,{

            _authDataToken,
            _authDataUserId
          }).then(res=>{

            const resData = res.data

            if(true == res.data.success){
                //set the data
                setTxtButtonSave(resData.data.nameButton)
                setType(resData.data.typeButton)
                setColorButtonSave(resData.data.colorButton)
                setDisabledButtonSave(false)
                setValueStore(null)

                if('checkOut' == resData.data.typeButton){
                    const dataStore = resData.data.storeData

                    setValStoreName(dataStore.storeName)
                    setValStoreLatitude(dataStore.latitude)
                    setValStoreLongitude(dataStore.longitude)
                    setValStoreCode(dataStore.code)
                    setValStoreTimestamp(dataStore.timestamp)
                    setStatusEnableObs(dataStore.enable_obs)
                    setValStoreObs(dataStore.obs)
                }
            }
        }).catch(error =>{
            //console.log(error)
        })
  }

  /*const handleError = (error, message) => {
      console.error(`${message}:`, error);
  };*/

  const ERROR_MESSAGES = {
        //REQUEST_PERMISSION: 'Error requesting location permission',
        REQUEST_PERMISSION: 'Plase close and open again the app',
        FETCH_LAST_POSITION: 'Error fetching last known position',
  };

  const handle = InteractionManager.createInteractionHandle()

  const dateTime = moment().format('l')+' '+moment().format('LTS');

  const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            checkLoginSettings()
            getListStoreClient()
            getListStoreEmployers()
            checkCheckIn();
            setStatusEnableObs(0)
            setRefreshing(false);
        }, 1000);
  }, []);

  /*const logoutFunction = () => {
        setAuthdata(null)
        setPageAlertLocationData(true)
  }*/

  /*const logoutHandler = () => {
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
  }*/

  const deleteEmployerHandler = () =>{
        if('' == valChangeUserEmployer || false == valChangeUserEmployer || null == valChangeUserEmployer){
            Alert.alert(
                'You need select any employers!.',
              )
        }else{
            Alert.alert('Are you sure you want to delete this user?', '', [
                {
                    text: 'Cancel',
                    onPress: () => Alert.alert('Canceled'),
                    style: 'cancel',
                },
                {
                    text: 'Yes, I Do',
                    onPress: () => deleteEmployerFunction()
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
  }//fim função

  /*const deleteAcountHandler = () =>{
        Alert.alert('Are you sure you want to delete this account?', '', [
          {
              text: 'Cancel',
              onPress: () => Alert.alert('Canceled'),
              style: 'cancel',
          },
          {
              text: 'Yes, I Do',
              onPress: () => deleteAccountFunction()
          },
        ],
        {
          cancelable: true,
          onDismiss: () =>
            Alert.alert(
              'This alert was dismissed by tapping outside of the alert dialog.',
            ),
        });
  }*/

  /*async function deleteAccountFunction() {
        const authDataToken = storageAccessToken
        const authDataUserId = storageIdUser

        axios.post(`${storageUrlApi}/deleteUserSelf`,{
            authDataToken,
            authDataUserId
          }).then(res=>{

            const resData = res.data

            if(true == res.data.success){
                //set the data
                setAuthdata(null)
                setPageAlertLocationData(true)

            }else{
                Alert.alert(res.data.message)
            }
        }).catch(error =>{
            Alert.alert('Network Error: Please check your network connection')
        })
  }*/

  async function saveDataLocation() {
            let oldTxtButtonSave = txtButtonSave
            let oldColorButtonSave = colorButtonSave
            let oldDisabledButtonSave = disabledButtonSave

            setTxtButtonSave('Saving data...')
            setColorButtonSave('#3498db')
            setDisabledButtonSave(true)

            var latitude = valLatitude
            var longitude = valLongitude
            var device = 'app'

            if(null == latitude || null == longitude || '' == latitude || '' == longitude || false == latitude || false == longitude || 'waiting' == latitude || 'waiting' == longitude){
                Alert.alert('Unable to determine your location. Please log out and log back in to refresh the app.')
                setTxtButtonSave(oldTxtButtonSave)
                setColorButtonSave(oldColorButtonSave)
                setDisabledButtonSave(oldDisabledButtonSave)
              return
            }

            if(2 == statusEnableObs && (null == obsDescription || '' == obsDescription || false == obsDescription)){
                Alert.alert('the Obs is empty')
                setTxtButtonSave(oldTxtButtonSave)
                setColorButtonSave(oldColorButtonSave)
                setDisabledButtonSave(oldDisabledButtonSave)
                return
            }

            const timestamp = moment().format('YYYY-MM-DD H:mm:ss');

            const authDataToken = storageAccessToken
            const authDataUserId = storageIdUser
            const code = valStoreCode;

            axios.post(`${storageUrlApi}/storeCheckIn`,{
                location,
                type,
                code,
                valueStore,
                timestamp,
                latitude,
                longitude,
                obsDescription,
                device,
                authDataToken,
                authDataUserId
              }).then(res=>{

                const resData = res.data

                if(true == res.data.success){
                    //set the data
                    setObsDescription('')
                    setStatusEnableObs(0)
                    checkCheckIn()

                    Alert.alert(res.data.message)
                }else{
                     Alert.alert(res.data.message)
                }
            }).catch(error =>{
                Alert.alert('Network Error: Please check your network connection')
            })
        //});
  }

  const AskToDoCheckInHandle = () => {

        if((null == valueStore || false == valueStore || '' == valueStore) && ('checkIn' == type)){
             Alert.alert('Please select a job')
             return
        }

        Alert.alert(`Do you confirm the ${txtButtonSave}?\n${dateTime}`, '', [
            {
                text: 'Cancel',
                onPress: () => Alert.alert('Canceled'),
                style: 'cancel',
            },
            {
                text: 'Yes',
                onPress: () => saveDataLocation()
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

  function checkLoginSettings(){
    if(null == settingsDataApp || undefined == settingsDataApp){
      //console.log('sem registro')
      setIfLogin(false)
    }else{
      const _settingsDataApp = JSON.parse(settingsDataApp)
      //console.log('pegou certo - ',_settingsDataApp.dataApp.token)
      //console.log('pegou certo - ',_settingsDataApp)
      setIfLogin(true)
      setStorageNameUser(_settingsDataApp.dataApp.user.name)
      setStorageIdUser(_settingsDataApp.dataApp.user.id)
      setStorageIdClient(_settingsDataApp.dataApp.user.id_client)
      setStorageClientName(_settingsDataApp.dataApp.clientName)
      setStorageUrlApi(_settingsDataApp.urlApi)
      setStorageAccessToken(_settingsDataApp.dataApp.token)
    }
  }//fim checkLoginSettings

  const checkIfLoginValidaToken = () => {
    if(null != storageAccessToken){
      const authDataToken = storageAccessToken

      axios.post(`${storageUrlApi}/checkTokenValid`, {
        authDataToken
      }).then(res => {

        const resData = res.data

        if (true != resData.success) {
          //Your session is invalid. Please close and reopen the app to refresh
          Alert.alert(resData.message)
        }

      }).catch(error => {
        console.log(error)
      })
    }
  }//fim função

  useEffect(() =>{

    const getPermissions = async () => {
        try {
            const { granted } = await requestForegroundPermissionsAsync();
            if (!granted){
                Alert.alert('Please grant location permissions')
                return;
            }
            //return status;
          } catch (error) {
            Alert.alert(ERROR_MESSAGES.REQUEST_PERMISSION);
          }

        /*let {granted} = await requestForegroundPermissionsAsync()

        if (!granted){
            Alert.alert('Please grant location permissions')
            return;
        }*/
    }
    checkIfLoginValidaToken()
    checkLoginSettings()

    getListStoreEmployers()
    getListStoreClient()
    checkCheckIn()
    getPermissions()

    watchPositionAsync({
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1
    }, (response) =>{

        setLocation(response)
        setValLatitude(response.coords.latitude)
        setValLongitude(response.coords.longitude)
    })
  }, [])

  return (
    <>
      <Stack.Screen options={{ title: 'Register' }} />
      <SafeAreaView  style={styles.container}>
        <View style={styles.contentPadding}></View>

        <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          {(true == ifLogin) &&
          <View style={styles.content}>
            <Text style={styles.title}>{storageClientName}</Text>
            <Text>Name: {storageNameUser}</Text>
          </View>
          }

          <View style={styles.contentPadding}></View>
          <View style={styles.content}>
            <Text style={styles.title}>Data</Text>
            <Text>Latitude: {valLatitude}</Text>
            <Text>Longitude: {valLongitude}</Text>
            <View style={styles.contentPadding}></View>
            <View style={styles.hr} />
            <View style={styles.contentPadding}></View>

            {('checkIn' == type && false == disabledButtonSave && 0 == ifAdmin && true == ifLogin) &&
              <View>
                    {renderLabel()}
                    <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={dataListStore}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select job' : '...'}
                    searchPlaceholder="Search..."
                    value={valueStore}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValueStore(item.value);
                        setStatusEnableObs(item.enable_obs);
                        setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                        <AntDesign
                        style={styles.icon}
                        color={isFocus ? 'blue' : 'black'}
                        name="Safety"
                        size={20}
                        />
                    )}
                    />
              </View>
            }

            <View style={styles.contentPadding}></View>
            {(1 == statusEnableObs && 0 == ifAdmin) &&
              <TextInput
                  style={styles.input}
                  editable
                  multiline
                  numberOfLines={6}
                  maxLength={100}
                  placeholderTextColor="#a3a3a3"
                  placeholder="Obs (optional)"
                  value={obsDescription}
                  onChangeText={setObsDescription}
              />
            }

            {(2 == statusEnableObs && 0 == ifAdmin) &&
              <TextInput
                style={styles.input}
                editable
                multiline
                numberOfLines={6}
                maxLength={100}
                placeholderTextColor="#a3a3a3"
                placeholder="Obs (Mandatory)"
                value={obsDescription}
                onChangeText={setObsDescription}
              />
            }

            <View style={styles.contentPadding}></View>

            <View
              style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
            {(0 == ifAdmin) &&<View style={styles.contentPadding}></View>}

            {(0 == ifAdmin) &&
            <TouchableOpacity
            disabled={disabledButtonSave}
            onPress={AskToDoCheckInHandle}
            style={{
                //backgroundColor: '#2ecc71',
                backgroundColor: colorButtonSave,
                paddingVertical: 10,
                borderRadius: 5,
                alignItems: 'center'
            }}>
                    <Text style={styles.buttonText}>{txtButtonSave}</Text>
                </TouchableOpacity>
            }
          </View>

          <View style={styles.contentPadding}></View>

          {('checkOut' == type && 0 == ifAdmin )&&
              <View style={styles.content}>
                  <Text style={styles.titleSimple}>Check In data:</Text>
                  <Text>Store: {valStoreName}</Text>
                  <Text>Latitude: {valStoreLatitude}</Text>
                  <Text>Longitude: {valStoreLongitude}</Text>
                  <Text>timestamp: {valStoreTimestamp}</Text>
                  {null != valStoreObs &&
                  <Text>Obs: {valStoreObs}</Text>
                  }
              </View>
            }


        </ScrollView>
      </SafeAreaView>
      {/*<View style={styles.container}>
        <ScreenContent path="app/(tabs)/index.tsx" title="Configurar o sregistro do ponto aqui" />

        <TouchableOpacity onPress={test} style={styles.button}>
            <Text style={styles.buttonText}>Test storage</Text>
          </TouchableOpacity>

      </View>*/}
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
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
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
    paddingBottom: 10
  },
  icon: {
    marginRight: 5,
  },
  label: {
      paddingBottom: 10
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  titleSimple: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
},
});
