import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Image, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import { useRecoilState } from 'recoil';
import { recoilLoginData } from '../RecoilStore';

function Logister (props : any) {

  const [userLoginData, setUserLoginData] = useRecoilState(recoilLoginData);

  const [userAccount, setUserAccount] = useState(userLoginData.userAccount);
  const [userName, setUserName] = useState(userLoginData.userName ? userLoginData.userName : '');
  
  const [userAccountMessage, setUserAccountMessage] = useState('');
  const [isUserAccount, setIsUserAccount] = useState(false);
  const [userNameMessage, setUserNameMessage] = useState('');0
  const [isUserName, setIsUserName] = useState(false);

  const onChangeUserAccount = (text : any) => {
    const userNameRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    setUserAccount(text);
    if (!userNameRegex.test(text)) {
      setUserAccountMessage('email 형식이 올바르지 않습니다.');
      setIsUserAccount(false);
    } else {
      setUserAccountMessage('올바른 형식의 메일입니다.');
      setIsUserAccount(true);
    }
  };

  const onChangeUserName = (text : any) => {
    const userNameRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    setUserName(text);
    if (!userNameRegex.test(text)) {
      setUserNameMessage('한글로 입력해주세요.');
      setIsUserName(false);
    } else if (text.length < 2 || text.length > 5) {
      setUserNameMessage('2글자 이상 5글자 미만으로 입력해주세요.');
      setIsUserName(false);
    } else {
      setUserNameMessage('올바른 형식의 이름입니다.');
      setIsUserName(true);
    }
  };

  // Logister 페이지로 전환
  const goLogister2Page = () => {
    const copy = {...userLoginData}
    copy.userName = userName;
    setUserLoginData(copy);
    props.navigation.navigate('Logister2');
  };


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
        
        <View style={{flex:1, marginBottom:30}}>
          <View style={{flexDirection:'row', marginBottom:10}}>
            <Typography fontSize={18} fontWeightIdx={1} marginBottom={10}>STEP. </Typography>
            <Typography fontSize={18} fontWeightIdx={1} marginBottom={10}>1</Typography>
            <View style={{width:20, height:2, backgroundColor:'#ccc', marginVertical:14, marginHorizontal:5}}></View>
            <Typography fontSize={18} fontWeightIdx={1} marginBottom={10} color='#ccc'>2</Typography>  
            <View style={{width:20, height:2, backgroundColor:'#ccc', marginVertical:14, marginHorizontal:5}}></View>
            <Typography fontSize={18} fontWeightIdx={1} marginBottom={10} color='#ccc'>3</Typography>  
          </View>
          <Typography fontSize={22} fontWeightIdx={1}>
            회원정보 확인을 위해{'\n'}
            기본정보를 입력해 주세요.
          </Typography>
        </View>
        
        <View style={{flex:2}}>
          <Typography color='#8C8C8C' fontWeightIdx={1} fontSize={18}>이메일 주소 <Typography color='#E94A4A'>*</Typography></Typography>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={{width:21, height:50, justifyContent:'center'}}>
              { userLoginData.userURL === 'kakao' && <Image source={require('../images/login/kakao.png')} style={{width:20, height:20}}/>}
              { userLoginData.userURL === 'naver' && <Image source={require('../images/login/naver.png')} style={{width:20, height:20}}/>}
              { userLoginData.userURL === 'apple' && <Image source={require('../images/login/apple.png')} style={{width:20, height:20}}/>}
              { userLoginData.userURL === 'google' 
                && <View style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20,
                      marginHorizontal: 5, borderRadius:28, borderWidth:1, borderColor: '#BDBDBD'}} >
                  <Image source={require('../images/login/google.png')} 
                      style={{width: '40%', height: '40%', resizeMode:'center'}}/>
                  </View>}
            </View>
            <TextInput
              style={[styles.input, {width: '94%'}]}
              placeholder="e-mail"
              placeholderTextColor='#5D5D5D'
              onChangeText={onChangeUserAccount}
              value={userAccount}
            />
          </View>
          {userAccount.length > 0 && (
            <Text style={[styles.message, isUserAccount ? styles.success : styles.error]}>
              {userAccountMessage}
            </Text>
          )}

          <Typography color='#8C8C8C' fontWeightIdx={1} fontSize={18}>이름 <Typography color='#E94A4A'>*</Typography></Typography>
          <TextInput
            style={[styles.input, {width: '100%'}]}
            placeholder="이름"
            placeholderTextColor='#5D5D5D'
            onChangeText={onChangeUserName}
            value={userName}
          />
          {userName.length > 0 && (
            <Text style={[styles.message, isUserName ? styles.success : styles.error]}>
              {userNameMessage}
            </Text>
          )}
        </View>

      </ScrollView>
      </KeyboardAvoidingView>
      
      <View style={{padding:20}}>
        <TouchableOpacity 
          onPress={()=>{
            userAccount && userName 
            ? goLogister2Page()
            : Alert.alert('모든 항목을 채워주세요')
          }}
          style={
            userAccount && userName ? [styles.nextBtnBox, { backgroundColor: '#333'}] 
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
    borderColor: '#DFDFDF',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    fontSize:18,
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
    alignItems: 'center'
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default Logister;
