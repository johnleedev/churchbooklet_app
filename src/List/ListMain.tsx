import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncGetItem from '../AsyncGetItem'
import axios from 'axios';
import MainURL from "../../MainURL";
import { Typography } from '../Components/Typography';
import { Title } from '../Components/Title';
import { Divider } from '../Components/Divider';
import Loading from '../Components/Loading';
import AntDesign from 'react-native-vector-icons/AntDesign';


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
}

export default function ListMain(props : any) {

  const [refresh, setRefresh] = useState<boolean>(false);
  // AsyncGetData
  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      setAsyncGetData(data);
      CheckMyAuth(data?.userAccount);
      CheckAccount(data?.userChurchKey);
      fetchList(data?.userChurchKey);
    } catch (error) {
      console.error(error);
    }
  };

  // 교인 목록 가져오기
  const [churchInfo, setChurchInfo] = useState<ChurchsProps>();
  const [myAuthKey, setMyAuthKey] = useState(0);
  const [list, setList] = useState<UserProps[]>([]);
  const [listViewList, setListViewList] = useState<UserProps[]>([]);
  const [waitAuthList, setWaitAuthList] = useState<UserProps[]>([]);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState(1);

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
    await axios.get(`${MainURL}/list/getlistall/${churchKey}`).then((res) => {
      if (res.data !== false) {
        setIsResdataFalse(false);
        let copy: any = [...res.data];
        copy.reverse();
        copy.sort((a: any, b: any) => a.userName > b.userName ? 1 : -1);
        const result = copy.filter((item:any)=> item.userAuthKey === churchKey);
        const waitAuth = copy.filter((item:any)=> item.userAuthKey !== churchKey);
        setList(result);
        setListViewList(result);
        setWaitAuthList(waitAuth);
      } else {
        setIsResdataFalse(true);
      }
    })
   };

  useEffect(() => {
    asyncFetchData();
  }, [refresh]);

  interface SelectMenuProps {
    tabNum : number;
    title: string;
    color : string;
  }

  const SelectMenu: React.FC<SelectMenuProps> = ({ tabNum, title, color}) => {
    return (
      <TouchableOpacity
       style={{width: title !== '주일학교' ? 50 : 77, alignItems:'center', paddingTop:10}}
       onPress={() => {title === '전체' ?  setListViewList(list) : handlePostListFilter(title); setCurrentTab(tabNum);}}
     >
      <View style={{marginBottom:5}}>
        <View style={{width:30, height:30, borderRadius:15, backgroundColor: color, opacity:0.5}}/>
       </View>
       <Typography fontSize={13} color={currentTab === tabNum ? '#333' : '#8B8B8B'}>{title}</Typography>
       {
         currentTab === tabNum
         ? <View style={{width:title !== '주일학교' ? 45 : 70, height:2, backgroundColor:'#333', marginTop:5}}></View>
         : <View style={{width:title !== '주일학교' ? 45 : 70, height:2, backgroundColor:'#fff', marginTop:5}}></View>
       }
     </TouchableOpacity>
    )    
  };

  const handlePostListFilter = (sortText : string) => {
    const copy = list.filter((e:any)=> e.userDuty === sortText);
    setListViewList(copy);
  }

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
           churchInfo === undefined || myAuthKey === null
           ?
           <View style={{flex:1, width:'100%', height:'100%'}}>
             <Loading />
           </View>    
            :
            <>
            {
              churchInfo?.id === myAuthKey
              ?
              <>
                {
                  list.length === 0 || isResdataFalse
                  ?
                  <View style={{flex:1, width:'100%', height:'100%'}}>
                    <Loading />
                  </View>
                  :
                  <>
                  <View style={{width:'100%', flexDirection: 'row', alignItems: 'flex-start', paddingLeft:10,
                              borderBottomWidth:1, borderBottomColor:"#EFEFEF"}}>
                    <ScrollView horizontal>
                      <SelectMenu tabNum={1} title={textGroup[0].title} color={textGroup[0].color}/>
                      <SelectMenu tabNum={2} title={textGroup[1].title} color={textGroup[1].color}/>
                      <SelectMenu tabNum={3} title={textGroup[2].title} color={textGroup[2].color}/>
                      <SelectMenu tabNum={4} title={textGroup[3].title} color={textGroup[3].color}/>
                      <SelectMenu tabNum={5} title={textGroup[4].title} color={textGroup[4].color}/>
                      <SelectMenu tabNum={6} title={textGroup[5].title} color={textGroup[5].color}/>
                      <SelectMenu tabNum={7} title={textGroup[6].title} color={textGroup[6].color}/>
                      <SelectMenu tabNum={8} title={textGroup[7].title} color={textGroup[7].color}/>
                      <SelectMenu tabNum={9} title={textGroup[8].title} color={textGroup[8].color}/>
                      <SelectMenu tabNum={10} title={textGroup[9].title} color={textGroup[9].color}/>
                      <View style={{width:30}}></View>
                    </ScrollView>
                  </View>
                  
                  
                  <View style={{paddingHorizontal:20, width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:20}}>
                    <Typography fontSize={14} color='#BDBDBD'>가나다순</Typography>
                  </View>

                  <View style={styles.section}>
                  {
                    listViewList.length > 0
                    ?
                    <ScrollView>
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
                              <View style={{width:10, height:'100%', backgroundColor:result, opacity:0.5, marginRight:10, borderRadius:3}}></View>  
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

                      <Divider marginVertical={10}/>

                      { 
                        churchInfo?.userAccount === asyncGetData.userAccount &&
                        <>
                        <View style={{marginVertical:10}}>
                          <Typography fontSize={18}>* 승인 대기자 명단</Typography>
                        </View>
                        {
                          waitAuthList.map((item:any, index:any)=>{

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
                                <View style={{width:10, height:'100%', backgroundColor:result, opacity:0.5, marginRight:10, borderRadius:3}}></View>  
                                <View style={{flex:1}}>
                                  <View style={{flexDirection:'row', alignItems:'flex-end', marginBottom:5}}>
                                    <Typography fontSize={18}>{item.userName} </Typography>
                                    <Typography> {item.userDuty}</Typography>
                                  </View>
                                  <Typography>{item.userPhone === 'undefined' || item.userPhone === null || item.userPhone === '' ? '미정' : item.userPhone}</Typography>
                                </View>
                                <View style={{width:50, alignItems:'flex-end', borderWidth:1, borderColor:"#BDBDBD", borderRadius:5, padding:10}}>
                                  <Typography>승인</Typography>
                                </View>  
                              </TouchableOpacity>
                            )
                          })
                        }
                        </>
                      }
                      

                      <View style={{height:200}}></View>
                    </ScrollView>
                    :
                    <View style={{alignItems:'center', justifyContent:'center', paddingTop:20}}>
                      <Typography color="#8B8B8B">등록된 교인이 없습니다.</Typography>
                    </View>
                  }
                  </View>
                  </>
                }
              </>
              :
              <>
                <View style={{height:300, alignItems:'center', justifyContent:'center', paddingTop:20}}>
                  <Typography color="#333" marginBottom={10} fontSize={20}>아직 승인 대기 상태입니다.</Typography>
                  <Typography color="#333" marginBottom={10} fontSize={20}>담당 목회자가 승인을 해야 합니다.</Typography>
                  <Typography color="#333" fontSize={20}>담당 목회자에게 가입 소식을 알려주세요.</Typography>
                </View>
              </>
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
  
});

