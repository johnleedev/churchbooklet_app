import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, NativeSyntheticEvent, TextInputChangeEventData, TouchableOpacity, Image } from 'react-native';
import AsyncGetItem from '../AsyncGetItem'
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import MainURL from "../../MainURL";
import MainImageURL from "../../MainImageURL";
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import { SubTitle } from '../Components/SubTitle';
import Loading from '../Components/Loading';

export default function ChurchSearchMain(props : any) {

  const sort = props.route.params.sort;

  interface ChurchsProps {
    id: number;
    churchName : string;
    religiousbody : string;
    churchAddress: string;
    churchPhone: string;
    churchPastor: string;
  }

  const [churchsViewList, setChurchsViewList] = useState<ChurchsProps[]>([]);
  const [inputValue, setInputValue] = useState('');  
  const [isInputValue, setIsInputValue] = useState<boolean>(true);  
  const [inputValueMessage, setInputValueMessage] = useState('');
  const [searchSelectResidence, setSearchSelectResidence] = useState<boolean>(true);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);


    // 검색박스 ----------------------------------------------------------------------

  const fetchPostsSearch = (text: string) => {
    axios.get(`${MainURL}/churchs/searchchurchs/${text}`).then((res) => {
      if (res.data !== false) {
        setIsResdataFalse(false);
        let copy: any = [...res.data];
        setChurchsViewList(copy);
      } else {
        setIsResdataFalse(true);
      }
    });
  };


  const changeInputValue = async(event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const inputText = event.nativeEvent.text;
    setInputValue(inputText);
    if (inputText.length === 0) {
      setInputValue('');
      setChurchsViewList([]);
      setIsInputValue(true);
      setInputValueMessage('');
    } else if (inputText.length > 0 && inputText.length < 2) {
      setIsInputValue(false);
      setInputValueMessage('2글자 이상으로 입력해주세요.');
    } 
    else {
      setIsInputValue(true);
      setInputValueMessage('');
      fetchPostsSearch(inputText);
    }
  };

  const handleResetPress = () => {
    setInputValue('');
    setChurchsViewList([]);
    setIsSelectedButton(false);
  }

  // 지역검색 ----------------------------------------------------------------------

  interface ResidenceProps {
    code: number;
    name : string;
  }
  
  const [isSelectedButton, setIsSelectedButton] = useState<boolean>(false);
  const [cities, setCities] = useState<ResidenceProps[]>([]);
  const [counties, setCounties] = useState<ResidenceProps[]>([]);
  const [isSelectedCityIndex, setIsSelectedCityIndex] = useState(0); 
  const [selectedCity, setSelectedCity] = useState('서울특별시');
  
  const religiousbodys = [
    {name: `구세군${'\n'}대한본영`, image: "구세군대한본영.jpg"},
    {name: `기독교대한${'\n'}감리회`, image: "기독교대한감리회.jpg"},
    {name: `기독교대한${'\n'}성결교회`, image: "기독교대한성결교회.jpg"},
    {name: `기독교대한${'\n'}하나님의성회`, image: "기독교대한하나님의성회.jpg"},
    {name: `기독교한국${'\n'}침례회`, image: "기독교한국침례회.jpg"},
    {name: `대한기독교${'\n'}나사렛성결회`, image: "대한기독교나사렛성결회.jpg"},
    {name: `대한예수교${'\n'}장로회고신`, image: "대한예수교장로회고신.jpg"},
    {name: `대한예수교${'\n'}장로회통합`, image: "대한예수교장로회통합.jpg"},
    {name: `대한예수교${'\n'}장로회합동`, image: "대한예수교장로회합동.jpg"},
    {name: `예수교대한${'\n'}성결교회`, image: "예수교대한성결교회.jpg"},
    {name: `한국기독교${'\n'}장로회`, image: "한국기독교장로회.jpg"},
    {name: `기타교단`, image: "기타교단.jpg"}
  ]
  
  const handleGetCities = async () => {
    try{
      const res = await axios.get(`https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=*00000000`);
      setCities(res.data.regcodes);
      handleGetCounties(res.data.regcodes[0]);
      
    } catch (error) {
      console.log(error);
    }
  };
 
   // 구/군의 리스트를 받아오는 함수
  const handleGetCounties = async (data:any) => {
    const cityCode = JSON.stringify(data.code);
      try{
        const cityPrefix = cityCode.slice(1, 3); // 도시 코드에서 앞의 두 자리를 추출
        const res  = await axios.get(`https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=${cityPrefix}*00000`);
        setCounties(res.data.regcodes.slice(1));
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(() => {
    handleGetCities();
  }, []);

  const fetchSelectedRegidence = async (county: string) => {
    
    await axios.get(`${MainURL}/churchs/selectedregidence/${selectedCity}/${county}`).then((res) => {
      if (res.data !== false) {
        setIsResdataFalse(false);
        let copy: any = [...res.data];
        setChurchsViewList(copy);
      } else {
        setIsResdataFalse(true);
      }
    });
  };



  const fetchSelectedReligiousbody = async (text: string) => {
    
    await axios.get(`${MainURL}/churchs/selectedreligiousbody/${text}`).then((res) => {
      if (res.data !== false) {
        setIsResdataFalse(false);
        let copy: any = [...res.data];
        setChurchsViewList(copy);
      } else {
        setIsResdataFalse(true);
      }
    });
  };

  return (
    <View style={styles.container}>
      
      
      {/* title */}
      <SubTitle title='교회 찾기' navigation={props.navigation}/>
                
      <Divider height={2} />

      <View style={styles.section}>
        
        <View style={styles.seachBar}>
          <View style={[styles.flexBox, { alignItems:"center"}]}>
            <Entypo name="magnifying-glass" size={22} color="#8B8B8B" style={{marginRight:13}}/> 
            <TextInput 
              placeholder={'교회명,담임목사이름,교회번호'}
              placeholderTextColor="#8C8C8C"
              value={inputValue}
              onChange={changeInputValue} 
              style={{height:'100%', flex:1, fontSize:16, color:'#333'}}
            />
            <TouchableOpacity 
              onPress={handleResetPress}
              style={{padding:5}}
            >
              <AntDesign  name="closecircle" size={18} color="#C1C1C1"/> 
            </TouchableOpacity>
          </View>
        </View>

        {!isInputValue && (
          <View style={{width:'100%', alignItems:'center', marginBottom:20}}>
          <Typography color='#F15F5F' fontSize={12}>
            {inputValueMessage}
          </Typography>
          </View>
        )}

        <ScrollView>
        {
          churchsViewList.length === 0 
          ?
          <>
          {
            inputValue === '' && !isSelectedButton
            ?
            <>

              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginVertical:20}}>
                <TouchableOpacity 
                  style={[styles.selectButton, {borderColor: searchSelectResidence ? '#333' : '#DFDFDF' }]}
                  onPress={()=>{setSearchSelectResidence(true);}}
                >
                  <Typography color={searchSelectResidence ? '#333' : '#DFDFDF'} fontWeightIdx={1}>지역검색</Typography> 
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.selectButton, {borderColor: searchSelectResidence ? '#DFDFDF' : '#333'}]}
                  onPress={()=>{setSearchSelectResidence(false)}}
                >
                  <Typography color={searchSelectResidence ? '#DFDFDF' : '#333'} fontWeightIdx={1}>교단검색</Typography> 
                </TouchableOpacity>
              </View>

              { 
                searchSelectResidence 
                ?
                // 지역선택 ------------------------------------------------------------------------------------------------
                <View style={{flexDirection:'row'}}>
                  <View style={{width:'50%'}}> 
                  {
                    cities.map((item:any, index:any)=>{
                      return(
                        <TouchableOpacity
                          key={index}
                          style={{height:50, alignItems:'center', justifyContent:'center', borderBottomWidth:1, borderColor:"#BDBDBD",
                                  backgroundColor: isSelectedCityIndex === index ? '#fff' : '#EAEAEA'}}
                          onPress={()=>{
                            handleGetCounties(item);
                            setSelectedCity(item.name);
                            setIsSelectedCityIndex(index);
                          }}
                        >
                          <Typography>{item.name}</Typography>
                        </TouchableOpacity>
                      )
                    })
                  }
                  </View>
                  <View style={{width:'50%'}}> 
                  {
                    counties.map((item:any, index:any)=>{
                      const copy = item.name.split(' ');
                      return(
                        <TouchableOpacity
                          key={index}
                          style={{height:50, alignItems:'center', justifyContent:'center', borderBottomWidth:1, borderLeftWidth:1, borderBottomColor:"#BDBDBD"}}
                          onPress={()=>{
                            setIsSelectedButton(true);
                            fetchSelectedRegidence(copy[1]);
                          }}
                        >
                          <Typography>{copy[1]}</Typography>
                        </TouchableOpacity>
                      )
                    })
                  }
                  </View>
                </View>
                :
                // 교단선택 ------------------------------------------------------------------------------------------------
                <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
                  {
                    religiousbodys.map((item:any, index:any)=>{

                      return(
                        <TouchableOpacity
                          key={index}
                          style={{width:'48%', height:60, alignItems:'center', justifyContent:'center', marginVertical:5,
                                  flexDirection:'row', borderWidth:1, borderColor:"#BDBDBD", borderRadius:10}}
                          onPress={()=>{
                            setIsSelectedButton(true);
                            fetchSelectedReligiousbody(item);
                          }}
                        >
                          <View style={{width:'30%', alignItems:'center', justifyContent:"center"}}>
                            <Image
                              source={{uri: `${MainImageURL}/images/app/${item.image}`}}
                              style={{width:35, height:35, resizeMode:'contain'}}>
                            </Image>
                          </View>
                          <View style={{width:'70%'}}>
                            <Typography>{ item.name }</Typography>
                          </View>
                        </TouchableOpacity>
                      )
                    })
                  }
                </View>
              }
            </>
            :
            <>
            {
              isResdataFalse
              ?
              <>
                <View style={{alignItems:'center', justifyContent:'center', paddingTop:20}}>
                  <Typography color="#333">검색결과가 없습니다.</Typography>
                  <TouchableOpacity 
                    style={{alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#EAEAEA', marginTop:30, padding:10, borderRadius:10}}
                    onPress={()=>{
                      setInputValue('');
                      setChurchsViewList([]);
                      setIsSelectedButton(false);
                    }}
                  >
                    <Typography color="#333">다시 검색하기</Typography>
                  </TouchableOpacity >
                </View>
              </>
              :
              <View style={{flex:1, width:'100%', height:'100%'}}>
                <Loading />
              </View>
            }
            </>
          }
          </>
          :
          <>
            {
              churchsViewList.map((item:any, index:any)=>{

                return (
                  <View key={index} >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                          flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginVertical:10,
                          borderWidth:1, borderColor:"#EAEAEA", borderRadius:10, padding:10
                        }}
                      onPress={()=>{
                        props.navigation.navigate('ChurchSearchDetail', { data : item, sort : sort})
                      }}
                    >
                      <View>
                        <Typography fontSize={20} fontWeightIdx={1} marginBottom={10}>{item.churchName} </Typography>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                          <Typography color='#8C8C8C' marginBottom={3}>교단: {item.religiousbody}</Typography>
                          <Image
                            source={{uri: `${MainImageURL}/images/app/${item.religiousbody}.jpg`}}
                            style={{width:20, height:20, resizeMode:'contain', marginLeft:5}}>
                          </Image>
                        </View>
                        <Typography color='#8C8C8C' marginBottom={3}>지역: {item.churchAddressCity} {item.churchAddressCounty}</Typography>
                        <Typography color='#8C8C8C'>담임: {item.churchPastor} 목사</Typography>
                      </View>
                      <AntDesign name='right'/>
                    </TouchableOpacity>
                  </View>
                )
              })
            }
            <View style={{alignItems:'center', justifyContent:'center', paddingTop:10}}>
              <TouchableOpacity 
                style={{alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#EAEAEA', marginTop:30, padding:10, borderRadius:10}}
                onPress={()=>{
                  setInputValue('');
                  setChurchsViewList([]);
                  setIsSelectedButton(false);
                }}
              >
                <Typography color="#333">다시 검색하기</Typography>
              </TouchableOpacity >
            </View>
          </>
        } 
        <View style={{height:300}}></View>
        </ScrollView>
      </View>
     
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
  selectButton : {
    width:'48%',
    height: 50,
    borderWidth:1, 
    borderRadius:5, 
    paddingHorizontal:15,
    paddingVertical:5,
    flexDirection:'row', 
    alignItems:'center',
    justifyContent:'center'
  },
  seachBar:{
    borderWidth:1,
    borderRadius:5,
    height: 70,
    borderColor: '#EAEAEA',
    flexDirection:"row",
    alignItems:"center",
    paddingHorizontal:15,
    marginVertical:10
  },
  flexBox:{
    flexDirection:'row',
    justifyContent:'space-between',
  },
});

