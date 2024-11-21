import { Stack } from 'expo-router';
import { Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import { useMMKV, useMMKVString } from 'react-native-mmkv';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const globalStorage = useMMKV()
  const dataStorage = useMMKV({ id: 'myapp' })

  const [listDataApp, setListDataApp] = useMMKVString('listDataLocal', dataStorage)
  const [refreshing, setRefreshing] = useState(false);

  const [test, setTest] = useState(null)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
        getListData()
        setRefreshing(false);
    }, 1000);
  }, []);

  const getListData = () => {

    if(null == listDataApp || undefined == listDataApp){
      //fazer um lista default ou voltar um alert error
    }else{
      const data = dataStorage.getString('listDataLocal')
      const dataArray = data.split("|");

      let test = dataArray[1]

      test = test.replaceAll("\'", "\"");

      const obj = JSON.parse(test);
    }
  }//fim funcao

  function auxDataCheckList(props, count){
   let local = ''

   if (0 == props.Local) {
    local = 'web'
   } else {
    local = 'local'
   }

   return <>
            {/*<Text style={styles.whiteText}>Carai, {props.timestamp}</Text>*/}
            <View style={styles.contentPadding}></View>
            <View style={styles.content}>
              <Text style={styles.title}>#{count}</Text>
              <Text>Timestamp: {props.timestamp}</Text>
              <Text>Latitude: {props.latitude}</Text>
              <Text>Longitude: {props.longitude}</Text>
              <Text>Local saved: {local}</Text>
            </View>
          </>
  }//

  function DataCheckInOutList() {

    if(null == listDataApp || undefined == listDataApp){
      //fazer um lista default ou voltar um alert error
    }else{
      const data = dataStorage.getString('listDataLocal')
      const dataArray = data.split("|");

      let count = (dataArray.length)+1;

      const listData = dataArray.map((_data) => {
        let newData = _data.replaceAll("\'", "\"");
        let obj = JSON.parse(newData);

        count--

        return auxDataCheckList(obj, count)

      })
      return listData
    }
  }

  useEffect(() =>{
    getListData()
  }, [])

  const cleanListfunction = () => {
    dataStorage.delete('listDataLocal')
  }//end function

  const cleanListHandle = () => {
    Alert.alert(`Do you really want to clean the list?
                Deleting your list is irreversible. Your web points will be preserved on the server`, '', [
      {
          text: 'Cancel',
          onPress: () => Alert.alert('Canceled'),
          style: 'cancel',
      },
      {
          text: 'Yes, I Do',
          onPress: () => cleanListfunction()
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          'This alert was dismissed by tapping outside of the alert dialog.',
        ),
    });
  }//end function

  return (
    <>
      <Stack.Screen options={{ title: 'List' }} />
      <SafeAreaView  style={styles.container}>
        <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          <View style={styles.contentPadding}></View>
          <View style={styles.content}>
            <Text style={styles.title}>Options</Text>
            <TouchableOpacity onPress={cleanListHandle} style={styles.buttonDanger}>
              <Text style={styles.buttonText}>Clean List</Text>
            </TouchableOpacity>
          </View>

          <DataCheckInOutList  />

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
  whiteText: {
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
