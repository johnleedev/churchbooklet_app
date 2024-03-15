import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import axios from 'axios';
import MainURL from "../../MainURL";
import MainImageURL from "../../MainImageURL";
import { Divider } from '../Components/Divider';
import { ButtonBox } from '../Components/ButtonBox';
import { SubTitle } from '../Components/SubTitle';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {launchImageLibrary, ImageLibraryOptions, Asset} from 'react-native-image-picker';
import Loading from '../Components/Loading';
import { Typography } from '../Components/Typography';
import { Title } from '../Components/Title';

export default function ChurchImageRevise (props : any) {

  const churchData = props.route.params.data;
  const userAccount = props.route.params.userAccount;

  const [images, setImages] = useState<Asset[]>([]);
  const [churchImage, setChurchImage] = useState(churchData?.churchImage);

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
    setImageLoading(true);
    try {
      await axios.post(`${MainURL}/churchs/deleteimage`, {
        userAccount : userAccount,
        imageName : churchImage,
        churchKey : churchData.id
      });
      setChurchImage('');
      setImages([]);
      setImageLoading(false);
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
        setChurchImage(copy);
      }
      setImageLoading(false);
    }) 
  }

   // 사진변경하기 함수 -----------------------------------------------------------------
   const handleChangeImage = async () => {

    const getParams = {
      userAccount : userAccount,
      churchImage : churchImage,
      churchKey : churchData.id
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
      await axios.post(`${MainURL}/churchs/changechurchimage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: getParams,
      }).then((res) => {
        console.log(res.data);
        if (res.data === true) {
          Alert.alert('변경되었습니다!');
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
    <View style={styles.container}>
     
      {/* title */}
      <Title title='교회 사진 수정하기' enTitle=''/>
                
      <Divider height={2} />

      <View style={[styles.section, {flex:1}]}>
        {
          churchImage !== '' && images.length === 0
          ?
          <View style={{alignItems:'center'}}>
            <View style={{width:300, height:200, margin:5}}>
              <Image style={{width:'100%', height:'100%', resizeMode:'cover', borderRadius:10}} 
                source={{ uri: `${MainImageURL}/images/churchimage/${churchData?.churchImage}`}}/>
            </View>
          </View>
          :
          <>
            { images.length > 0
              ? 
              <View style={{flexDirection:'row', justifyContent:'center'}}>
                <View style={{ width: 300, height: 200, margin: 5 }}>
                  <Image source={{ uri: images[0].uri }} style={{ width: '100%', height: '100%', borderRadius:10 }} />
                </View>
                <TouchableOpacity
                  onPress={()=>{setImages([]); setChurchImage('')}}
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
                <View style={{alignItems:'center'}}>
                  <View style={{position:'absolute', alignItems:'center', justifyContent:'center'}}>
                    <View style={{width:300, height:200}}>
                      <Loading />
                    </View>
                  </View>
                </View>
                :
                <View style={{alignItems:'center'}}>
                  <TouchableOpacity
                    onPress={showPhoto}
                  >
                    <View style={{width:300, height:200, borderWidth:1, borderColor:'#8C8C8C', borderRadius:5,
                                  alignItems:'center', justifyContent:'center', marginHorizontal:5, marginVertical:10}}>
                      <Entypo name="plus" size={20} color="#8C8C8C"/>
                    </View>
                  </TouchableOpacity>
                </View>
              }
              </>
            }
          </>
        }
        {
          churchImage !== '' &&
          <View style={{alignItems:'center', marginTop:20}}>
            <TouchableOpacity 
              style={{borderWidth:1, borderColor:'#BDBDBD', padding:5, borderRadius:5}}
              onPress={alertChangePhoto}
            >
            <Typography color='#8C8C8C'>사진 변경하기</Typography>
            </TouchableOpacity>
          </View>
        }
      </View>
      

      <ButtonBox leftText='뒤로가기' leftFunction={()=>{props.navigation.replace('ChurchMain');}} rightText='완료' rightFunction={handleChangeImage} />
      <View style={{height:20}}></View>

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
  },  
  
});

