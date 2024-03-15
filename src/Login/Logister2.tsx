import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image, Platform, Modal, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import {launchImageLibrary, ImageLibraryOptions, Asset} from 'react-native-image-picker';
import { getStatusBarHeight } from "react-native-status-bar-height";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import axios from 'axios';
import MainURL from "../../MainURL";
import AsyncSetItem from '../AsyncSetItem'
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loading from '../Components/Loading';

function Logister2 (props : any) {

  const routeDataSet = () => {
    if(props.route.params === null || props.route.params === undefined) {
      return
    } else {
      const routeData = props.route.params.data;
      setRouteData(routeData);
      setRefreshToken(routeData.refreshToken);
      setUserAccount(routeData.email);
      setUserURL(routeData.userURL);
      {
        routeData.name && setUserName(routeData.name);
      }
    }
  }

  useEffect(()=>{
    routeDataSet();
  }, [])

  const [routeData, setRouteData] = useState({});
  const [refreshToken, setRefreshToken] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userURL, setUserURL] = useState('');
  const [images, setImages] = useState<Asset[]>([]);
  const [imageNames, setImageNames] = useState('');

  const onChangeUserPhone = (text : any) => {
    const userPhoneRegex = /^[0-9]*$/
    if (!userPhoneRegex.test(text)) {
      Alert.alert('숫자만 입력해주세요');
    } else {
      setUserPhone(text);  
    }
  };

  
  // 사진 첨부 함수 -----------------------------------------------------------------
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const showPhoto = async ()=> {
    setImageLoading(true);
    const option: ImageLibraryOptions = {
        mediaType : "photo",
        selectionLimit : 1,
        maxWidth: 300,
        maxHeight: 300,
        includeBase64: Platform.OS === 'android'
    }
    await launchImageLibrary(option, async(res) => {
      if(res.didCancel) Alert.alert('취소')
      else if(res.errorMessage) Alert.alert('Error : '+ res.errorMessage)
      else {
        const uris: Asset[] = res.assets || [];
        const copy = `${userAccount}_${uris[0].fileName}`
        uris[0].fileName = copy
        setImages(uris);
        setImageNames(copy);
      }
      setImageLoading(false);
    }) 
  }

  // 회원가입하기 함수 -----------------------------------------------------------------
  const handleSignup = async () => {

    const getParams = {
      ...routeData,
      userPhone: userPhone,
      userImage : imageNames,
    };

    try {
      const formData = new FormData();
      // 사진 포함
      if (images.length > 0) {
        images.forEach((image) => {
          formData.append("img", {
            name: image.fileName,
            type: image.type,
            uri: image.uri,
          });
        });
        await axios.post(`${MainURL}/login/logisterwithimage`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: getParams,
        }).then((res) => {
          if (res.data === userAccount) {
            Alert.alert('회원가입이 완료되었습니다!');
            AsyncSetItem(refreshToken, userAccount, userName, userPhone, '', '', '성도', userURL);
            props.navigation.navigate('Result');
          } else {
            Alert.alert('다시 시도해 주세요.');
          }
        })
        .catch(() => {
          console.log('실패함');
        });
      } else {
        // 사진 미포함
        await axios.post(`${MainURL}/login/logisterwithoutimage`, getParams)
        .then((res) => {
          if (res.data === userAccount) {
            Alert.alert('회원가입이 완료되었습니다!');
            AsyncSetItem(refreshToken, userAccount, userName, userPhone, '', '', '성도', userURL);
            props.navigation.navigate('Result');
          } else {
            Alert.alert('다시 시도해 주세요.');
          }
        })
        .catch(() => {
          console.log('실패함');
        });
      }

    } catch (error) {
      Alert.alert('다시 시도해 주세요.');
    }
        
  };

  const alertSignup = () => { 
    Alert.alert('중요 공지', '교회수첩 어플은, 효율적인 어플 운영을 위해 회원님들의 정확한 프로필을 필요로 합니다. 가입된 정보가 사실과 다를 경우, 어플 사용에 제한이 있을 수 있습니다.', [
      { text: '가입 취소', onPress: () => { return }},
      { text: '확인', onPress: () => handleSignup() }
    ]);
  }
  
  const alertPageOut = () => { 
    Alert.alert('작성한 모든 내용이 지워집니다.', '나가시겠습니까?', [
      { text: '취소', onPress: () => { return }},
      { text: '나가기', onPress: () => handlePageOut() }
    ]);
  }

  const handlePageOut = () => {
    setUserAccount('');
    setUserName('');
    setUserPhone('');
    props.navigation.navigate("Login");
  };

  // Logister 페이지로 전환
  const handleLogister = () => {
    alertSignup();
  };

  return (
    <View style={Platform.OS === 'android' ? styles.android : styles.ios}>
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
          <Typography>회원가입</Typography>
        </View>

        <Divider/>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 50}
          style={{flex:1}}
        >
        <ScrollView style={styles.container}>
       
          <View style={{marginBottom: 20}}>
            <View style={{flexDirection:'row'}}>
              <View style={{width:40, height:50, alignItems: 'center', marginBottom:10}}>
                <Typography fontSize={24} fontWeightIdx={1} color='#ccc'>01</Typography>  
              </View>
              <View style={{marginHorizontal:10}}>
                <View style={{width:40, height:15}}></View>
                <View style={{width:40, height:2, backgroundColor: '#ccc'}}></View>
              </View>
              <View style={{width:40, height:50, alignItems: 'center'}}>
                <Typography fontSize={24} fontWeightIdx={1}>02</Typography>  
              </View>
            </View>
            <Typography fontSize={22} fontWeightIdx={1}>
              마지막으로 사용하실 연락처와{'\n'}
              프로필 사진을 첨부해주세요.
            </Typography>
          </View>
          
          <View style={{marginBottom:10}}>
            {/* 핸드폰 번호 입력 */}
            <Typography color='#8C8C8C' fontWeightIdx={1}>연락처 <Typography color='#BDBDBD' fontSize={12}>(선택)</Typography></Typography>
            <TextInput
              style={[styles.input, {width: '100%', marginBottom:20}]}
              placeholder="-를 제외하고 입력해주세요"
              placeholderTextColor='#5D5D5D'
              onChangeText={onChangeUserPhone}
              value={userPhone}
            />
          </View>

          <View style={{}}>
            {/* 사진 첨부 */}
            <Typography color='#8C8C8C' fontWeightIdx={1}>프로필 사진 첨부 <Typography color='#BDBDBD' fontSize={12}>(선택)</Typography></Typography>
            
            { images.length > 0
              ? 
              <View style={{flexDirection:'row'}}>
                <View style={{ width: 120, height: 150, margin: 5 }}>
                  <Image source={{ uri: images[0].uri }} style={{ width: '100%', height: '100%', borderRadius:10 }} />
                </View>
                <TouchableOpacity
                  onPress={()=>{setImages([]); setImageNames('')}}
                >
                  <View style={{width:30, height:30, borderWidth:1, borderColor:'#8C8C8C', borderRadius:5,
                                alignItems:'center', justifyContent:'center', marginHorizontal:5, marginVertical:10}}>
                    <AntDesign name="close" size={20} color="#8C8C8C"/>
                  </View>
                </TouchableOpacity>
              </View>
              :
              <>
              {
                imageLoading ?
                <View style={{position:'absolute', alignItems:'center', justifyContent:'center'}}>
                  <View style={{width:120, height:150}}>
                    <Loading />
                  </View>
                </View>
                :
                <TouchableOpacity
                  onPress={showPhoto}
                >
                  <View style={{width:120, height:150, borderWidth:1, borderColor:'#8C8C8C', borderRadius:5,
                                alignItems:'center', justifyContent:'center', marginHorizontal:5, marginVertical:10}}>
                    <Entypo name="plus" size={20} color="#8C8C8C"/>
                  </View>
                </TouchableOpacity>
              }
              </>
            }
          </View>

        </ScrollView>
        </KeyboardAvoidingView>

         {/* 하단 버튼 */}
         <View style={{padding:20, marginBottom:5}}>
            <TouchableOpacity 
              onPress={handleLogister}
              style={styles.nextBtnBox}
              >
              <Text style={styles.nextBtnText}>가입완료</Text>
            </TouchableOpacity>

            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={alertPageOut}>
                <Text style={styles.linkButton}>나가기</Text>
              </TouchableOpacity>
            </View>
          </View>

      </View>

    </View>
  );
};



const styles = StyleSheet.create({
  android: {
    flex: 1,
    backgroundColor: '#333',
  },
  ios : {
    flex: 1,
    backgroundColor: '#333',
    paddingTop: getStatusBarHeight(),
  },
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
    height: 40,
    width: '100%',
    borderColor: '#DFDFDF',
    justifyContent: 'center',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
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

export default Logister2;
