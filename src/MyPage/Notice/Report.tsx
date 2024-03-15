import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Modal, ScrollView } from 'react-native';
import axios from 'axios'
import MainURL from "../../../MainURL";
import AsyncGetItem from '../../AsyncGetItem'
import Entypo from 'react-native-vector-icons/Entypo';
import { Typography } from '../../Components/Typography';
import { SubTitle } from '../../Components/SubTitle';
import { ButtonBox } from '../../Components/ButtonBox';
import { Divider } from '../../Components/Divider';
import { useRoute } from '@react-navigation/native';

export default function Report (props: any) {

  const route : any = useRoute();
  const [reportPart, setReportPart] = useState(route.params === null || route.params === undefined ? '' : route.params.data);
  const [content, setContent] = useState('');

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
   
  useEffect(() => {
    asyncFetchData();
  }, []);

  const createPost = async () => {
    const currentTime = new Date();
    const currentDate = currentTime.toISOString().slice(0, 19);

    axios
    .post(`${MainURL}/mypage/reportposts`, {
      reportPart : reportPart,
      content: content, 
      date: currentDate,
      userAccount : asyncGetData.userAccount
    })
    .then((res) => {
      if (res.data === true) {
        Alert.alert('신고가 접수되었습니다. 검토까지는 최대24시간 소요됩니다.')
        props.navigation.replace('MyPageMain');
      } else {
        Alert.alert(res.data)
      }
    })
    .catch(() => {
      console.log('실패함')
    })
  };

  const closeDetail = () => {
    props.navigation.navigate('MyPageMain');
  };

  const [isPartModalVisible, setPartModalVisible] = useState(false);
  const partToggleModal = () => {
    setPartModalVisible(!isPartModalVisible);
  };
  
  const part = ["잘못된 정보", "상업적 광고", "음란물", "폭력성", "기타"]

  return (
    <View style={{flex:1}}>
      <ScrollView style={styles.container}>
        <SubTitle title='신고하기' enTitle='Report' navigation={props.navigation}/>
        <Divider height={2} />
        <View style={styles.section}>
        <View style={styles.userBox}>
          <Typography><Entypo name="pencil" size={20} color="black"/> </Typography>
          <Typography>{asyncGetData.userName} </Typography>
          <Typography color='#8C8C8C'>{asyncGetData.userChurch}</Typography>
        </View>

        <View style={styles.addPostBox}>
          <Typography marginBottom={10}>* 신고사유</Typography>
          <TouchableOpacity
              onPress={partToggleModal}
          >
            <View style={[styles.input, {width: '100%', alignItems:'center'}]}>
              <Typography>
                {reportPart === '' ? '신고 사유를 선택해 주세요' : reportPart}
              </Typography>
            </View>
          </TouchableOpacity>

          <Typography marginBottom={10}>* 내용</Typography>
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="내용을 입력해주세요"
            value={content}
            onChangeText={setContent}
            multiline
          />
        </View>

        <ButtonBox leftFunction={closeDetail} leftText='취소' rightFunction={createPost} rightText='작성'/>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isPartModalVisible}
          onRequestClose={partToggleModal}
        >
          <View style={{ width: '100%', position: 'absolute', bottom:0, borderRadius: 20, backgroundColor: 'white', 
                        padding: 20, borderTopWidth:1, borderTopColor:'#EAEAEA'}}>
              <Typography marginBottom={10}>* 사유선택</Typography>
              <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap:'wrap', }}>
              {
                part.map((item, index)=>{
                  return(
                    <TouchableOpacity 
                      key={index}   
                      onPress={()=>{
                        setReportPart(item);
                        partToggleModal();
                      }} 
                      style={{width: '48%', height: 50, borderWidth:1, borderColor: '#EAEAEA'}}
                      >
                        <View style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
                          <Typography fontSize={14}>{item}</Typography>
                        </View>
                    </TouchableOpacity> 
                  )
                })
              }
              </View>
          </View>
        </Modal>
      </ScrollView>
      <View style={ isPartModalVisible ? styles.modalBackCover :  { display: 'none'}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  section : {
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  addPostBox: {
    marginBottom: 8,
    padding:10
  },
  addTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  userBox: {
    padding:15,
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    height: 'auto',
    color: '#333'
  },
  titleInput: {
    minHeight: 40,
  },
  contentInput: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  modalBackCover : {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    opacity: 0.8
  },

});

 
