import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert, TextInput, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import AsyncGetItem from '../AsyncGetItem'
import axios from 'axios';
import MainURL from "../../MainURL";
import { Typography } from '../Components/Typography';
import { Title } from '../Components/Title';
import { Divider } from '../Components/Divider';
import Loading from '../Components/Loading';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

interface ChurchsProps {
  id: number;
  userAccount : string;
}

interface UserProps {
  id: number;
  userAccount : string;
  userName : string;
  userPhone : string;
  userDuty: string;
  userChurchKey: string;
  userAuthKey : string;
  profileSet : string;
}

export default function ListMain(props : any) {

  const [refresh, setRefresh] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);

  // AsyncGetData
  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const asyncFetchData = async () => {
    setIsLoading(true);
    try {
      const data = await AsyncGetItem();
      setAsyncGetData(data);
      if (data?.userChurchKey) {
        const copy = JSON.parse(data.userChurchKey);
        CheckMyAuth(data?.userAccount);
        CheckAccount(copy);
        fetchList(copy);
    }
    } catch (error) {
      console.error(error);
    }
  };

  // 교인 목록 가져오기
  
  const [churchInfo, setChurchInfo] = useState<ChurchsProps>();
  const [myAuthKey, setMyAuthKey] = useState(0);
  const [authList, setAuthList] = useState<UserProps[]>([]);
  const [notAuthList, setNotAuthList] = useState<UserProps[]>([]);
  const [listViewList, setListViewList] = useState<UserProps[]>([]);
  const [authListLength, setAuthListLength] = useState(0);
  const [notAuthListLength, setNotAuthListLength] = useState(0);
  const [isNotAuthView, setIsNotAuthView] = useState<boolean>(false);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState(1);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');  


  const CheckMyAuth = async (account : any) => {
    await axios.get(`${MainURL}/list/getmyinfo/${account}`).then((res) => {
      if (res.data !== false) { 
        let copy: any = res.data[0].userAuthKey;
        setMyAuthKey(parseInt(copy));
      }
    });
  }
  
  const CheckAccount = async (churchKey: any) => {
    await axios.get(`${MainURL}/churchs/getchurch/${churchKey}`).then( async (res) => {
      if (res.data !== false) { 
        let copy: any = res.data[0];
        setChurchInfo(copy);
      }
    });
  }

  const fetchList = async (churchKey: any) => {
    await axios.get(`${MainURL}/list/getlistall/${churchKey}/${page}`).then((res) => {
      if (res.data !== false) {
        setIsResdataFalse(false);
        let copy: any = [...res.data.authListItems];
        let authListsCopy = [...authList, ...copy] 
        authListsCopy.sort((a: any, b: any) => a.userName > b.userName ? 1 : -1);
        setAuthListLength(res.data.authListLength);
        setNotAuthListLength(res.data.notAuthListLength);
        setAuthList(authListsCopy);
        setListViewList(authListsCopy);
        setNotAuthList(res.data.notAuthListItems);
      } else {
        setIsResdataFalse(true);
      }
    });
    setIsLoading(false);
   };

  useEffect(() => {
    asyncFetchData();
  }, [refresh, page]);

  const fetchUserSearch = async (text: string) => {
    setIsSearchLoading(true);
    await axios.get(`${MainURL}/list/searchusers/${churchInfo?.id}/${text}`).then((res) => {
      if (res.data !== false) {
        setIsResdataFalse(false);
        let copy: any = [...res.data];
        setListViewList(copy);
      } else {
        setIsResdataFalse(true);
      }
    });
    setIsSearchLoading(false);
  };


  const changeInputValue = async(event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const inputText = event.nativeEvent.text;
    setInputValue(inputText);
    if (inputText.length > 0) {
      fetchUserSearch(inputText);
    }
  };

  const handleResetPress = () => {
    setInputValue('');
    setListViewList(authList);
  }

  const fetchUserDutySearch = async (text: string) => {
    setIsSearchLoading(true);
    setListViewList([]);
    await axios.get(`${MainURL}/list/searchusersduty/${churchInfo?.id}/${text}`).then((res) => {
      if (res.data !== false) {
        setIsResdataFalse(false);
        let copy: any = [...res.data];
        setListViewList(copy);
      } else {
        setIsResdataFalse(true);
      }
    });
    setIsSearchLoading(false);
  };

  interface SelectMenuProps {
    tabNum : number;
    title: string;
    color : string;
    textLength : number
  }

  const SelectMenu: React.FC<SelectMenuProps> = ({ tabNum, title, color, textLength}) => {
    return (
      <TouchableOpacity
       style={{width: textLength === 2 ? 50 : 65, alignItems:'center', paddingTop:10}}
       onPress={() => {
        setCurrentTab(tabNum);
        fetchUserDutySearch(title); 
      }}
     >
      <View style={{marginBottom:5}}>
        <View style={{width:30, height:30, borderRadius:15, backgroundColor: color, opacity:0.5}}/>
       </View>
       <Typography fontSize={15} color={currentTab === tabNum ? '#333' : '#8B8B8B'}>{title}</Typography>
       {
         currentTab === tabNum
         ? <View style={{width:textLength === 2 ? 45 : 65, height:2, backgroundColor:'#333', marginTop:5}}></View>
         : <View style={{width:textLength === 2 ? 45 : 65, height:2, backgroundColor:'#fff', marginTop:5}}></View>
       }
     </TouchableOpacity>
    )    
  };

  const textGroup = [
    { title:'전체' , color:'#333'},
    { title:'주일학교' , color:'#FF00DD'},
    { title:'성도' , color:'#0100FF'},
    { title:'집사' , color:'#5F00FF'},
    { title:'권사' , color:'#00D8FF'},
    { title:'안수집사' , color:'#FF5E00'},
    { title:'장로' , color:'#1DDB16'},
    { title:'선교사' , color:'#FFBB00'},
    { title:'전도사' , color:'#FFBB00'},
    { title:'목사' , color:'#FFBB00'},
    { title:'사모' , color:'#FFBB00'},
    { title:'미정' , color:'#FFF'},
  ]

  const alertRegister = (item:any) => { 
    Alert.alert('한번 승인하여 교인으로 등록되면, 관리자가 강제 퇴장시킬수는 없습니다. ', `${item.userName}님의 등록 요청을 승인하시겠습니까?`, [
      { text: '취소', onPress: () => { return }},
      { text: '확인', onPress: () => { userRegister(item.userAccount) } }
    ]);
  }

  const userRegister = async (account: any) => {
    axios
    .post(`${MainURL}/list/registeruserauth`, {
      userAccount : account,
      churchKey : churchInfo?.id
    })
    .then((res) => {
      if (res.data === true) {
        Alert.alert('승인되었습니다.');
        setRefresh(!refresh);
      } else {
        Alert.alert('다시 시도해주세요.');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }; 

  return (
    <View style={styles.container}>
        
      {/* title */}
      <Title title='교인목록' enTitle='BelieverList'/>

      <Divider height={2} />
      {
        isLoading || churchInfo === undefined
        ?
        <View style={{flex:1, width:'100%', height:'100%'}}>
          <Loading />
        </View>
        :
        <>
        {
          asyncGetData.userChurchKey === null || asyncGetData.userChurchKey === undefined
          ?
          <>
            <View style={{height:200, alignItems:'center', justifyContent:'center'}}>
              <Typography marginBottom={5}>현재 등록된 내교회가 없습니다.</Typography>
              <Typography>먼저 교회를 등록해주세요.</Typography>
            </View>
            <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity 
                style={{alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#EAEAEA', marginTop:30, padding:10, borderRadius:10}}
                onPress={()=>{
                  props.navigation.navigate('내교회', {screen: 'ChurchMain'});
                }}
              >
                <Typography color="#8B8B8B">교회 등록하기</Typography>
              </TouchableOpacity >
            </View>
          </>     
          :
          <>
            {
              churchInfo?.id === myAuthKey
              ?
              <>
                <View style={{width:'100%', flexDirection: 'row', alignItems: 'flex-start', paddingLeft:10,
                            borderBottomWidth:1, borderBottomColor:"#EFEFEF"}}>
                  <ScrollView horizontal>
                    <SelectMenu tabNum={1} title={textGroup[0].title} color={textGroup[0].color} textLength={2}/>
                    <SelectMenu tabNum={2} title={textGroup[1].title} color={textGroup[1].color} textLength={4}/>
                    <SelectMenu tabNum={3} title={textGroup[2].title} color={textGroup[2].color} textLength={2}/>
                    <SelectMenu tabNum={4} title={textGroup[3].title} color={textGroup[3].color} textLength={2}/>
                    <SelectMenu tabNum={5} title={textGroup[4].title} color={textGroup[4].color} textLength={2}/>
                    <SelectMenu tabNum={6} title={textGroup[5].title} color={textGroup[5].color} textLength={4}/>
                    <SelectMenu tabNum={7} title={textGroup[6].title} color={textGroup[6].color} textLength={2}/>
                    <SelectMenu tabNum={8} title={textGroup[7].title} color={textGroup[7].color} textLength={3}/>
                    <SelectMenu tabNum={9} title={textGroup[8].title} color={textGroup[8].color} textLength={3}/>
                    <SelectMenu tabNum={10} title={textGroup[9].title} color={textGroup[9].color} textLength={2}/>
                    <SelectMenu tabNum={11} title={textGroup[10].title} color={textGroup[10].color} textLength={2}/>
                    <SelectMenu tabNum={12} title={textGroup[11].title} color={textGroup[11].color} textLength={2}/>
                    <View style={{width:30}}></View>
                  </ScrollView>
                </View>

                <View style={{paddingHorizontal:20, paddingTop:10}}>
                  <View style={styles.seachBar}>
                    <View style={[styles.flexBox, { alignItems:"center"}]}>
                      <Entypo name="magnifying-glass" size={22} color="#8B8B8B" style={{marginRight:13}}/> 
                      <TextInput 
                        placeholder={'이름 검색'}
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
                </View>

                
                <View style={styles.section}>
                {
                  isSearchLoading
                  ?
                  <View style={{flex:1, width:'100%', height:'100%'}}>
                    <Loading />
                  </View>
                  :
                  <>
                  {
                    listViewList.length > 0
                    ?
                    <ScrollView>
                      { 
                        churchInfo?.userAccount === asyncGetData.userAccount && currentTab === 1 &&
                        <>
                          <View style={{marginBottom:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                            <Typography fontSize={18}>* 승인 대기자 명단</Typography>
                            <Typography color='#BDBDBD'>총 {notAuthListLength}명이 있습니다.</Typography>
                            <TouchableOpacity
                              onPress={()=>{setIsNotAuthView(!isNotAuthView)}}
                              style={{padding:5, borderWidth:1, borderColor:"#BDBDBD", borderRadius:5, flexDirection:'row', alignItems:'center'}}
                            >
                              <Typography>{isNotAuthView ? '닫기' : '보기'}</Typography>
                              <AntDesign name={isNotAuthView ? 'up' : 'down'} color='#333' style={{marginLeft:5}} />
                            </TouchableOpacity>
                          </View>
                          { isNotAuthView &&
                            notAuthList.map((item:any, index:any)=>{

                              const copy = textGroup.filter((text:any)=> text.title === item.userDuty);
                              const result = copy[0]?.color;

                              return  item.userAccount !== asyncGetData.userAccount &&
                              (
                                <TouchableOpacity
                                  key={index}
                                  style={{borderWidth:1, borderColor:"#EAEAEA", borderRadius:5, padding:10, marginBottom:15,
                                          flexDirection:'row', alignItems:'center'}}
                                  onPress={()=>{churchInfo.id === 11 ? Alert.alert('테스트입니다.') : alertRegister(item)}}
                                >
                                  <View style={{minWidth:15, height:'100%', flexDirection:'row', alignItems:'center', justifyContent:'center',
                                              backgroundColor:result, opacity:0.5, marginRight:10, borderRadius:3}}>
                                    <Typography>{index+1}</Typography>
                                  </View>
                                  <View style={{flex:1}}>
                                    <View style={{flexDirection:'row', alignItems:'flex-end', marginBottom:5}}>
                                      <Typography fontSize={18}>{item.userName} </Typography>
                                      <Typography> {item.userDuty}</Typography>
                                    </View>
                                    <Typography>{item.userPhone === 'undefined' || item.userPhone === null || item.userPhone === '' ? '미정' : item.userPhone}</Typography>
                                  </View>
                                  <View style={{width:70, alignItems:'center', borderWidth:1, borderColor:"#BDBDBD", borderRadius:5, padding:10}}>
                                    <Typography>승인</Typography>
                                  </View>  
                                </TouchableOpacity>
                              )
                          })
                          }
                          <Divider marginVertical={10} height={5}/>
                        </>
                      }
                      <View style={{paddingLeft:10, marginBottom:10}}>
                      {
                        currentTab === 1
                        ? <Typography color='#BDBDBD'>총 {inputValue === '' ? authListLength : listViewList.length}명이 있습니다.</Typography>
                        : <Typography color='#BDBDBD'>총 {listViewList.length}명이 있습니다.</Typography>
                      }
                      </View>
                      {
                        listViewList.map((item:any, index:any)=>{

                          const copy = textGroup.filter((text:any)=> text.title === item.userDuty);
                          const result = copy[0]?.color;

                          return  item.userAccount !== asyncGetData.userAccount && (
                            <TouchableOpacity
                              key={index}
                              style={{borderWidth:1, borderColor:"#EAEAEA", borderRadius:5, padding:10, marginBottom:15,
                                      flexDirection:'row', alignItems:'center'}}
                              onPress={()=>{
                                props.navigation.navigate('ListDetail', {data : item, sort : churchInfo?.userAccount === asyncGetData.userAccount ? 'church' : 'user'})
                              }}
                            >
                              <View style={{minWidth:15, height:'100%', flexDirection:'row', alignItems:'center', justifyContent:'center',
                                              backgroundColor:result, opacity:0.5, marginRight:10, borderRadius:3}}>
                                <Typography>{index+1}</Typography>
                              </View>  
                              <View style={{width:'80%'}}>
                                <View style={{flexDirection:'row', alignItems:'flex-end', marginBottom:5}}>
                                  <Typography fontSize={18}>{item.userName} </Typography>
                                  <Typography> {item.userDuty}</Typography>
                                </View>
                                <Typography>{item.userPhone === 'undefined' || item.userPhone === null || item.userPhone === '' ? '미정' : item.userPhone}</Typography>
                              </View>
                              <View style={{width:'10%', alignItems:'flex-end'}}>
                                <AntDesign name='right' color='#333' />
                              </View>  
                            </TouchableOpacity>
                          )
                        })
                      }
                      {
                        currentTab === 1 && authListLength > listViewList.length && inputValue === '' &&
                        <TouchableOpacity
                          style={styles.button} 
                          onPress={()=>{
                            setPage(prev => prev + 1);
                          }}
                        >
                          <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Typography color='#8C8C8C'  fontSize={14}>더보기 </Typography>
                            <AntDesign name="down" size={16} color="#8C8C8C"/>
                          </View>
                        </TouchableOpacity>
                      }
                      <View style={{height:250}}></View>
                    </ScrollView>
                    :
                    <View style={{alignItems:'center', justifyContent:'center', paddingTop:20}}>
                      <Typography color="#8B8B8B">등록된 교인이 없습니다.</Typography>
                    </View>
                  }
                  </>
                }
                </View>
              </>
              :
              <View style={{height:300, alignItems:'center', justifyContent:'center', paddingTop:20}}>
                <Typography color="#333" marginBottom={10} fontSize={20}>아직 승인 대기 상태입니다.</Typography>
                <Typography color="#333" marginBottom={10} fontSize={20}>담당 목회자가 승인을 해야 합니다.</Typography>
                <Typography color="#333" fontSize={20}>담당 목회자에게 가입 소식을 알려주세요.</Typography>
              </View>
            }
          </>
        }
        </>
      }
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
  button: {
    borderBottomWidth:1,
    borderColor: '#EAEAEA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
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

