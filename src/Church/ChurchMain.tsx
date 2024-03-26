import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Alert, TouchableOpacity, Linking,
          NativeSyntheticEvent, TextInputChangeEventData, ImageBackground, Image, Text, Modal } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncGetItem from '../AsyncGetItem'
import axios from 'axios';
import MainURL from "../../MainURL";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Typography } from '../Components/Typography';
import { Title } from '../Components/Title';
import { Divider } from '../Components/Divider';
import Loading from '../Components/Loading';
import MainImageURL from "../../MainImageURL";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectScreen from './SelectScreen';

interface ChurchsProps {
  id: number;
  userAccount : string;
  churchName : string;
  religiousbody : string;
  churchAddressCity: string;
  churchAddressCounty: string;
  churchAddressRest: string;
  churchPhone: string;
  churchPastor: string;
  churchImage : string;
}

interface ChurchNoticeProps {
  id: number;
  title: string;
  content : string;
  date: string;
}

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

export default function ChurchMain(props : any) {

  // AsyncGetData
  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const [church, setChurch] = useState<ChurchsProps>();
  const [churchNotice, setChurchNotice] = useState<ChurchNoticeProps[]>([]);
  const [myAuthKey, setMyAuthKey] = useState(0);
  const [isDeleteBtnShow, setIsDeleteBtnShow] = useState<boolean>(false);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);
  const [isResdataFalse2, setIsResdataFalse2] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      setAsyncGetData(data);
      if (data?.userChurchKey) {
        const copy = JSON.parse(data.userChurchKey);
        fetchPosts(copy);
        fetchChurchNotice(copy);
        CheckMyAuth(data?.userAccount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    asyncFetchData();
  }, [refresh]);  
  

  const CheckMyAuth = async (account : any) => {
    await axios.get(`${MainURL}/list/getmyinfo/${account}`).then((res) => {
      if (res.data !== false) { 
        let copy: any = res.data[0].userAuthKey;
        setMyAuthKey(parseInt(copy));
      }
    });
  }

  const fetchPosts = (key : any) => {
    axios.get(`${MainURL}/churchs/getchurch/${key}`).then((res) => {
      if (res.data !== false) {
        setIsResdataFalse(false);
        let copy: any = res.data[0];
        setChurch(copy);
      } else {
        setIsResdataFalse(true);
      }
    });
  }; 

  const fetchChurchNotice = (key : any) => {
    axios.get(`${MainURL}/churchs/getchurchnotice/${key}`).then((res) => {
      if (res.data !== false) {
        setIsResdataFalse2(false);
        let copy: any = [...res.data];
        setChurchNotice(copy);
      } else {
        setIsResdataFalse2(true);
      }
    });
  }; 

  const deleteChurchNotice = (item : any) => {
    axios
      .post(`${MainURL}/churchs/postnoticedelete`, {
        postId : item.id,
        churchKey : item.churchKey
      })
      .then((res) => {
        if (res.data === true) {
          Alert.alert('삭제 되었습니다.');
          setRefresh(!refresh);
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'ChurchMain' }]
          });
        } else if (res.data === false) {
          Alert.alert('다시 시도해주세요');
        }
      });
  }; 

  const handleChurchLeave = () => {
    axios
    .post(`${MainURL}/churchs/leavemychurch`, {
      userAccount : asyncGetData.userAccount,
    })
    .then((res) => {
      if (res.data === true) {
        AsyncStorage.removeItem('church');
        AsyncStorage.removeItem('churchkey');
        props.navigation.navigate("홈");
      } else {
        Alert.alert(res.data);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }; 


  const renderPreview = (content : string) => {
    if (content?.length > 30) {
      return content.substring(0, 30) + '...';
    }
    return content;
  };


  const alertProfileRevise = () => { 
    Alert.alert('교회 정보를 변경하시겠습니까?', '이 버튼은 목회자(담임)에게만 노출됩니다.', [
      { text: '취소', onPress: () => { return }},
      { text: '확인', onPress: () => 
       { church?.id === 11 ? Alert.alert('테스트입니다.') : props.navigation.navigate("ChurchProfileRevise", {data : church, userAccount: asyncGetData.userAccount})} }
    ]);
  }

  const alertImageRevise = () => { 
    Alert.alert('사진을 변경하시겠습니까?', '이 버튼은 목회자(담임)에게만 노출됩니다.', [
      { text: '취소', onPress: () => { return }},
      { text: '확인', onPress: () => 
       { church?.id === 11 ? Alert.alert('테스트입니다.') : props.navigation.navigate("ChurchImageRevise", {data : church, userAccount: asyncGetData.userAccount})} }
    ]);
  }

  const alertDeleteChurchNotice = (item : any) => { 
    Alert.alert(`${item.userName}님이 쓰신 글이 삭제됩니다.`, '정말 삭제하시겠습니까?', [
      { text: '취소', onPress: () => { return }},
      { text: '삭제', onPress: () => deleteChurchNotice(item) }
    ]);
  }

  const alertChurchLeave = () => { 
    Alert.alert('정말 나가시겠습니까?', '다시 교회를 등록하셔야 이용이 가능합니다.', [
      { text: '취소', onPress: () => { return }},
      { text: '나가기', onPress: () => handleChurchLeave() }
    ]);
  }

  // 앱 링크 함수
  const handleAppLink = async () => {
    Clipboard.setString('https://churchbooklet.page.link/WGAX')
    Alert.alert('초대링크가 복사되었습니다.')
  }

  return (
    <View style={styles.container}>
      
      {/* title */}
      <Title title='내교회' enTitle='MyChurch'/>
                
      <Divider height={2} />

      <View style={styles.section}>

        {
          asyncGetData.userChurchKey === null 
          ?
          <View>
            <SelectScreen asyncGetData={asyncGetData} navigation={props.navigation}/>
          </View>
          :
          <>
          {
            church === undefined || church === null
            ?
            <View style={{width:'100%', height:'100%'}}>
              <Loading/>
            </View>
            :
            <ScrollView style={{}}>
              <View style={{flexDirection: 'row', justifyContent: church?.id === 11 ? 'space-between' : 'flex-end', paddingRight:5, alignItems:'center'}}>
                {
                  church?.id === 11 &&
                  <TouchableOpacity 
                    hitSlop={{ top: 15, bottom: 15 }}
                    onPress={()=>{
                      props.navigation.navigate("Navi_Notifi", {screen : "AppNoticePastor"})
                    }}
                  >
                    <View style={{padding:10, borderWidth:1, borderColor:'#F15F5F', borderRadius:10}}>
                      <Typography>사용설명서(목회자용)</Typography>
                    </View>
                  </TouchableOpacity>
                }
                <TouchableOpacity 
                  hitSlop={{ top: 15, bottom: 15 }}
                  onPress={handleAppLink}
                >
                  <AntDesign name="sharealt" size={24} color="#333" style={{width: 30, marginRight: 5}}/>
                </TouchableOpacity>
              </View> 
              <View style={{height:80, alignItems:'center', justifyContent:'center', marginBottom:10}}>
                <Typography fontSize={22} fontWeightIdx={0} marginBottom={10}>{church.churchName}</Typography>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Image
                    source={{uri: `${MainImageURL}/images/app/${church.religiousbody}.jpg`}}
                    style={{width:20, height:20, resizeMode:'contain', marginRight:5}}>
                  </Image>
                  <Typography color='#8C8C8C'>{church.religiousbody}</Typography>
                </View>
                {
                  asyncGetData.userAccount === church.userAccount && 
                  <TouchableOpacity 
                    style={{position:'absolute', right:25}}
                    hitSlop={{ top: 15, bottom: 15 }}
                    onPress={alertProfileRevise}
                  >
                    <AntDesign name='setting' size={20} color='#000'/>
                  </TouchableOpacity>
                }
              </View>

              <TextBox name='지역' text={`${church.churchAddressCity} ${church.churchAddressCounty}`}/>
              <TextBox name='주소' text={`${church.churchAddressRest}`}/>
              <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:20, marginVertical:10}}>
                <View style={{width:'20%', alignItems:'center'}}>
                  <Typography color='#8C8C8C'>전화</Typography>
                </View>
                <View style={{width:2, height:20, backgroundColor:'#EAEAEA', marginHorizontal:10}}></View>
                <TouchableOpacity
                  style={{width:'70%'}}
                  onPress={()=>{Linking.openURL(`tel:${church.churchPhone}`)}}
                >
                  <Typography color='#0054FF'><Text style={{textDecorationLine:'underline'}}>{church.churchPhone}</Text></Typography>
                </TouchableOpacity>
              </View>
              <TextBox name='담임목사' text={`${church.churchPastor} 목사`}/>

              <View style={[styles.section, {alignItems:'center'}]}>
                {
                  asyncGetData.userAccount === church.userAccount &&
                  <TouchableOpacity style={{position:'absolute', top: -20, right:10, padding:15}}
                    onPress={alertImageRevise}
                  >
                    <AntDesign name='setting' size={20} color='#000'/>
                  </TouchableOpacity>
                }
                <View style={{width:300, height:200, margin:5}}>
                {
                  church.churchImage === null || church.churchImage === ''
                  ?
                  <View style={{height:180, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#BDBDBD', borderRadius:10}}>
                    <Typography>등록된 사진이</Typography>
                    <Typography>없습니다.</Typography>
                  </View>
                  :
                  <Image style={{width:'100%', height:'100%', resizeMode:'cover', borderRadius:10}} 
                    source={{ uri: `${MainImageURL}/images/churchimage/${church.churchImage}`}}/>
                }
                </View>
              </View>

              <Divider height={5} marginVertical={15}/>

              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:5}}>
                <Typography fontSize={18} fontWeightIdx={1}>교회소식</Typography>
                <View style={{flexDirection:'row'}}>
                  {
                    asyncGetData.userAccount === church.userAccount && 
                    <TouchableOpacity 
                      style={{padding:5, borderWidth:1, borderColor: isDeleteBtnShow ? '#FF0000' : '#8C8C8C', borderRadius:10, marginRight:10}}
                      onPress={()=>{church?.id === 11 ? Alert.alert('테스트입니다.') : setIsDeleteBtnShow(!isDeleteBtnShow)}}
                    >
                      {
                        isDeleteBtnShow
                        ? <Typography fontSize={12}  color='#FF0000'>삭제완료</Typography>
                        : <Typography fontSize={12}  color='#8C8C8C'>삭제하기</Typography>
                      }
                    </TouchableOpacity>
                  }
                  <TouchableOpacity 
                    style={{padding:5, borderWidth:1, borderColor:'#8C8C8C', borderRadius:10}}
                    onPress={()=>{
                      church?.id === 11 ? Alert.alert('테스트입니다.') 
                      : props.navigation.navigate('ChurchNoticePost', { post: null, editMode: null, churchData : church})
                    }}
                  >
                    <Typography fontSize={12}  color='#8C8C8C'>글쓰기</Typography>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                <Typography fontSize={12} color='#8C8C8C'>최근 10개 까지만 보여집니다.</Typography>
              </View>
              
              {
                church?.id === myAuthKey
                ?
                <View style={{minHeight:100}}>
                {
                  churchNotice.length > 0
                  ?
                  <>
                  {
                    churchNotice.slice(0,10).map((item:any, index:any)=>{
                      return(
                        <TouchableOpacity 
                          key={index}
                          onPress={()=>{
                            asyncGetData.userAccount === church.userAccount && isDeleteBtnShow 
                            ? alertDeleteChurchNotice(item)
                            : props.navigation.navigate('ChurchNoticeDetail', {data : item, churchData : church})
                          }}  
                        >
                          <View style={{flexDirection:'row', alignItems:'center', marginVertical:5, 
                                        borderWidth:1, borderColor:'#EAEAEA', padding:10}}>
                            <View style={{width:'90%'}}>
                              <Typography >{renderPreview(item.title)}</Typography>
                              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <View style={{width:150, flexDirection: 'row', alignItems:'center'}}>
                                  <Typography fontSize={14} color='#000'>{item.userName}  </Typography>
                                  <Typography fontSize={14} color='#8C8C8C'>{item.userDuty}</Typography>
                                </View>
                                <Typography fontSize={12} color='#8C8C8C'>{item.date}</Typography>
                              </View>
                            </View>
                            <View style={{width:'10%', alignItems:'flex-end'}}>
                              {
                                isDeleteBtnShow
                                ? <AntDesign name='close' color='#FF0000' size={20}/>
                                : <AntDesign name='right' color='#333' />
                              }
                            </View>  
                          </View>
                        </TouchableOpacity>
                      )
                    })
                  }
                  </>
                  :
                  <>
                    <View style={{justifyContent:'center', alignItems:'center', marginVertical:5, marginTop:15}}>
                      <Typography>등록된 게시글이 없습니다.</Typography>
                    </View>
                  </>
                }
                </View>
                :
                <View style={{height:100, alignItems:'center', justifyContent:'center'}}>
                  <Typography>아직 등록 승인 되지 않습니다.</Typography>
                  <Typography>승인 이후 게시물을 볼 수 있습니다.</Typography>
                </View>
              }
              

              <Divider height={5} marginVertical={15}/>              
              
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end', marginBottom:5}}>
                <TouchableOpacity 
                  style={{padding:5, borderBottomWidth:1, borderBottomColor:'#8C8C8C'}}
                  onPress={()=>{ asyncGetData.userAccount === church.userAccount 
                                ? Alert.alert('담당 목회자는 교회를 나갈 수 없습니다. 운영진에게 연락주시기 바랍니다.') 
                                : alertChurchLeave();}}
                >
                  <Typography fontSize={12}  color='#8C8C8C'>교회 나가기</Typography>
                </TouchableOpacity>
              </View>

              <View style={{height:100}}></View>
            </ScrollView>
          }
          </>
        }

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
  input: {
    height: 40,
    borderColor: '#DFDFDF',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: '#333'
  }
});

