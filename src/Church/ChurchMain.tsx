import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Alert, TouchableOpacity,
          NativeSyntheticEvent, TextInputChangeEventData, ImageBackground, Image } from 'react-native';
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

const TextBox = ({ name, text }: { name: string; text: any }) => (
  <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:20, marginVertical:10}}>
    <View style={{width:80, alignItems:'center'}}>
      <Typography color='#8C8C8C'>{name}</Typography>
    </View>
    <View style={{width:2, height:20, backgroundColor:'#EAEAEA', marginHorizontal:10}}></View>
    <Typography>{text}</Typography>
  </View>
);

export default function ChurchMain(props : any) {

  // AsyncGetData
  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      setAsyncGetData(data);
      if (data?.userChurchKey) {
        fetchPosts(data?.userChurchKey);
        fetchChurchNotice(data?.userChurchKey);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    asyncFetchData();
  }, []);

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
  
  const [church, setChurch] = useState<ChurchsProps>();
  const [churchNotice, setChurchNotice] = useState<ChurchNoticeProps[]>([]);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);
  const [isResdataFalse2, setIsResdataFalse2] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const fetchPosts = (key : any) => {
    axios.get(`${MainURL}/churchs/getchurch/${key}`).then((res) => {
      if (res.data !== false) {
        setIsResdataFalse(false);
        let copy: any = [...res.data];
        setChurch(copy[0]);
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

  const alertNotice = () => { 
    Alert.alert('교회등록은 목회자(담임)만 가능합니다.', '허위로 등록하거나 장난으로 등록한 것이 발견될 경우, 경고 없이 곧바로 어플 사용에 관하여 제한 조치 됩니다. 등록하시겠습니까?', [
      { text: '취소', onPress: () => { return }},
      { text: '확인', onPress: () => props.navigation.navigate("ChurchInfoInput", {asyncGetData : asyncGetData}) }
    ]);
  }

  const alertImageRevise = () => { 
    Alert.alert('사진을 변경하시겠습니까?', '교회사진 변경은 버튼은 목회자(담임)에게만 노출됩니다.', [
      { text: '취소', onPress: () => { return }},
      { text: '확인', onPress: () => props.navigation.navigate("ChurchImageRevise", {data : church, userAccount: asyncGetData.userAccount}) }
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
    Clipboard.setString('https://churchbooklet.page.link/Kz3a')
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
          <>
            <View style={{height:70, alignItems:'center', justifyContent:'center'}}>
              <Typography fontSize={18} marginBottom={5}>현재 나의 교회가 지정되어 있지 않습니다.</Typography>
              <Typography fontSize={18}>아래에서 선택해주세요.</Typography>
            </View>

            <Divider height={2} marginVertical={10}/>

            <TouchableOpacity
              style={{borderWidth:1, height:170, borderColor:"#BDBDBD", borderRadius:5, marginBottom:10}}
              onPress={()=>{
                props.navigation.navigate("ChurchSearch", { userAccount : asyncGetData.userAccount });
              }}
            > 
              <ImageBackground
                source={require("../images/believer.jpg")}
                style={{width:"100%", height:"100%", opacity:0.3}}
              >
              </ImageBackground>
              <View style={{position:'absolute', height:170, top:0, left:0, padding:15, justifyContent:'space-between'}}>
                <View>
                <Typography fontSize={18} marginBottom={5}>교회에 출석하는 일반 성도로서</Typography>
                <Typography fontSize={18} marginBottom={5}>등록되어 있는 교회를 찾아서,</Typography>
                <Typography fontSize={18}>내 교회로 등록하려는 경우</Typography>
                </View>
                <View style={{width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
                  <Typography fontSize={18} fontWeightIdx={0}>교회 찾기  </Typography>
                  <AntDesign name='right' size={14} color='#333' />
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{borderWidth:1, height:150, borderColor:"#BDBDBD", borderRadius:5}}
              onPress={alertNotice}
            >
              <ImageBackground
                source={require("../images/church.jpg")}
                style={{width:"100%", height:"100%", opacity:0.3}}
              >
              </ImageBackground>
              <View style={{position:'absolute', height:150, top:0, left:0, padding:15, justifyContent:'space-between'}}>
                <View>
                  <Typography fontSize={18} marginBottom={5}>교회를 담당하는 담임목사로서</Typography>
                  <Typography fontSize={18} >교회를 새로 등록하려는 경우</Typography>
                </View>
                <View style={{width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
                  <Typography fontSize={18} fontWeightIdx={0}>교회 등록하기  </Typography>
                  <AntDesign name='right' size={14} color='#333' />
                </View>
              </View>
            </TouchableOpacity>
          </>
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
              <View style={{flexDirection: 'row', justifyContent:'flex-end', paddingRight:5}}>
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
              </View>
              <TextBox name='지역' text={`${church.churchAddressCity} ${church.churchAddressCounty}`}/>
              <TextBox name='주소' text={`${church.churchAddressRest}`}/>
              <TextBox name='전화번호' text={church.churchPhone}/>
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
                <TouchableOpacity 
                  style={{padding:5, borderWidth:1, borderColor:'#8C8C8C', borderRadius:10}}
                  onPress={()=>{
                    props.navigation.navigate('ChurchNoticePost', { post: null, editMode: null, churchKey : church?.id})
                  }}
                >
                  <Typography fontSize={12}  color='#8C8C8C'>글쓰기</Typography>
                </TouchableOpacity>
              </View>
              <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                <Typography fontSize={12} color='#8C8C8C'>최근 10개 까지만 보여집니다.</Typography>
              </View>

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
                        onPress={()=>{props.navigation.navigate('ChurchNoticeDetail', {data : item, churchKey : church?.id});}}  
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
                            <AntDesign name='right' color='#333' />
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

              <Divider height={5} marginVertical={15}/>              
              
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end', marginBottom:5}}>
                <TouchableOpacity 
                  style={{padding:5, borderBottomWidth:1, borderBottomColor:'#8C8C8C'}}
                  onPress={alertChurchLeave }
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

