import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image, Platform, ImageBackground, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
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
import { recoilLoginData } from '../RecoilStore';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import SelectDropdown from 'react-native-select-dropdown'


export default function Logister3 (props : any) {

  const userLoginData = useRecoilValue(recoilLoginData);
  const resetUserLoginData = useResetRecoilState(recoilLoginData);

  const [selectPage, setSelectPage] = useState(userLoginData.userChurchKey === '11' ? 2 : 0);
  const [userPhone, setUserPhone] = useState('');
  const [userDuty, setUserDuty] = useState('');
  const [profileSet, setProfileSet] = useState('self');  
  const [images, setImages] = useState<Asset[]>([]);
  const [imageNames, setImageNames] = useState('');
  const [check, setCheck] = useState<boolean>(false);

  const optionsDuty = ["성도", "주일학교", "집사", "안수집사", "권사", "장로", "선교사", "전도사", "목사"];

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
        const copy = `${userLoginData.userAccount}_${uris[0].fileName}`
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
      ...userLoginData,
      userPhone: userPhone,
      userDuty : userDuty,
      userImage : imageNames,
      profileSet : profileSet
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
          if (res.data === userLoginData.userAccount) {
            Alert.alert('회원가입이 완료되었습니다!');
            AsyncSetItem(userLoginData.refreshToken, userLoginData.userAccount, userLoginData.userName,
                          userLoginData.userChurch, userLoginData.userChurchKey, userDuty);
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
          
          if (res.data === userLoginData.userAccount) {
            Alert.alert('회원가입이 완료되었습니다!');
            AsyncSetItem(userLoginData.refreshToken, userLoginData.userAccount, userLoginData.userName, 
                        userLoginData.userChurch, userLoginData.userChurchKey, userDuty);
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
    Alert.alert('지금까지 작성한 모든 내용이 지워집니다.', '나가시겠습니까?', [
      { text: '취소', onPress: () => { return }},
      { text: '나가기', onPress: () => handlePageOut() }
    ]);
  }

  const handlePageOut = () => {
    resetUserLoginData();
    props.navigation.navigate("Login");
  };

  // Logister 페이지로 전환
  const handleLogister = () => {
    alertSignup();
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
      
        <View style={{marginBottom: 30}}>
          <View style={{flexDirection:'row', marginBottom:10}}>
            <Typography fontSize={18} fontWeightIdx={1} marginBottom={10}>STEP. </Typography>
            <Typography fontSize={18} fontWeightIdx={1} marginBottom={10} color='#ccc'>1</Typography>
            <View style={{width:20, height:2, backgroundColor:'#ccc', marginVertical:14, marginHorizontal:5}}></View>
            <Typography fontSize={18} fontWeightIdx={1} marginBottom={10} color='#ccc'>2</Typography>  
            <View style={{width:20, height:2, backgroundColor:'#ccc', marginVertical:14, marginHorizontal:5}}></View>
            <Typography fontSize={18} fontWeightIdx={1} marginBottom={10} >3</Typography>  
          </View>
          <Typography fontSize={22} fontWeightIdx={1}>
            마지막으로 교회수첩에 사용될{'\n'}
            나머지 신상정보를 입력해주세요.
          </Typography>
        </View>

        {
          selectPage === 0 &&
          <View>
            <View style={{alignItems:'center', marginVertical:20}}>
              <Typography fontSize={20}>어떻게 입력하시겠습니까?</Typography>
            </View>

            <View style={{flexDirection:"row", justifyContent:'space-between'}}>
              <TouchableOpacity
                style={styles.selectBox}
                onPress={()=>{setSelectPage(1)}}
              > 
                <View style={{padding:15}}>
                  <Typography fontSize={18} marginBottom={10}><Text style={{lineHeight:25}}>저 대신 교회의 {'\n'}담당 목회자가 {'\n'}입력해주세요</Text></Typography>
                  <View style={{width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
                    <Typography fontSize={18} fontWeightIdx={0}>가입하기 </Typography>
                    <AntDesign name='right' size={14} color='#333' />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.selectBox}
                onPress={()=>{setSelectPage(2)}}
              >
                <View style={{padding:15, justifyContent:'space-between'}}>
                  <Typography fontSize={18} marginBottom={10}><Text style={{lineHeight:25}}>제가{'\n'}직접{'\n'}입력할게요</Text></Typography>
                  <View style={{width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
                    <Typography fontSize={18} fontWeightIdx={0}>입력하기  </Typography>
                    <AntDesign name='right' size={14} color='#333' />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        }
        {
         selectPage === 1 &&  
        <>
        <View style={{alignItems:'flex-start', marginBottom:20}}>
          <TouchableOpacity 
            style={{flexDirection:'row', alignItems:'center', borderWidth:1, borderColor:'#BDBDBD', borderRadius:10, padding:5}}
            onPress={()=>{setSelectPage(0); setCheck(false)}}
          >
            <AntDesign name='left' size={14} color='#333' style={{marginRight:5}}/>
            <Typography fontSize={14}>다시선택</Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.noticeContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name="warning" size={20} color="#333" />
            <Typography fontSize={24} fontWeightIdx={1}> 유의 사항 안내</Typography>
          </View>
          
          <View style={styles.noticeBox}>
            <View style={styles.noticeTextBox}>
              <Typography fontSize={18} marginBottom={10} >1. 교회의 담당 목회자가, 귀하의 연락처, 사진, 직분을 입력 및 수정할 수 있습니다. </Typography>
              <Typography fontSize={18} marginBottom={10} >2. 입력된 정보는 교회 교인 목록에서, 같은 교회 교인들에게 공개됩니다.</Typography>
              <Typography fontSize={18} marginBottom={10} >3. 입력된 정보는, 언제든지 목회자에게 수정 삭제 요청을 할 수 있습니다.</Typography>
              <Typography fontSize={18} >4. 입력된 정보는, 프로필 설정에서 직접 수정할 수 있습니다.</Typography>
            </View>

          </View>

          <View style={styles.checkButtonBox}>
            <TouchableOpacity
              hitSlop={{ top: 15, bottom: 15 }}
              style={styles.checkButton}
              onPress={()=>{
                setCheck(!check);
                if (profileSet === 'self') {
                  setProfileSet('church');
                } else {
                  setProfileSet('self');
                }
              }}
            >
            <View style={{flexDirection:'row', alignItems:'center'}}>
              {
                check ? <AntDesign name="checkcircle" size={20} color="#333" />
              : <AntDesign name="checkcircleo" size={20} color="#BDBDBD" />
              }
              <Typography fontSize={20} fontWeightIdx={1}>  위 유의사항을 확인하였습니다.</Typography>
            </View>
            </TouchableOpacity> 
          </View>

          <View style={{height:100}}></View>
        </View>
        </>}
        {
         selectPage === 2 &&  
        <>
        {
          userLoginData.userChurchKey !== '1' &&
          <View style={{alignItems:'flex-start', marginBottom:20}}>
            <TouchableOpacity 
              style={{flexDirection:'row', alignItems:'center', borderWidth:1, borderColor:'#BDBDBD', borderRadius:10, padding:5}}
              onPress={()=>{setSelectPage(0); setCheck(false)}}
            >
              <AntDesign name='left' size={14} color='#333' style={{marginRight:5}}/>
              <Typography fontSize={14}>다시선택</Typography>
            </TouchableOpacity>
          </View>
        }

        <View style={{marginBottom:10}}>
          {/* 핸드폰 번호 입력 */}
          <Typography color='#8C8C8C' fontWeightIdx={1} fontSize={18}>연락처 <Typography color='#BDBDBD' fontSize={12}>(선택)</Typography></Typography>
          <TextInput
            style={[styles.input, {width: '100%', marginBottom:20}]}
            placeholder="-를 제외하고 입력해주세요"
            placeholderTextColor='#5D5D5D'
            onChangeText={onChangeUserPhone}
            value={userPhone}
          />
        </View>

        <View style={{marginBottom:10}}>
          {/* 직분 입력 */}
          <Typography color='#8C8C8C' fontWeightIdx={1} fontSize={18}>직분 <Typography color='#BDBDBD' fontSize={12}>(선택)</Typography></Typography>
          <View style={[styles.input, {flexDirection:'row', justifyContent:'space-between', alignItems:'center'}]}>
            <SelectDropdown
              data={optionsDuty}
              defaultValue={userLoginData.userChurchKey === '11' ? '목사' : '성도'}
              onSelect={(selectedItem, index) => {
                setUserDuty(selectedItem);
              }}
              defaultButtonText={optionsDuty[0]}
              buttonStyle={{width:'100%', height:35, backgroundColor:'#fff'}}
              buttonTextStyle={{fontSize:16}}
              dropdownStyle={{width:250, borderRadius:10}}
              rowStyle={{ width:250, height: 60}}
              rowTextStyle={{fontSize:16}}
            />
            <AntDesign name='down' size={12} color='#8C8C8C' style={{position:'absolute', right:30}}/>
          </View>
        </View>

        <View style={{marginBottom:10}}>
          {/* 사진 첨부 */}
          <Typography color='#8C8C8C' fontWeightIdx={1} fontSize={18}>프로필 사진 첨부 <Typography color='#BDBDBD' fontSize={12}>(선택)</Typography></Typography>
          
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

        <View style={styles.checkButtonBox}>
          <TouchableOpacity
            hitSlop={{ top: 15, bottom: 15 }}
            style={styles.checkButton}
            onPress={()=>{setCheck(!check);}}
          >
          <View style={{flexDirection:'row', alignItems:'center'}}>
            {
              check ? <AntDesign name="checkcircle" size={20} color="#333" />
            : <AntDesign name="checkcircleo" size={20} color="#BDBDBD" />
            }
            <Typography fontSize={20} fontWeightIdx={1}> 이대로 가입할게요.</Typography>
          </View>
          </TouchableOpacity> 
        </View>

        <View style={{height:100}}></View>
        </>}
      </ScrollView>
      </KeyboardAvoidingView>

        {/* 하단 버튼 */}
        <View style={{padding:20, marginBottom:5}}>
          <TouchableOpacity 
            onPress={()=>{
              if (selectPage === 0) {
                Alert.alert('먼저 입력 방식을 선택해주세요')
              } else {
                check 
                ? handleLogister()
                : Alert.alert('체크버튼을 눌러주세요')
              }
            }}
            style={
              check 
              ? [styles.nextBtnBox, { backgroundColor: '#333'}] 
              : [styles.nextBtnBox, { backgroundColor: '#BDBDBD'}]
            }
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
  noticeContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noticeBox: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  noticeTextBox: {
    marginVertical: 15
  },
  checkButtonBox: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent:'center',
    flexDirection: 'row',
  },
  checkButton: {

  },
  handleButtonBox : {

  },
  actionButtonBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems:'center',
    marginBottom:20
  },
  actionButton: {
    width: 300,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
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
  },
  selectBox : {
    width: '48%',
    borderWidth:1, 
    borderColor:"#BDBDBD", 
    borderRadius:5
  }
});


