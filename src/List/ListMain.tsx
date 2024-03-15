import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, 
        Alert, Linking, KeyboardAvoidingView, Platform, RefreshControl, ImageBackground } from 'react-native';
import AsyncGetItem from '../AsyncGetItem'
import axios from 'axios';
import MainURL from "../../MainURL";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { Typography } from '../Components/Typography';
import { Title } from '../Components/Title';
import { Divider } from '../Components/Divider';
import Loading from '../Components/Loading';
import AntDesign from 'react-native-vector-icons/AntDesign';


interface UserProps {
  id: number;
  userName : string;
  userPhone : string;
  userDuty: string;
}

export default function ListMain(props : any) {

  const [refresh, setRefresh] = useState<boolean>(false);

  // AsyncGetData
  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      setAsyncGetData(data);
      fetchList(data?.userChurchKey, data?.userAccount);
    } catch (error) {
      console.error(error);
    }
  };

  // 교인 목록 가져오기
  const [list, setList] = useState<UserProps[]>([]);
  const [listViewList, setListViewList] = useState<UserProps[]>([]);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState(1);


  const fetchList = async (churchKey: any, account:any) => {
    await axios.get(`${MainURL}/list/getlistall/${churchKey}`).then((res) => {
      if (res.data !== false) {
        setIsResdataFalse(false);
        let copy: any = [...res.data];
        copy.reverse();
        const result = copy.filter((item:any)=> item.userAccount !== account);
        setList(result);
        setListViewList(result)
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
    { title:'장로' , color:'#1DDB16'},
    { title:'목회자' , color:'#FFBB00'},
  ]

  return (
    <View style={styles.container}>
        
      {/* title */}
      <Title title='교인목록' enTitle='BelieverList'/>

      <View style={{width:'100%', flexDirection: 'row', alignItems: 'flex-start', paddingLeft:10,
                  borderBottomWidth:1, borderBottomColor:"#EFEFEF"}}>
        <SelectMenu tabNum={1} title={textGroup[0].title} color={textGroup[0].color}/>
        <SelectMenu tabNum={2} title={textGroup[1].title} color={textGroup[1].color}/>
        <SelectMenu tabNum={3} title={textGroup[2].title} color={textGroup[2].color}/>
        <SelectMenu tabNum={4} title={textGroup[3].title} color={textGroup[3].color}/>
        <SelectMenu tabNum={5} title={textGroup[4].title} color={textGroup[4].color}/>
        <SelectMenu tabNum={6} title={textGroup[5].title} color={textGroup[5].color}/>
        <SelectMenu tabNum={7} title={textGroup[6].title} color={textGroup[6].color}/>
      </View>
                
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
          listViewList.length === 0 && isResdataFalse
          ?
          <View style={{flex:1, width:'100%', height:'100%'}}>
            <Loading />
          </View>
          :
          <View style={styles.section}>
            {
              listViewList.length > 0
              ?
              <ScrollView>
                {
                  listViewList.map((item:any, index:any)=>{

                    const copy = textGroup.filter((text:any)=> text.title === item.userDuty);

                    return  item.userAccount !== asyncGetData.userAccount &&
                    (
                      <TouchableOpacity
                        key={index}
                        style={{borderWidth:1, borderColor:"#EAEAEA", borderRadius:5, padding:10, marginBottom:10,
                                flexDirection:'row', alignItems:'center'}}
                        onPress={()=>{
                          props.navigation.navigate('ListDetail', {data : item})
                        }}
                      >
                        <View style={{width:10, height:'100%', backgroundColor:copy[0].color, opacity:0.5, marginRight:10, borderRadius:3}}></View>  
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
                <View style={{height:100}}></View>
              </ScrollView>
            :
              <View style={{alignItems:'center', justifyContent:'center', paddingTop:20}}>
                <Typography color="#8B8B8B">등록된 교인이 없습니다.</Typography>
              </View>
            }
          </View>
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

