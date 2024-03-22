import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Linking, Modal, TextInput, Alert, Platform } from 'react-native';
import MainImageURL from "../../MainImageURL";
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import { SubTitle } from '../Components/SubTitle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown';
import {launchImageLibrary, ImageLibraryOptions, Asset} from 'react-native-image-picker';
import { ButtonBox } from '../Components/ButtonBox';
import axios from 'axios';
import MainURL from "../../MainURL";
import Loading from '../Components/Loading';
import Entypo from 'react-native-vector-icons/Entypo';

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

  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const imageToggleModal = () => {
    setImageModalVisible(!isImageModalVisible);
  };
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const profileToggleModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  const data = props.route.params.data;
  const sort = props.route.params.sort;

  const [userAccount, setUserAccount] = useState(data.userAccount);
  const [userName, setUserName] = useState(data.userName);
  const [userPhone, setUserPhone] = useState(data.userPhone);
  const [userDuty, setUserDuty] = useState(data.userDuty);
  const [images, setImages] = useState<Asset[]>([]);
  const [userimage, setUserImage] = useState('');
  const optionsDuty = ["성도", "주일학교", "집사", "안수집사", "권사", "장로", "선교사", "전도사", "목사"];

  // 핸드폰 번호변경
  const onChangeUserPhone = (text : any) => {
    const userPhoneRegex = /^[0-9]*$/
    if (!userPhoneRegex.test(text)) {
      Alert.alert('숫자만 입력해주세요');
    } else {
      setUserPhone(text);  
    }
  };

  const changeProfile = async () => {
    axios
      .post(`${MainURL}/list/userprofilerevise`, {
        userAccount : userAccount,
        userName: userName, userPhone: userPhone, 
        userDuty: userDuty
      })
      .then((res) => {
        if (res.data === true) {
          Alert.alert('수정되었습니다.');
          profileToggleModal();
          props.navigation.replace('ListMain');
        } else {
          Alert.alert(res.data)
        }
      })
      .catch(() => {
        console.log('실패함')
      })
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
       await axios.post(`${MainURL}/list/userprofileimagerevise`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
         params: getParams,
       }).then((res) => {
         if (res.data) {
           Alert.alert('변경되었습니다!');
           setImages([]);
           imageToggleModal();
           props.navigation.replace('ListMain');
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

  const alertImageToggleModal = (item:any) => { 
    Alert.alert('이 버튼은 담당 목회자에게만 노출되며, 사진을 대신 등록하는 것은, 최초 1회만 가능합니다.', `사진을 변경하시겠습니까?`, [
      { text: '취소', onPress: () => { return }},
      { text: '확인', onPress: () => { data.userChurchKey === '11' ? Alert.alert('테스트입니다.') : imageToggleModal() } }
    ]);
  }

  const alertProfileToggleModal = (item:any) => { 
    Alert.alert('이 버튼은 담당 목회자에게만 노출됩니다.', `프로필 정보를 변경하시겠습니까?`, [
      { text: '취소', onPress: () => { return }},
      { text: '확인', onPress: () => { data.userChurchKey === '11' ? Alert.alert('테스트입니다.') : profileToggleModal() } }
    ]);
  }

  const handleSendSms = () => {
    Linking.openURL(`sms:${data.userPhone}`)
  };
  
  const handleCall = () => {
    Linking.openURL(`tel:${data.userPhone}`)
  };
  
  return (
    <View style={styles.container}>
        
      {/* title */}
      <SubTitle title='상세정보' enTitle='Detail' navigation={props.navigation}/>
                
      <Divider height={2}/>      

      <View style={styles.section}>

        {
          sort === 'church' && (data.userImage === null || data.userImage === "") &&
          <TouchableOpacity style={{position:'absolute', top:10, right:10, padding:15}}
            onPress={alertImageToggleModal}
            >
            <AntDesign name='setting' size={20} color='#000'/>
          </TouchableOpacity>
        }
        <Modal
          animationType="slide"
          transparent={true}
          visible={isImageModalVisible}
          onRequestClose={imageToggleModal}
        >
          <View style={{ width: '100%', position: 'absolute', top:80, borderRadius: 20, backgroundColor: 'white', 
                        padding: 20}}>
            <Typography marginBottom={10} fontWeightIdx={1}>프로필 사진 변경</Typography>
            <TouchableOpacity style={{position:'absolute', top:5, right:10, padding:15}}
              onPress={imageToggleModal}
              > 
                <AntDesign name='close' size={20} color='#000'/>
            </TouchableOpacity>
            <Divider height={3} marginVertical={10}/>
            
            <View style={styles.section}>
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
            <View style={{height:100, justifyContent:'flex-end'}}>
              <ButtonBox leftText='취소' leftFunction={imageToggleModal} rightText='변경' rightFunction={handleChangeImage} />
            </View>
          </View>
        </Modal>

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
      </View>

      <View style={{}}>

        {
          sort === 'church' &&
          <TouchableOpacity style={{position:'absolute', top:-15, right:10, padding:15, zIndex:9}}
            hitSlop={{ top: 15, bottom: 15 }}
            onPress={alertProfileToggleModal}
            >
            <AntDesign name='setting' size={20} color='#000'/>
          </TouchableOpacity>
        }

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

        <View style={{height:100, justifyContent:'center'}}>
          <TextBox name='이름' text={data.userName}/>
          <TextBox name='직분' text={data.userDuty === null || data.userDuty === '' ? '입력된 정보가 없습니다.' : data.userDuty}/>
          <TextBox name='번호' text={data.userPhone === null || data.userPhone === '' ? '입력된 정보가 없습니다.' : data.userPhone}/>
        </View>

        {
          data.userPhone !== null && data.userPhone !== '' &&
          <View style={{flexDirection:'row', justifyContent:'center', marginTop: 50}}>
              
          <View style={styles.ButtonBox}>
            <TouchableOpacity 
              style={[styles.Button, {borderColor: '#333'}]} 
              onPress={handleSendSms}>
              <Typography fontWeightIdx={1}>문자보내기</Typography>
            </TouchableOpacity>
          </View>

          <View style={styles.ButtonBox}>
            <TouchableOpacity 
              style={[styles.Button, {borderColor: '#333'}]} 
              onPress={handleCall}>
              <Typography fontWeightIdx={1}>전화하기</Typography>
            </TouchableOpacity>
          </View>

        </View>
        }

      </View>
      <View style={ isImageModalVisible ? styles.modalBackCover :  { display: 'none'}}></View>
      <View style={ isProfileModalVisible ? styles.modalBackCover :  { display: 'none'}}></View>

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
  ButtonBox: {
    width: '48%',
    alignItems:'center',
    marginBottom:20,
  },
  Button: {
    width: '90%',
    borderWidth:1, 
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
  },
  modalBackCover : {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    opacity: 0.8
  },
});

