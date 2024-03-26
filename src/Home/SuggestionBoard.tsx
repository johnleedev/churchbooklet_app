import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import MainURL from "../../MainURL";
import AsyncGetItem from '../AsyncGetItem'
import Entypo from 'react-native-vector-icons/Entypo';
import { Typography } from '../Components/Typography';
import { Title } from '../Components/Title';
import { Divider } from '../Components/Divider';
import DateFormmating from '../Components/DateFormmating';
import { SubTitle } from '../Components/SubTitle';

export default function SuggestionBoard (props : any) {

  const [suggestionContent, setSuggestionContent] = useState('');
  const [suggestionPosts, setSuggestionPosts] = useState([]);
  const [refresh, setRefresh] = useState<boolean>(true);

  // AsyncGetData
  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      setAsyncGetData(data);
    } catch (error) {
      console.error(error);
    }
  };

  // getPosts
  const fetchPosts = () => {
    axios.get(`${MainURL}/home/getsuggestions`).then((res) => {
      let copy: any = [...res.data];
      copy.reverse();
      setSuggestionPosts(copy);
    });
  };

  useEffect(() => {
    fetchPosts();
    asyncFetchData();
  }, [refresh]);


  const addSuggestion = () => {
    
    const getTime = new Date();
    const currentDateTime = getTime.toISOString().slice(0, 19);

    if (asyncGetData.userName || asyncGetData.userAccount) {
      axios
        .post(`${MainURL}/home/suggestion`, {
          content: suggestionContent, date : currentDateTime, 
          userAccount: asyncGetData.userAccount,
          userChurch: asyncGetData.userChurch,
          userName : asyncGetData.userName,
        })
        .then((res) => {
          if(res.data) {
            setSuggestionContent('');
            setRefresh(!refresh);
            Alert.alert('입력되었습니다.')
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      Alert.alert('로그인이 필요합니다.');
    }
  };

  const [showAllPosts, setShowAllPosts] = useState(false);
  const suggestionToShow = showAllPosts ? suggestionPosts.slice(0, 10) : suggestionPosts.slice(0, 5);

  const deleteSuggestion = (data : any) => {
    axios
      .post(`${MainURL}/home/deletesuggestion`, {
        postID : data.id,
        userAccount: data.userAccount,
      })
      .then((res) => {
        if(res.data) {
          setRefresh(!refresh);
          Alert.alert('삭제되었습니다.')
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <SubTitle title='문의하기' enTitle='Question' navigation={props.navigation}/>
      
      <View style={styles.section}>
        <ScrollView>
          <View style={styles.addTitleBox}>
            <Typography marginBottom={4} color='#8C8C8C' fontSize={12}>
              '교회수첩' 어플에 관해, 자유롭게 문의해주세요.
            </Typography>
          </View>
          <TextInput
            style={[styles.addSuggestionInput]}
            placeholder="글을 입력하세요"
            placeholderTextColor="gray"
            value={suggestionContent}
            onChangeText={setSuggestionContent}
          />
          <View style={{flexDirection:'row', justifyContent:'flex-end', marginRight:5}}>
            <View style={styles.addTitleTextbox}>
              <Typography color='#8C8C8C' fontSize={12} >{asyncGetData.userName} </Typography>
              <Typography color='#8C8C8C' fontSize={12} >{asyncGetData.userChurch}</Typography>
            </View>
            <TouchableOpacity
              style={styles.addSuggestionButton}
              onPress={addSuggestion}
            > 
              <Entypo name="pencil" size={15} color="#fff"/>
            </TouchableOpacity>
          </View>
          <Divider height={2} marginVertical={15}/>
          <Typography marginBottom={20} color='#8C8C8C' fontSize={12}>* 문의 목록 (최근 10개의 게시글만 보여집니다.)</Typography>
          {
            suggestionToShow.slice(0,10).map((item:any, index:any)=>{

              return(
                <View key={index} style={{minHeight:50}}>
                  <Typography marginBottom={10} >{item.content}</Typography>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Typography color='#8C8C8C' fontSize={12} >{DateFormmating(item.date)}</Typography>
                    <View style={{flexDirection:'row', marginBottom:5}}>
                      <Typography color='#8C8C8C' fontSize={12} >{item.userName} </Typography>
                      <Typography color='#8C8C8C' fontSize={12} >{item.userChurch === '테스트교회' ? '미정' : item.userChurch}</Typography>
                    </View>
                  </View>
                  {
                    item.response &&
                    <View style={{marginVertical:10, flexDirection:'row'}}>
                      <MaterialCommunityIcons name='arrow-right-bottom' color='#BDBDBD' size={12} style={{marginRight:5}}/>
                      <View style={{ width:'90%', flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
                        <Typography  fontSize={14}>{item.response}</Typography>
                      </View>
                    </View>
                  }
                  <View style={{alignItems:'flex-end'}}>
                    <TouchableOpacity
                      onPress={()=>{
                        deleteSuggestion(item)
                      }}
                    >
                      { 
                        asyncGetData.userName === item.userName &&
                        <Typography color='#8C8C8C' fontSize={12}>
                          <Text style={{textDecorationLine:'underline'}}>삭제하기</Text>
                        </Typography>
                      }
                      
                    </TouchableOpacity>
                  </View>
                  <Divider height={1} marginVertical={10} />
                </View>
              )
            })
          }
          {
            !showAllPosts
            && 
            <TouchableOpacity
              style={styles.button} 
              onPress={()=>{
                setShowAllPosts(true);
              }}
            >
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Typography color='#8C8C8C'  fontSize={14}>더보기 </Typography>
                <AntDesign name="down" size={16} color="#8C8C8C"/>
              </View>
            </TouchableOpacity>
          }
          <View style={{height:150}}></View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fff'
  },
  section :{
    padding:20
  },
  addTitleBox: {
    marginBottom: 8,
  },
  addTitleText2: {
    fontSize: 16,
    marginHorizontal: 3,
  },
  addTitleTextbox: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center'
  },
  addSuggestionInput: {
    minHeight: 50,
    height: 'auto',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  addSuggestionButton: {
    width:50,
    height:40,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  button: {
    borderBottomWidth:1,
    borderColor: '#EAEAEA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },

});


