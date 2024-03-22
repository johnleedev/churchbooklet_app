import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, TextInput, Image, Platform } from 'react-native';
import {launchImageLibrary, ImageLibraryOptions, Asset} from 'react-native-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncGetItem from '../AsyncGetItem'
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import axios from 'axios';
import MainURL from "../../MainURL";
import MainImageURL from "../../MainImageURL";
import MainVersion from '../../MainVersion';
import { Title } from '../Components/Title';
import { ButtonBox } from '../Components/ButtonBox';
import Loading from '../Components/Loading';
import SelectDropdown from 'react-native-select-dropdown'

function MyPageMain (props: any) {

  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const profileToggleModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(true);
  const [userAccount, setUserAccount] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userChurch, setUserChurch] = useState('');
  const [userDuty, setUserDuty] = useState('');
  const [images, setImages] = useState<Asset[]>([]);
  const [userimage, setUserImage] = useState('');

  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      if (data) {
        axios.get(`${MainURL}/mypage/getprofile/${data.userAccount}`).then((res) => {
          setUserAccount(res.data[0].userAccount);
          setUserName(res.data[0].userName);
          setUserPhone(res.data[0]?.userPhone);
          setUserChurch(res.data[0]?.userChurch);
          setUserDuty(res.data[0]?.userDuty);
          setUserImage(res.data[0]?.userImage);
        });
        setAsyncGetData(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    asyncFetchData();
  }, [isProfileModalVisible, refresh]);

  const changeProfile = async () => {
    axios
      .post(`${MainURL}/mypage/changeprofile`, {
        userAccount : asyncGetData.userAccount,
        userName: userName, userPhone: userPhone, 
        userDuty: userDuty
      })
      .then((res) => {
        if (res.data === true) {
          AsyncStorage.setItem('name', userName);
          AsyncStorage.setItem('phone', userPhone);
          AsyncStorage.setItem('duty', userDuty);
          Alert.alert('입력되었습니다.');
          profileToggleModal();
        } else {
          Alert.alert(res.data)
        }
      })
      .catch(() => {
        console.log('실패함')
      })
  };
 
  const handleLogout = () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('account');
    AsyncStorage.removeItem('name');
    AsyncStorage.removeItem('phone');
    AsyncStorage.removeItem('church');
    AsyncStorage.removeItem('duty');
    AsyncStorage.removeItem('URL');
    Alert.alert('로그아웃 되었습니다.');
    props.navigation.replace("Navi_Login")
  };

  const deleteAccount = () => {
    props.navigation.navigate("DeleteAccount")
  };

  // 핸드폰 번호변경
  const onChangeUserPhone = (text : any) => {
    const userPhoneRegex = /^[0-9]*$/
    if (!userPhoneRegex.test(text)) {
      Alert.alert('숫자만 입력해주세요');
    } else {
      setUserPhone(text);  
    }
  };


  // 직분 선택
  const optionsDuty = ["성도", "주일학교", "집사", "안수집사", "권사", "장로", "선교사", "전도사", "목사"];

  // 사진 변경 함수 ----------------------------------------------------------------   
  const alertChangePhoto = () => {
    Alert.alert(
      '기존의 사진은 삭제되며, 다시 새로 업로드해야 합니다.',
      '정말 변경 하시겠습니까?',
      [
        { text: '취소', onPress: () => { return } },
        { text: '변경하기', onPress: deleteImage},
      ]
    );
  };

  // 사진 삭제
  const deleteImage = async () => {
    try {
      await axios.post(`${MainURL}/mypage/deleteimage`, {
        userAccount : userAccount,
        imageName : userimage
      });
      setUserImage('');
      Alert.alert('기존의 사진이 삭제되었습니다. 사진을 다시 첨부해주세요');
    } catch (error) {
      Alert.alert('다시 시도해 주세요.');
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
        setUserImage(copy);
      }
      setImageLoading(false);
    }) 
  }

   // 사진변경하기 함수 -----------------------------------------------------------------
   const handleChangeImage = async () => {

    const getParams = {
      userAccount : userAccount,
      userImage : userimage
    };

    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("img", {
          name: image.fileName,
          type: image.type,
          uri: image.uri,
        });
      });
      await axios.post(`${MainURL}/mypage/changeprofileimage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: getParams,
      }).then((res) => {
        if (res.data) {
          Alert.alert('변경되었습니다!');
          setImages([]);
        } else {
          Alert.alert('다시 시도해 주세요.');
        }
      })
      .catch(() => {
        console.log('실패함');
      });
    } catch (error) {
      Alert.alert('다시 시도해 주세요.');
    }
  };

  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>

      <Title title='마이페이지' enTitle='My Page' />
      
      <Divider height={2} />

      <ScrollView style={styles.container}>
      
      <View style={styles.section}>
        <Typography fontSize={18} fontWeightIdx={1}>기본 정보</Typography>
        <TouchableOpacity style={{position:'absolute', top:10, right:10, padding:15}}
         onPress={profileToggleModal}
        >
          <AntDesign name='setting' size={20} color='#000'/>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isProfileModalVisible}
          onRequestClose={profileToggleModal}
        >
          <View style={{ width: '100%', position: 'absolute', top:80, borderRadius: 20, backgroundColor: 'white', 
                        padding: 20}}>
            <Typography marginBottom={10} fontWeightIdx={1}>프로필 편집</Typography>
            <TouchableOpacity style={{position:'absolute', top:5, right:10, padding:15}}
              onPress={profileToggleModal}
              > 
                <AntDesign name='close' size={20} color='#000'/>
            </TouchableOpacity>
            <Divider height={3} marginVertical={10}/>
            
              <View style={styles.infoBox}>
                <Typography>이름: </Typography>
                <TextInput
                  style={styles.input}
                  placeholder="이름"
                  value={userName}
                  onChangeText={setUserName}
                /> 
              </View>
              <View style={styles.infoBox}>
                <Typography>번호: </Typography>
                <TextInput
                  style={styles.input}
                  placeholder="' - '를 제외하고 입력해주세요"
                  value={userPhone === undefined ? '미정' : userPhone}
                  onChangeText={onChangeUserPhone}
                /> 
              </View>
              <View style={styles.infoBox}>
                <Typography>직분: </Typography>
                <View style={[styles.input, {flexDirection:'row', justifyContent:'space-between', alignItems:'center'}]}>
                  <SelectDropdown
                    data={optionsDuty}
                    defaultValue={userDuty === undefined ? '미정' : userDuty}
                    onSelect={(selectedItem, index) => {
                      setUserDuty(selectedItem);
                    }}
                    defaultButtonText={optionsDuty[0]}
                    buttonStyle={{width:'100%', height:50, backgroundColor:'#fff'}}
                    buttonTextStyle={{fontSize:16}}
                    dropdownStyle={{width:250, borderRadius:10}}
                    rowStyle={{ width:250, height: 60}}
                    rowTextStyle={{fontSize:16}}
                  />
                  <AntDesign name='down' size={12} color='#8C8C8C' style={{position:'absolute', right:30}}/>
                </View>
              </View>
              <View style={{height:100, justifyContent:'flex-end'}}>
                <ButtonBox leftText='취소' leftFunction={profileToggleModal} rightText='변경' rightFunction={changeProfile} />
              </View>
          </View>
        </Modal>

        <View style={styles.infoBox}>
          <View style={styles.infoTextBox}>
            <Typography marginBottom={15} >
              <FontAwesome5 name="cross" size={16} color="#000"/>  계정: {asyncGetData.userAccount}
            </Typography>
            <Typography marginBottom={15} >
              <FontAwesome5 name="cross" size={16} color="#000"/>  이름: {asyncGetData.userName}
            </Typography>
            <Typography marginBottom={15} >
              <FontAwesome5 name="cross" size={16} color="#000"/>  번호: {asyncGetData.userPhone === undefined || asyncGetData.userPhone === null ? '미정' : asyncGetData.userPhone}
            </Typography>
            <Typography marginBottom={15} >
              <FontAwesome5 name="cross" size={16} color="#000"/>  교회: {asyncGetData.userChurch === undefined || asyncGetData.userChurch === null  ? '미정' : asyncGetData.userChurch}
            </Typography>
            <Typography marginBottom={15} >
              <FontAwesome5 name="cross" size={16} color="#000"/>  직분: {asyncGetData.userDuty === undefined || asyncGetData.userDuty === null  ? '미정' : asyncGetData.userDuty}
            </Typography>
            <Typography marginBottom={5} >
              <FontAwesome5 name="cross" size={16} color="#000"/>  로그인 방식: {asyncGetData.userURL}
            </Typography>
          </View>
        </View>
      </View>


      <Divider height={2}/>

      <View style={styles.section}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <Typography fontSize={18} fontWeightIdx={1} marginBottom={10}>프로필사진</Typography>
          {
            userimage !== '' && 
            <>
            {
              images.length === 0
              ?
              <TouchableOpacity 
                style={{borderWidth:1, borderColor:'#BDBDBD', padding:5, borderRadius:5}}
                onPress={alertChangePhoto}
              >
              <Typography fontSize={14} color='#8C8C8C'>사진 변경하기</Typography>
              </TouchableOpacity>
              :
              <TouchableOpacity 
                style={{borderWidth:1, borderColor:'#FF0000', padding:5, borderRadius:5}}
                onPress={handleChangeImage}
              >
              <Typography fontSize={14} color='#FF0000'>변경완료</Typography>
              </TouchableOpacity>
            }
            </>
          }
        </View>
        {
          userimage !== '' && images.length === 0
          ?
          <View style={{width:120, height:150, margin:5}}>
            <Image style={{width:'100%', height:'100%', resizeMode:'cover', borderRadius:10}} 
              source={{ uri: `${MainImageURL}/images/userimage/${userimage}`}}/>
          </View>
          :
          <>
            { images.length > 0
              ? 
              <View style={{flexDirection:'row'}}>
                <View style={{ width: 120, height: 150, margin: 5 }}>
                  <Image source={{ uri: images[0].uri }} style={{ width: '100%', height: '100%', borderRadius:10 }} />
                </View>
                <TouchableOpacity
                  onPress={()=>{setImages([]); setUserImage('')}}
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
          </>
        }
      </View>

      <Divider height={2}/>

      <View style={styles.section}>
        <Typography fontSize={18} marginBottom={10} fontWeightIdx={1}>기타</Typography>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
            props.navigation.navigate('Navi_Notifi', {screen: 'Notice'});
        }}>
          <Feather name="clipboard" size={20} color="#000" style={{marginRight:15}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >공지사항</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
           props.navigation.navigate("Question");
        }}>
          <AntDesign name="questioncircleo" size={20} color="#000" style={{marginRight:15}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >문의하기</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
           props.navigation.navigate("Report");
        }}>
          <MaterialCommunityIcons name="bullhorn-variant-outline" size={20} color="#000" style={{marginRight:15}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >신고하기</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
           props.navigation.navigate("Advertising");
        }}>
          <MaterialCommunityIcons name="advertisements" size={20} color="#000" style={{marginRight:13}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >광고 및 제휴</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
          props.navigation.navigate("Policy");
        }}>
          <MaterialIcons name="policy" size={20} color="#000" style={{marginRight:13}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >약관 및 정책</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
          props.navigation.navigate("PersonInfo");
        }}>
          <Entypo name="info" size={20} color="#000" style={{marginRight:12}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >개인정보처리방침</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
          props.navigation.navigate("BusinessInfo");
        }}>
          <FontAwesome name="building-o" size={20} color="#000" style={{marginRight:15}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >사업자정보</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          hitSlop={{ top: 15, bottom: 15 }}
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Typography color='#8C8C8C'>로그아웃</Typography>
        </TouchableOpacity> 
      </View>

      <TouchableOpacity
        hitSlop={{ top: 15, bottom: 15 }}
        style={styles.deleteAccountContainer}
        onPress={deleteAccount}
      >
        <View style={{padding:5, borderWidth:1, borderColor:'#EAEAEA', borderRadius:5}}>
          <Typography fontSize={10} fontWeightIdx={1} color='#8C8C8C'>회원탈퇴를 하시려면 여기를 눌러주세요</Typography>
        </View>
      </TouchableOpacity> 

      <View style={{marginBottom: 30, alignItems:'flex-end', marginRight:20}}>
                                     {/* MainURL확인하기 & splash.tsx & result.tsx(Login) 확인하기 */}
        <Typography fontSize={10} color='#8C8C8C'>버전정보 : {MainVersion}</Typography>
      
      </View>

    </ScrollView>
   
    <View style={ isProfileModalVisible ? styles.modalBackCover :  { display: 'none'}}></View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  section : {
    padding: 20,
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  infoImgBox: {
    width: 100,
    height: 100,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoImg: {
    width: 80,
    height: 80,
  },
  infoTextBox: {
    flex: 1,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35
  },
  bottomButtonRow: {
    flex:1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  logoutContainer : {
    flex: 1,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deleteAccountContainer : {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 20,
    height: 50,
  },
  modalBackCover : {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    opacity: 0.8
  },
  inputBox : {
    flexDirection:'row', 
    alignItems:'center', 
    height:60
  },
  input: {
    width:'85%',
    height: 60,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: '#333',
    textAlign:'center'
  }
});

export default MyPageMain;
