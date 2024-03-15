import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Platform, TextInput, NativeSyntheticEvent, TextInputChangeEventData, Alert } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Typography } from "../Components/Typography";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { ButtonBox } from "../Components/ButtonBox";

export default function Admin (props : any) {
  
  const [inputID, setInputID] = useState('');  
  const [inputPW, setInputPW] = useState(''); 

  const changeInputID = async(event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const inputText = event.nativeEvent.text;
    setInputID(inputText)
  };
  const changeInputPW = async(event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const inputText = event.nativeEvent.text;
    setInputPW(inputText)
  };

  const handleAdmin = () => {
    if (inputID === 'churchbookletadmin' && inputPW === '1234567890!!') {
      props.navigation.navigate('Navi_Main'); 
    } else {
      Alert.alert('ID와 PW의 정보가 일치하지 않습니다.')
    }
  };
  

  const closeDetail = () => {
    props.navigation.goBack();
  };
   

  return (
    <View style={Platform.OS === 'android' ? styles.android : styles.ios}>
      <View style={styles.container}>

         <View style={{alignItems: 'center', marginVertical: 20, justifyContent: 'center'}}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={()=>{
              props.navigation.goBack();
            }}
            >
            <EvilIcons name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <Typography>관리자 로그인</Typography>
        </View>

        <View style={styles.seachBar}>
          <View style={[styles.flexBox, { alignItems:"center"}]}>
            <TextInput 
              maxLength={20} 
              placeholder={'아이디'}
              placeholderTextColor="#8C8C8C"
              value={inputID}
              onChange={changeInputID} 
              style={{height:'100%', flex:1}}
            />
          </View>
        </View>
        <View style={styles.seachBar}>
          <View style={[styles.flexBox, { alignItems:"center"}]}>
            <TextInput 
              maxLength={20} 
              placeholder={'비밀번호'}
              placeholderTextColor="#8C8C8C"
              value={inputPW}
              onChange={changeInputPW} 
              style={{height:'100%', flex:1}}
            />
          </View>
        </View>
        
        <View style={{marginTop:20}}>
          <ButtonBox leftFunction={closeDetail} leftText='취소' rightFunction={handleAdmin} rightText='확인'/>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  android: {
    flex: 1,
    backgroundColor: 'black',
  },
  ios : {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: getStatusBarHeight(),
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24
  },
  backButton: {
    position:'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
  },
  seachBar:{
    borderWidth:1,
    borderRadius:5,
    height: 48,
    borderColor: '#EAEAEA',
    flexDirection:"row",
    alignItems:"center",
    paddingHorizontal:15,
    marginVertical:10
  },
  flexBox:{
    flexDirection:'row',
    justifyContent:'space-between',
  }
});