import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Alert, Platform, Image, TouchableOpacity } from 'react-native';
import {launchImageLibrary, ImageLibraryOptions, Asset} from 'react-native-image-picker';
import axios from 'axios';
import MainURL from "../../MainURL";
import { Typography } from '../Components/Typography';
import SelectDropdown from 'react-native-select-dropdown'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { Divider } from '../Components/Divider';
import { ButtonBox } from '../Components/ButtonBox';
import { SubTitle } from '../Components/SubTitle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../Components/Loading';


export default function ChurchInfoInput(props : any) {

  const asyncGetData = props.route.params.asyncGetData;

  const [churchName, setChurchName] = useState(asyncGetData.userChurch);
  const [religiousbody, setReligiousbody] = useState('');
  const [churchAddressCity, setChurchAddressCity] = useState('');
  const [churchAddressCounty, setChurchAddressCounty] = useState('');
  const [churchAddressRest, setChurchAddressRest] = useState('');
  const [churchPhone, setChurchPhone] = useState('');
  const [churchPastor, setChurchPastor] = useState(asyncGetData.userName);
  const [images, setImages] = useState<Asset[]>([]);
  const [imageNames, setImageNames] = useState('');
  
  
  // 교단선택 ----------------------------------------------------------------------
  const optionReligiousbody = [
    "선택", "구세군대한본영", "기독교대한감리회", "기독교대한성결교회", "기독교대한하나님의성회", "기독교한국침례회", "대한기독교나사렛성결회",
    "대한예수교장로회(고신)", "대한예수교장로회(통합)", "대한예수교장로회(합동)", "대한예수교장로회(기타)", "예수교대한성결교회",
    "한국기독교장로회", "기타독립교단"
  ]

  // 지역선택 ----------------------------------------------------------------------

  interface ResidenceProps {
    code: number;
    name : string;
  }

  const [cities, getCities] = useState<ResidenceProps[]>([]);
  const [optionsCities, setOptionsCities] = useState([]);
  const [counties, getCounties] = useState<ResidenceProps[]>([]);
  const [optionsCounties, setOptionsCounties] = useState([]);

  

  const handleGetCities = async () => {
    try{
      const res = await axios.get(`https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=*00000000`);
      getCities(res.data.regcodes);
      const names = res.data.regcodes.map((item:any) => item.name);
      setOptionsCities(names);
    } catch (error) {
      console.log(error);
    }
  };

 
   // 구/군의 리스트를 받아오는 함수
  const handleGetCounties = async (data:any) => {
  const cityName = data[0].name;
  const cityCode = JSON.stringify(data[0].code);

    try{
      const cityPrefix = cityCode.slice(1, 3); // 도시 코드에서 앞의 두 자리를 추출
      const res  = await axios.get(`https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=${cityPrefix}*00000`);
      getCounties(res.data.regcodes);
      const names = res.data.regcodes.map((item:any) => item.name.replace(`${cityName}`, '').trim());
      setOptionsCounties(names);
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    handleGetCities();
  }, []);

  const handleCitiesChange = (selected : any) => {
    const selectedData = cities.filter((item:any)=> item.name === selected)
    handleGetCounties(selectedData);
  };
  
  // 교회 전화 번호 입력
  const onChangeChurchPhone = (text : any) => {
    const userPhoneRegex = /^[0-9]*$/
    if (!userPhoneRegex.test(text)) {
      Alert.alert('숫자만 입력해주세요');
    } else {
      setChurchPhone(text);  
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
        const copy = `${asyncGetData.userAccount}_${uris[0].fileName}`
        uris[0].fileName = copy
        setImages(uris);
        setImageNames(copy);
        setImageLoading(false);
      }
    }) 
  }

  // 교회 등록 하기 함수 -----------------------------------------------------------------
  const createPost = async () => {

    const getParams = {
      userAccount : asyncGetData.userAccount,
      churchName : churchName,
      religiousbody : religiousbody,
      churchAddressCity : churchAddressCity, 
      churchAddressCounty : churchAddressCounty,
      churchAddressRest: churchAddressRest,
      churchPhone: churchPhone,
      churchPastor : churchPastor,
      churchImage : imageNames,
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
        await axios.post(`${MainURL}/churchs/registerwithimage`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: getParams,
        }).then(async (res) => {
          if (res.data.success === true) {
            await AsyncStorage.setItem('church', churchName);
            await AsyncStorage.setItem('churchkey', JSON.stringify(res.data.churchKey));
            Alert.alert("입력되었습니다.");
            props.navigation.replace('ChurchMain');
          } else {
            Alert.alert("다시 시도하세요.");
          }
        })
        .catch(() => {
          console.log('실패함');
        });
      } else {
        // 사진 미포함
        await axios.post(`${MainURL}/churchs/registerwithoutimage`, getParams)
        .then(async (res) => {
          if (res.data.success === true) {
            await AsyncStorage.setItem('church', churchName);
            await AsyncStorage.setItem('churchkey', JSON.stringify(res.data.churchKey));
            Alert.alert("입력되었습니다.");
            props.navigation.replace('ChurchMain');
          } else {
            Alert.alert("다시 시도하세요.");
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

  const alertRegister = () => { 
    if (churchName && religiousbody && churchAddressRest && churchPhone) {
      Alert.alert('다음 내용으로 등록하시겠습니까?',
`
교회명 : ${churchName}
교단 : ${religiousbody}
교회주소 : ${churchAddressCity} ${churchAddressCounty} ${churchAddressRest}
교회번호 : ${churchPhone}
담임목사 : ${churchPastor}

`, [
      { text: '취소', onPress: () => { return }},
      { text: '확인', onPress: () => createPost() }
    ]);
    } else {
      Alert.alert('빈칸을 채워주세요')
    }
    
  }

  const closeDetail = () => {
    props.navigation.goBack();
  };

  return (
    optionsCities.length === 0
    ?  (
    <View style={{flex:1, width:'100%', height:'100%'}}>
      <Loading />
    </View>
    ) : (
    <View style={styles.container}>
      
      
      {/* title */}
      <SubTitle title='교회정보입력' navigation={props.navigation}/>
                
      <Divider height={2} />

      <ScrollView style={styles.section}>


        <View style={{marginVertical:5}}>
          <Typography color='#8C8C8C' fontWeightIdx={1}>교회명 <Typography color='#E94A4A'>*</Typography></Typography>
          <TextInput
            style={[styles.input, {width: '100%', marginBottom:30}]}
            placeholder="교회명"
            placeholderTextColor='#5D5D5D'
            onChangeText={(e)=>{setChurchName(e)}}
            value={churchName}
          />
        </View>

        <View style={{marginVertical:5, marginBottom:20}}>
          <Typography color='#8C8C8C' fontWeightIdx={1}>교단 <Typography color='#E94A4A'>*</Typography></Typography>
          <View style={styles.selectDropdown}>
            <Typography fontSize={14} color='#8C8C8C'>교단</Typography>
            <SelectDropdown
              data={optionReligiousbody}
              onSelect={(selectedItem, index) => {
                setReligiousbody(selectedItem);
              }}
              defaultButtonText={optionReligiousbody[0]}
              buttonStyle={{width:'85%', height:30, backgroundColor:'#fff'}}
              buttonTextStyle={{fontSize:16}}
              dropdownStyle={{width:250, borderRadius:10}}
              rowStyle={{ width:250, height:60}}
              rowTextStyle={{fontSize:16}}
            />
            <AntDesign name='down' size={12} color='#8C8C8C'/>
          </View>
        </View>
        
        <View style={{marginVertical:5}}>
          <Typography color='#8C8C8C' fontWeightIdx={1}>주소 <Typography color='#E94A4A'>*</Typography></Typography>
          <View style={styles.selectDropdown}>
            <Typography fontSize={14} color='#8C8C8C'>시/도</Typography>
            <SelectDropdown
              data={optionsCities}
              onSelect={(selectedItem, index) => {
                handleCitiesChange(selectedItem);
                setChurchAddressCity(selectedItem);
              }}
              defaultButtonText={optionsCities[0]}
              buttonStyle={{width:'85%', height:30, backgroundColor:'#fff'}}
              buttonTextStyle={{fontSize:16}}
              dropdownStyle={{width:250, borderRadius:10}}
              rowStyle={{ width:250, height:60}}
              rowTextStyle={{fontSize:16}}
            />
            <AntDesign name='down' size={12} color='#8C8C8C'/>
          </View>
          <View style={styles.selectDropdown}>
            <Typography fontSize={14} color='#8C8C8C'>구/군</Typography>
            <SelectDropdown
              data={optionsCounties}
              onSelect={(selectedItem, index) => {
                setChurchAddressCounty(selectedItem);
              }}
              defaultButtonText={optionsCounties[0] === undefined ? '시/도 를 선택해주세요' : optionsCounties[1]}
              buttonStyle={{width:'85%', height:30, backgroundColor:'#fff'}}
              buttonTextStyle={{fontSize:16}}
              dropdownStyle={{width:250, borderRadius:10}}
              rowStyle={{ width:250, height:60}}
              rowTextStyle={{fontSize:16}}
            />
            <AntDesign name='down' size={12} color='#8C8C8C'/>
          </View>
          <TextInput
            style={[styles.input, {width: '100%', marginBottom:30}]}
            placeholder="나머지주소"
            placeholderTextColor='#5D5D5D'
            onChangeText={(e)=>{setChurchAddressRest(e)}}
            value={churchAddressRest}
          />
        </View>
        
        <View style={{marginVertical:5}}>
          <Typography color='#8C8C8C' fontWeightIdx={1}>전화 <Typography color='#E94A4A'>*</Typography></Typography>
          <TextInput
            style={[styles.input, {width: '100%', marginBottom:30}]}
            placeholder=" ' - '를 제외하고 입력해주세요"
            placeholderTextColor='#5D5D5D'
            onChangeText={onChangeChurchPhone}
            value={churchPhone}
          />
        </View>
        
        <View style={{marginVertical:5}}>
          <Typography color='#8C8C8C' fontWeightIdx={1}>담임목사이름 <Typography color='#E94A4A'>*</Typography></Typography>
          <TextInput
            style={[styles.input, {width: '100%', marginBottom:30}]}
            placeholder="담임목사이름"
            placeholderTextColor='#5D5D5D'
            onChangeText={(e)=>{setChurchPastor(e)}}
            value={churchPastor}
          />
        </View>

        <View style={{marginVertical:5, marginBottom:30}}>
          {/* 사진 첨부 */}
          <Typography color='#8C8C8C' fontWeightIdx={1}>교회 대표 사진 <Typography color='#E94A4A'>*</Typography></Typography>
          <View style={{alignItems:'center'}}>
            { images.length > 0
              ? 
              <View style={{flexDirection:'row'}}>
                <View style={{ width: 300, height: 200, margin: 5 }}>
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
                  <View style={{width:300, height:200}}>
                    <Loading />
                  </View>
                </View>
                :
                <TouchableOpacity
                  onPress={showPhoto}
                >
                  <View style={{width:300, height:200, borderWidth:1, borderColor:'#8C8C8C', borderRadius:5,
                                alignItems:'center', justifyContent:'center', marginHorizontal:5, marginVertical:10}}>
                    <Entypo name="plus" size={20} color="#8C8C8C"/>
                  </View>
                </TouchableOpacity>
              }
              </>
            }
          </View>
        </View>
        
        <ButtonBox leftFunction={closeDetail} leftText='취소' rightFunction={alertRegister} rightText='등록하기'/>
        <View style={{height:100}}></View>
      </ScrollView>
     
    </View> 
    )
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
    color: '#333',
    fontSize:16
  },  
  selectDropdown : {
    borderWidth:1, 
    borderRadius:5, 
    borderColor:'#DFDFDF', 
    paddingHorizontal:15,
    paddingVertical:5,
    flexDirection:'row', 
    alignItems:'center',
    marginVertical:5
  }
});

