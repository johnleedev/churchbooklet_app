import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, 
        Alert, Linking, KeyboardAvoidingView, Platform, RefreshControl, ImageBackground } from 'react-native';
import AsyncGetItem from '../AsyncGetItem'
import axios from 'axios';
import MainImageURL from "../../MainImageURL";
import { Typography } from '../Components/Typography';
import { Title } from '../Components/Title';
import { Divider } from '../Components/Divider';
import Loading from '../Components/Loading';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SubTitle } from '../Components/SubTitle';


const TextBox = ({ name, text }: { name: string; text: any }) => (
  <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:20, marginVertical:10}}>
    <View style={{width:80, alignItems:'center'}}>
      <Typography color='#8C8C8C'>{name}</Typography>
    </View>
    <View style={{width:2, height:20, backgroundColor:'#EAEAEA', marginHorizontal:10}}></View>
    <Typography>  {text}</Typography>
  </View>
);

export default function ListDetail(props : any) {

  const data = props.route.params.data;
  
  return (
    <View style={styles.container}>
        
      {/* title */}
      <SubTitle title='상세정보' enTitle='Detail' navigation={props.navigation}/>
                
      <Divider height={2}/>      

      <View style={styles.section}>
        <View style={{width:150, height:200, margin:5}}>

          {
            data.userImage === null || data.userImage === ''
            ?
            <View style={{height:180, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#BDBDBD', borderRadius:10}}>
              <Typography>등록된 사진이</Typography>
              <Typography>없습니다.</Typography>
            </View>
            :
            <Image style={{width:'100%', height:'100%', resizeMode:'cover', borderRadius:10}} 
              source={{ uri: `${MainImageURL}/images/userimage/${data.userImage}`}}/>
          }
          
        </View>

        <View style={{height:150, justifyContent:'center'}}>
          <TextBox name='이름' text={data.userName}/>
          <TextBox name='직분' text={data.userDuty === null || data.userDuty === '' ? '입력된 정보가 없습니다.' : data.userDuty}/>
          <TextBox name='연락처' text={data.userPhone === null || data.userPhone === '' ? '입력된 정보가 없습니다.' : data.userPhone}/>
        </View>

      </View>
      
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
  
});

