import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Text, Linking, Image, ScrollView} from 'react-native';
import AsyncGetItem from '../AsyncGetItem'
import axios from 'axios';
import MainURL from "../../MainURL";
import MainImageURL from "../../MainImageURL";
import { Typography } from '../Components/Typography';
import { Title } from '../Components/Title';
import { Divider } from '../Components/Divider';
import { ButtonBox } from '../Components/ButtonBox';
import { SubTitle } from '../Components/SubTitle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NaverMapView, { Marker, Circle } from "react-native-nmap";
import { useRecoilState } from 'recoil';
import { recoilLoginData } from '../RecoilStore';

export default function ChurchSearchDetail (props : any) {

  const churchData = props.route.params.data;
  const sort = props.route.params.sort;

  const [userLoginData, setUserLoginData] = useRecoilState(recoilLoginData);

  const [asyncGetData, setAsyncGetData] = useState<any>();
  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      setAsyncGetData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    asyncFetchData();
  }, []);
 
 
  const addressQuery = `${churchData.churchAddressCity} ${churchData.churchAddressCounty} ${churchData.churchAddressRest}`
  const [addressLatitude, setAddressLatitude] = useState<number>(0);
  const [addressLongitude, setAddressLongitude] = useState<number>(0);

  const addressAPI = async () => {
    try {
      const address = await axios.get(`https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${addressQuery}`, {
        headers : {
          "X-NCP-APIGW-API-KEY-ID": "p0xl3fa4si",
          "X-NCP-APIGW-API-KEY": "iO5Yq3szE59M2GUCxQQbR0zCXt8cECudDfUpE17s",
        }
      });
      setAddressLatitude(parseFloat(address.data.addresses[0].y));
      setAddressLongitude(parseFloat(address.data.addresses[0].x));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    addressAPI();
  }, []);

  const P0 = {latitude: addressLatitude, longitude: addressLongitude};


  const TextBox = ({ name, text }: { name: string; text: any }) => (
    <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:20, marginVertical:10}}>
      <View style={{width:'20%', alignItems:'center'}}>
        <Typography color='#8C8C8C'>{name}</Typography>
      </View>
      <View style={{width:2, height:20, backgroundColor:'#EAEAEA', marginHorizontal:10}}></View>
      <View style={{width:'70%', flexDirection:'row', flexWrap:'wrap'}}>
        <Typography>{text}</Typography>
      </View>
    </View>
  );

  const alertRegister = () => { 

    if (asyncGetData.userChurchKey === null) {
      Alert.alert('이 교회를 내교회로 등록하시겠습니까?', `교회명 : ${churchData.churchName}`, [
        { text: '취소', onPress: () => { return }},
        { text: '등록하기', onPress: () => handleRegister() }
      ]);
    } else {
      Alert.alert('이미 다른 교회가 내교회로 등록되어 있습니다. 이 교회를 내교회로 등록하시겠습니까?', `교회명 : ${churchData.churchName}`, [
        { text: '취소', onPress: () => { return }},
        { text: '등록하기', onPress: () => handleRegister() }
      ]);
    }
  }

  const handleRegister = async () => {
    if (sort === 'login') {
      const copy = {...userLoginData}
      copy.userChurch = churchData.churchName;
      copy.userChurchKey = churchData.id;
      setUserLoginData(copy);
      props.navigation.navigate('Navi_Login', {screen : 'Logister2'});
    } else {
      axios
      .post(`${MainURL}/churchs/registermychurch`, {
        userAccount : asyncGetData.userAccount,
        churchID : churchData.id,
        churchName : churchData.churchName
      })
      .then(async (res) => {
        if (res.data === true) {
          Alert.alert('등록되었습니다.')
          await AsyncStorage.setItem('church', churchData.churchName);
          await AsyncStorage.setItem('churchkey', JSON.stringify(churchData.id));
          props.navigation.navigate('홈');
        } else {
          Alert.alert('다시 시도해주세요.')
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  };
  
  return (
    <View style={styles.container}>
      
      
      {/* title */}
      <SubTitle title='내교회 등록하기' navigation={props.navigation}/>
                
      <Divider height={2} />

      <ScrollView style={[styles.section]}>

        <View style={{marginVertical:10, alignItems:'center'}}>
          <Typography marginBottom={10} fontSize={18} fontWeightIdx={1}>{churchData.churchName}</Typography>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Image
              source={{uri: `${MainImageURL}/images/app/${churchData.religiousbody}.jpg`}}
              style={{width:20, height:20, resizeMode:'contain', marginRight:5}}>
            </Image>
            <Typography color='#8C8C8C'>{churchData.religiousbody}</Typography>
          </View>
        </View>
        <TextBox name='교회번호' text={`${churchData.id}`}/>
        <TextBox name='지역' text={`${churchData.churchAddressCity} ${churchData.churchAddressCounty}`}/>
        <TextBox name='주소' text={`${churchData.churchAddressRest}`}/>
        <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:20, marginVertical:10}}>
          <View style={{width:'20%', alignItems:'center'}}>
            <Typography color='#8C8C8C'>전화</Typography>
          </View>
          <View style={{width:2, height:20, backgroundColor:'#EAEAEA', marginHorizontal:10}}></View>
          <TouchableOpacity
            style={{width:'70%'}}
            onPress={()=>{Linking.openURL(`tel:${churchData.churchPhone}`)}}
          >
            <Typography color='#0054FF'><Text style={{textDecorationLine:'underline'}}>{churchData.churchPhone}</Text></Typography>
          </TouchableOpacity>
        </View>
        <TextBox name='담임목사' text={churchData.churchPastor}/>

        <View style={{height:200, marginTop:20, marginBottom:30}}>
          <NaverMapView 
            style={{width: '100%', height: '100%'}}
            showsMyLocationButton={true}
            center={{...P0, zoom: 12}}
          >
            <Marker 
              coordinate={P0} 
            />
          </NaverMapView>
        </View>

        <ButtonBox leftText='뒤로가기' leftFunction={()=>{props.navigation.goBack();}} rightText='내교회로등록' rightFunction={alertRegister} />
        <View style={{height:100}}></View>     
      </ScrollView>      
      

    </View> 
   );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom:30
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

