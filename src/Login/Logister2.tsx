import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, ImageBackground, Platform, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useRecoilState } from 'recoil';
import { recoilLoginData } from '../RecoilStore';

export default function Logister2 (props : any) {

  const [userLoginData, setUserLoginData] = useRecoilState(recoilLoginData);
  
  // Logister 페이지로 전환
  const goLogister3Page = () => {
    props.navigation.navigate('Logister3');
  };

  const handlePastorLogin = () => {
    const copy = {...userLoginData}
    copy.userChurch = '테스트교회';
    copy.userChurchKey = '11';
    setUserLoginData(copy);
    props.navigation.navigate('Logister3');
  };

  const alertPastorLogin = () => { 
    Alert.alert(`담임목회자는, 일단 '테스트교회'로 등록되며, 가입 완료된 후에, 본인의 교회를 등록하시면 됩니다.`, `가입을 계속 진행하시겠습니까?`, [
      { text: '취소', onPress: () => { return }},
      { text: '확인', onPress: () => handlePastorLogin() }
    ]);
  }

  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>

      <View style={{padding:20, alignItems: 'center', marginTop: 10, justifyContent: 'center'}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={()=>{
            props.navigation.goBack();
          }}
          >
          <EvilIcons name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Typography fontSize={20}>회원가입</Typography>
      </View>

      <Divider/>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 50}
        style={{flex:1}}
      >
      <ScrollView style={styles.container}>
      
        <View style={{marginBottom: 30}}>
          <View style={{flexDirection:'row', marginBottom:10}}>
            <Typography fontSize={18} fontWeightIdx={1} marginBottom={10}>STEP. </Typography>
            <Typography fontSize={18} fontWeightIdx={1} marginBottom={10} color='#ccc'>1</Typography>
            <View style={{width:20, height:2, backgroundColor:'#ccc', marginVertical:14, marginHorizontal:5}}></View>
            <Typography fontSize={18} fontWeightIdx={1} marginBottom={10} >2</Typography>  
            <View style={{width:20, height:2, backgroundColor:'#ccc', marginVertical:14, marginHorizontal:5}}></View>
            <Typography fontSize={18} fontWeightIdx={1} marginBottom={10} color='#ccc'>3</Typography>  
          </View>
          <Typography fontSize={22} fontWeightIdx={1}>
            본인이 출석하는 교회를{'\n'}
            등록해주세요.
          </Typography>
        </View>
        
        <View style={{marginBottom:10}}>
          {/* 교회이름 */}
          <Typography color='#8C8C8C' fontWeightIdx={1} fontSize={18}>교회이름 <Typography color='#E94A4A'>*</Typography></Typography>
          <View style={[styles.input, {width: '100%', marginBottom:20}]}>
            <Typography>{userLoginData.userChurch}</Typography>
          </View>
        </View>

        {
          userLoginData.userChurch === ""
          ?
          <>
          <View style={{alignItems:'center', marginBottom:15}}>
            <Typography color='#8C8C8C' fontWeightIdx={1}>* 아래에서 선택해주세요</Typography>
          </View>
          <TouchableOpacity
            style={{borderWidth:1, height:150, borderColor:"#BDBDBD", borderRadius:5, marginBottom:10}}
            onPress={()=>{
              props.navigation.navigate('Navi_ChurchSearch', {screen: 'ChurchSearchMain', params: {sort : 'login'}})
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
            onPress={alertPastorLogin}
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
                <Typography fontSize={18} fontWeightIdx={0}>담임 목회자로 가입하기 </Typography>
                <AntDesign name='right' size={14} color='#333' />
              </View>
            </View>
          </TouchableOpacity>
          </>
          :
          <View style={{alignItems:'center'}}>
            <TouchableOpacity
              onPress={()=>{
                props.navigation.navigate('Navi_ChurchSearch', {screen: 'ChurchSearchMain', params: {sort : 'login'}})
              }}
            > 
              <View style={{padding:15, flexDirection:'row', alignItems:'center', 
                            borderWidth:1, borderColor:"#BDBDBD", borderRadius:10}}>
                <Typography>다시 교회 검색 하기</Typography>
                <AntDesign name='right' size={14} color='#333' />
              </View>
            </TouchableOpacity>
          </View>
        }
        

        <View style={{height:100}}></View>
      </ScrollView>
      </KeyboardAvoidingView>

        {/* 하단 버튼 */}
        <View style={{padding:20}}>
        <TouchableOpacity 
          onPress={()=>{
            userLoginData.userChurch !== ""
            ? goLogister3Page()
            : Alert.alert('교회를 선택해주세요')
          }}
          style={
            userLoginData.userChurch !== "" ? [styles.nextBtnBox, { backgroundColor: '#333'}] 
            : [styles.nextBtnBox, { backgroundColor: '#BDBDBD'}]
          }
          >
          <Text style={styles.nextBtnText}>다음</Text>
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
 backButton: {
  position:'absolute',
  top: 20,
  left: 20,
  width: 30,
  height: 30,
},
  inputContainer: {
    width: '80%',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#DFDFDF',
    justifyContent: 'center',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 18,
    color: '#333'
  },  
  message: {
    marginBottom: 10,
  },
  success: {
    color: '#47C83E',
  },
  error: {
    color: '#F15F5F',
  },
  errorText: {
    color: '#F15F5F',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButton: {
    color: '#333',
    textDecorationLine: 'underline',
  },
  nextBtnBox: {
    borderRadius: 16,
    width: '100%',
    marginBottom: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333'
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectDropdown : {
    borderBottomWidth:1, 
    borderRadius:5, 
    borderColor:'#DFDFDF', 
    paddingHorizontal:15,
    paddingVertical:5,
    flexDirection:'row', 
    alignItems:'center',
    marginVertical:5
  }
});


