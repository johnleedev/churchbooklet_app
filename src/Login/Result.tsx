import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Typography } from "../Components/Typography";
import AsyncGetItem from '../AsyncGetItem'
import { useResetRecoilState } from "recoil";
import { recoilLoginData } from "../RecoilStore";

export default function Result (props : any) {

  const resetUserLoginData = useResetRecoilState(recoilLoginData);

  // AsyncGetData
  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      setAsyncGetData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    resetUserLoginData();
    asyncFetchData();
  }, []);

  return (
    
    <View style={styles.container}>
      <View  style={{width: '100%', height:100, alignItems: 'flex-start', marginTop:50}}>
        <Image source={require('../images/login/icon.png')} 
            style={{width: 100, height:100, resizeMode: 'contain'}}/>
      </View>
      <View style={{flex:1, width:'100%', justifyContent: 'flex-start', marginTop:50}}>
        <Typography fontSize={28} marginBottom={5}>{asyncGetData.userName}님</Typography>
        <Typography fontSize={28} marginBottom={20}>회원가입이 완료되었어요!</Typography>
        <Typography fontWeightIdx={1} marginBottom={5}>"교회수첩" 어플의</Typography>
        <Typography fontWeightIdx={1}>다양한 컨텐츠에 참여해보세요.</Typography>
      </View>
      
      <View style={{justifyContent: 'center', alignItems:'center'}}>
        <TouchableOpacity 
            onPress={()=>{
              props.navigation.replace('Navi_Main');
            }}
            style={styles.nextBtnBox}
            >
            <Text style={styles.nextBtnText}>시작하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24
  },
  mainlogo: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    height: 250,
  },
  backButton: {
    position:'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
  },
  nextBtnBox: {
    borderRadius: 16,
    width: '100%',
    marginBottom: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});