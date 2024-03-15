import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, 
          Platform, TextInput, KeyboardAvoidingView, RefreshControl } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import MainURL from "../../MainURL";
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import AsyncGetItem from '../AsyncGetItem';
import DateFormmating from '../Components/DateFormmating';


export default function ChurchNoticeDetail (props: any) {

  const route : any = useRoute();
  const [asyncGetData, setAsyncGetData] = useState<any>();
  const [isUser, setIsUser] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      setAsyncGetData(data);
      if (route.params.data.userAccount === data?.userAccount) {
        setIsUser(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    asyncFetchData();
  }, []);

  const deletePost = () => {
    axios
      .post(`${MainURL}/churchs/postnoticedelete/${route.params.data.id}`, {
        postId : route.params.data.id,
        userAccount: asyncGetData.userAccount,
        churchKey : route.params.churchKey
      })
      .then((res) => {
        if (res.data === true) {
          Alert.alert('삭제 되었습니다.');
          props.navigation.replace('ChurchMain');
        } else if (res.data === false) {
          Alert.alert('다시 시도해주세요');
        }
      });
  };

  const handleReport = () => {
    {
      Platform.OS === 'ios' ?
      Alert.alert('신고 사유를 선택해 주세요.', '신고 사유에 맞지 않는 신고일 경우, 해당 신고는 처리되지 않으며, 누적 신고횟수가 3회 이상인 사용자는 게시판 글 작성에 제한이 있게 됩니다.', [
        { text: '잘못된 정보', onPress: () => compeleteReport('잘못된 정보') },
        { text: '상업적 광고', onPress: () => compeleteReport('상업적 광고') },
        { text: '음란물', onPress: () => compeleteReport('음란물') },
        { text: '폭력성', onPress: () => compeleteReport('폭력성') },
        { text: '기타', onPress: () => compeleteReport('기타') },
        { text: '취소', onPress: () => { return }},
      ])
      :
      Alert.alert('신고 사유를 선택해 주세요.', '신고 사유에 맞지 않는 신고일 경우, 해당 신고는 처리되지 않으며, 신고 사유에 맞는 신고일 경우, 신고된 사용자는 게시판 글 작성에 제한이 있게 됩니다.', [
        { text: '잘못된 정보 & 상업적 광고', onPress: () => compeleteReport('잘못된 정보 & 상업적 광고') },
        { text: '기타', onPress: () => compeleteReport('기타') },
        { text: '취소', onPress: () => { return }},
      ]);
    }
  };

  const compeleteReport = (reportPart : string) => { 
    props.navigation.navigate('Navi_MyPage', {
      screen: 'Report',
      params: { data : reportPart }
    });
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 100}
        style={{flex:1}}
      >
      
      <View style={{padding:15}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={()=>{
            props.navigation.goBack()
          }}>
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
      </View>
      
      <Divider/>

      <ScrollView  style={styles.container}>

        <View style={styles.section}>
          <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center', marginBottom:15}}>
            <Typography fontSize={14} color='#D76F23'>교회소식</Typography>  
            {isUser ? 
            <TouchableOpacity 
              onPress={() => setIsModalVisible(true)}
              style={{position:'absolute', right: 0, paddingHorizontal:10}}>
              <Typography><Entypo name="dots-three-vertical" size={15} color="black" /></Typography>
            </TouchableOpacity>
            : null}
          </View>
          <Typography fontSize={20} marginBottom={10} fontWeightIdx={1}>{route.params.data?.title}</Typography>
          <View style={[styles.titleContainer, {justifyContent:'space-between', marginBottom: 8}]}>
            <Typography color='#333' fontSize={13} >{DateFormmating(route.params.data?.date)}</Typography>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Ionicons name="eye-outline" size={14} color="#E7AA0E" />
              <Typography color='#E7AA0E' fontSize={13} > {route.params.data?.views}</Typography>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Typography color='#333' fontSize={13} >{route.params.data?.userName} </Typography>
            <Typography color='#8C8C8C' fontSize={13} >{route.params.data?.userDuty === 'null' ? '미정' : route.params.data?.userDuty}</Typography>
          </View>
        </View>   
          
        <Divider height={2} />
      
        <View style={[styles.section, {marginBottom:20, minHeight:300}]}>
          <Typography><Text style={{lineHeight:30}}>{route.params.data?.content}</Text></Typography>
        </View>
        
        <Divider height={2}/>
        
             
        {/* 수정&삭제 모달 */}
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
          >
          <View style={styles.modalContainer}>
            
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.modalEmpty}
              >
              <View></View>
            </TouchableOpacity>
            <View style={styles.modalContents}>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  props.navigation.navigate('ChurchNoticePost', {
                    post: route.params.data,
                    editMode: true,
                    churchKey : route.params.churchKey
                  });
                }}
                style={styles.modalButton}
              >
                <Typography>수정</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  deletePost();
                  setIsModalVisible(false);
                }}
                style={styles.modalButton}
              >
                <Typography>삭제</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.modalButton}
              >
                <Typography>취소</Typography>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>  

        <TouchableOpacity
          hitSlop={{ top: 15, bottom: 15 }}
          style={styles.reportContainer}
          onPress={handleReport}
        >
          <Typography color='#8C8C8C' fontSize={12}>
            <Text style={{textDecorationLine:'underline'}}>이 글 신고하기</Text>
          </Typography>
        </TouchableOpacity> 

      </ScrollView>
      </KeyboardAvoidingView>

    </View>
  );
};

const styles = StyleSheet.create({
  // posts
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section : {
    padding: 20
  },
  backButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent:'center',
  },
  commentBox: {
    marginTop: 30,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dddddd',
    padding: 16,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  postTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  authorText : {
    color: '#8C8C8C'
  },
  postContent: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 25
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5
  },

  // buttons
  commentButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  Button: {
    width: 120,
    height: 50,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent:'center',
    flexDirection:'row'
  },
  ButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addCommentInput: {
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

  // comments
  commentContainer: {
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333333',
  },
  commentItem: {
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // modalContainer
  modalContainer: {
    flex: 1,
  },
  modalEmpty: {
    flex: 1,
    backgroundColor: '#8C8C8C',
    opacity: 0.3
  },
  modalContents: {
    height: 200,
    backgroundColor: '#fff',
    paddingBottom: 30,
    elevation: 10,
    borderRadius: 4,
  },
  modalButton: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  reportContainer : {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 20,
    height: 50,
    marginBottom: 30
  }
});


