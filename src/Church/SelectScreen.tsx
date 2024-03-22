import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Alert, TouchableOpacity, Linking,
          NativeSyntheticEvent, TextInputChangeEventData, ImageBackground, Image, Text } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncGetItem from '../AsyncGetItem'
import axios from 'axios';
import MainURL from "../../MainURL";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';



export default function SelectScreen (props : any) {


  const alertNotice = () => { 
    Alert.alert('교회등록은 목회자(담임)만 가능합니다.', '허위로 등록하거나 장난으로 등록한 것이 발견될 경우, 경고 없이 곧바로 어플 사용에 관하여 제한 조치 됩니다. 등록하시겠습니까?', [
      { text: '취소', onPress: () => { return }},
      { text: '확인', onPress: () => props.navigation.navigate("ChurchInfoInput", {asyncGetData : props.asyncGetData}) }
    ]);
  }

  return (
    <View>
      <View style={{height:70, alignItems:'center', justifyContent:'center'}}>
        <Typography fontSize={18} marginBottom={5}>현재 나의 교회가 지정되어 있지 않습니다.</Typography>
        <Typography fontSize={18}>아래에서 선택해주세요.</Typography>
      </View>

      <Divider height={2} marginVertical={10}/>

      <TouchableOpacity
        style={{borderWidth:1, height:150, borderColor:"#BDBDBD", borderRadius:5, marginBottom:10}}
        onPress={()=>{
          props.navigation.navigate("Navi_ChurchSearch", {screen : "ChurchSearchMain", params: { sort : 'search' }});
        }}
      > 
        <ImageBackground
          source={require("../images/believer.jpg")}
          style={{width:"100%", height:"100%", opacity:0.3}}
        >
        </ImageBackground>
        <View style={{position:'absolute', height:150, top:0, left:0, padding:15, justifyContent:'space-between'}}>
          <View>
            <Typography fontSize={18} marginBottom={5}>교회에 출석하는 일반 성도로서</Typography>
            <Typography fontSize={18} marginBottom={5}>내 교회를 찾으려는 경우</Typography>
          </View>
          <View style={{width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
            <Typography fontSize={18} fontWeightIdx={0}>교회 찾기  </Typography>
            <AntDesign name='right' size={14} color='#333' />
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={{borderWidth:1, height:150, borderColor:"#BDBDBD", borderRadius:5}}
        onPress={alertNotice}
      >
        <ImageBackground
          source={require("../images/church.jpg")}
          style={{width:"100%", height:"100%", opacity:0.3}}
        >
        </ImageBackground>
        <View style={{position:'absolute', height:150, top:0, left:0, padding:15, justifyContent:'space-between'}}>
          <View>
            <Typography fontSize={18} marginBottom={5}>교회를 담당하는 담임목사로서</Typography>
            <Typography fontSize={18} >교회를 새로 등록하려는 경우</Typography>
          </View>
          <View style={{width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
            <Typography fontSize={18} fontWeightIdx={0}>교회 등록하기  </Typography>
            <AntDesign name='right' size={14} color='#333' />
          </View>
        </View>
      </TouchableOpacity>
      <View style={{height:100}}></View>
     
    </View> 
    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding:20
  },
  input: {
    height: 40,
    borderColor: '#DFDFDF',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: '#333'
  }
});

