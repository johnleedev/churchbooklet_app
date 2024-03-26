import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import MainURL from "../../MainURL";
import SelectDropdown from 'react-native-select-dropdown'
import { Divider } from '../Components/Divider';
import { ButtonBox } from '../Components/ButtonBox';
import { SubTitle } from '../Components/SubTitle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Typography } from '../Components/Typography';

export default function ChurchProfileRevise (props : any) {

  const churchData = props.route.params.data;
  const userAccount = props.route.params.userAccount;

  const [churchName, setChurchName] = useState(churchData.churchName);
  const [religiousbody, setReligiousbody] = useState(churchData.religiousbody);
  const [churchAddressCity, setChurchAddressCity] = useState(churchData.churchAddressCity);
  const [churchAddressCounty, setChurchAddressCounty] = useState(churchData.churchAddressCounty);
  const [churchAddressRest, setChurchAddressRest] = useState(churchData.churchAddressRest);
  const [churchPhone, setChurchPhone] = useState(churchData.churchPhone);
  const [churchPastor, setChurchPastor] = useState(churchData.churchPastor);



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


  const handleChurchRevise = () => {
    axios
    .post(`${MainURL}/churchs/churchinforevise`, {
      userAccount : userAccount,
      churchKey : churchData.id,
      churchName : churchName,
      religiousbody : religiousbody,
      churchAddressCity : churchAddressCity, 
      churchAddressCounty : churchAddressCounty,
      churchAddressRest: churchAddressRest,
      churchPhone: churchPhone,
      churchPastor : churchPastor
    })
    .then((res) => {
      if (res.data === true) {
        Alert.alert('변경되었습니다!');
      } else {
        Alert.alert('다시 시도해 주세요.');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }; 

  


  
  return (
    <View style={styles.container}>
     
      {/* title */}
      <SubTitle title='교회 정보 수정하기' navigation={props.navigation}/>
                
      <Divider height={2} />

      <ScrollView style={[styles.section, {flex:1}]}>
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
              defaultButtonText={religiousbody}
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
              defaultButtonText={churchAddressCity}
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
              defaultButtonText={churchAddressCounty === undefined ? '시/도 를 선택해주세요' : churchAddressCounty}
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
      
        <ButtonBox leftText='뒤로가기' leftFunction={()=>{props.navigation.replace('ChurchMain');}} rightText='완료' rightFunction={handleChurchRevise} />
        <View style={{height:100}}></View>

      </ScrollView>

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

