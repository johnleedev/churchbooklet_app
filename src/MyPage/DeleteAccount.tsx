import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios'
import MainURL from "../../MainURL";
import AsyncGetItem from '../AsyncGetItem'
import { Typography } from '../Components/Typography';
import { Title } from '../Components/Title';
import { Divider } from '../Components/Divider';
import { ButtonBox } from '../Components/ButtonBox';

function DeleteAccount (props: any) {

  const [check, setCheck] = useState<boolean>(false);

  // AsyncGetData
  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const [userAccount, setUserAccount] = useState('');
  const [userImage, setUserImage] = useState('');
  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      if (data) {
        await axios.get(`${MainURL}/mypage/getprofile/${data.userAccount}`).then((res) => {
          setUserAccount(res.data[0]?.userAccount);
          setUserImage(res.data[0]?.userImage);
        });
      }
      setAsyncGetData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()=>{
    asyncFetchData();
  }, [])

  const handelCheck = () => {
    setCheck(!check);
  };

  const handelAction = () => {
    if (check) {
      Alert.alert('정말 탈퇴 하시겠습니까?', '탈퇴 시 유의사항을 충분히 확인하시기 바랍니다.', [
        { text: '취소', onPress: () => props.navigation.pop() },
        { text: '탈퇴', onPress: () => deleteAccount() }
      ]);
    } else {
      Alert.alert('위 확인 버튼에 체크해주세요.')
    }
    
  };
 

  const deleteAccount = async () => {
    axios
      .post(`${MainURL}/login/deleteaccount`, {
        userAccount: userAccount, 
        userImage: userImage
      })
      .then((res) => {
        if (res.data) {
          Alert.alert('탈퇴 되었습니다.');
          AsyncStorage.removeItem('token');
          AsyncStorage.removeItem('account');
          AsyncStorage.removeItem('name');
          AsyncStorage.removeItem('church');
          AsyncStorage.removeItem('churchkey');
          AsyncStorage.removeItem('duty');
          props.navigation.replace("Navi_Login");
        } else {
          Alert.alert('다시 시도해주세요.');
          props.navigation.replace("Navi_Login");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClose = () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>

      {/* title */}
      <Title title='탈퇴하기' enTitle='DeleteAccount'/>
      <Divider/>

      <View style={styles.titleContainer}>
        <Typography marginBottom={10}>탈퇴시 모든 정보가 사라지며, 복구할 수 없습니다.</Typography>
      </View> 

      <View style={styles.noticeContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AntDesign name="warning" size={20} color="red" />
          <Typography fontSize={24} fontWeightIdx={1}> 유의 사항 안내</Typography>
        </View>
        
        <View style={styles.noticeBox}>
          <View style={styles.noticeTextBox}>
            <Typography marginBottom={10} >1. 회원 탈퇴 시, 즉시 탈퇴 처리되며, 서비스 이용이 불가합니다. </Typography>
            <Typography marginBottom={10} >2. 기존에 작성한 게시물 및 댓글은 자동으로 삭제되지 않습니다. 
              또한 탈퇴 이후에는 작성자 본인을 확인할 수 없으므로, 삭제 처리도 불가합니다.</Typography>
            <Typography >3. 회원 정보는 탈퇴 즉시 삭제되지만, 부정 이용 거래 방지 및 전자상거래법 등
              관련 법령에 따라, 보관이 필요할 경우 해당 기간 동안 회원 정보가 보관 될 수 있습니다.</Typography>
          </View>

        </View>

        <View style={styles.checkButtonBox}>
          <TouchableOpacity
            hitSlop={{ top: 15, bottom: 15 }}
            style={styles.checkButton}
            onPress={handelCheck}
          >
          <View style={{flexDirection:'row', alignItems:'center'}}>
            {
              check ? <AntDesign name="checkcircle" size={20} color="red" />
            : <AntDesign name="checkcircleo" size={20} color="black" />
            }
            <Typography fontSize={20} fontWeightIdx={1}>  위 유의사항을 확인하였습니다.</Typography>
          </View>
          </TouchableOpacity> 
        </View>

        <View style={styles.actionButtonBox}>
          <ButtonBox leftFunction={handleClose} leftText='취소' rightFunction={handelAction} rightText='탈퇴'/>
        </View>
        

      </View>
    </View>
  );
}

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  titleContainer: {
    height: 80,
    justifyContent: 'center',
    padding: 20,
  },
  noticeContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noticeBox: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  noticeTextBox: {
    marginVertical: 15
  },
  checkButtonBox: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent:'center',
    flexDirection: 'row',
  },
  checkButton: {

  },
  handleButtonBox : {

  },
  actionButtonBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems:'center',
    marginBottom:20
  },
  actionButton: {
    width: 300,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  }
})  