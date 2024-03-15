import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import axios from 'axios'
import MainURL from "../../MainURL";
import { SubTitle } from '../Components/SubTitle';
import { Divider } from '../Components/Divider';
import { Typography } from '../Components/Typography';
import { ButtonBox } from '../Components/ButtonBox';
import AsyncGetItem from '../AsyncGetItem';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface CustomSwitchProps {
  title: string;
  value: boolean | null;
  setValue: (value: boolean) => void;
  toggleFuncfion: () => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ title, value, setValue, toggleFuncfion }) => {
  LayoutAnimation.easeInEaseOut();
  return (
    <TouchableOpacity 
      onPress={()=>{
        setValue(!value);
        toggleFuncfion();
      }} 
      activeOpacity={0.8} 
     style={styles.switchContainer}
    >
      <Typography>{title}</Typography>
      <View style={[styles.switch, {alignItems: value === true ? 'flex-end' : 'flex-start', backgroundColor: value === true ? '#47C83E' : '#BDBDBD'}]}>
        <View style={styles.switchButton} />
      </View>
    </TouchableOpacity>
  );
};

export default function NotificationSetting (props : any) {

  const [refresh, setRefresh] = useState<boolean>(false);

  // AsyncGetData
  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      await new Promise((resolve : any) => {
        setAsyncGetData(data);
        resolve();
      });
      if (data?.userAccount) {
        fetchPosts(data?.userAccount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = (userAccount : string) => {
    axios.get(`${MainURL}/notification/usernotifiinfo/${userAccount}`).then((res) => {
      let copy: any = res.data[0];
      setIsNotifiAll(JSON.parse(copy.notifiNotice));
      setIsNotifiNotice(JSON.parse(copy.notifiNotice));
      setIsNotifiBoard(JSON.parse(copy.notifiBoard));
      setIsNotifiInfo(JSON.parse(copy.notifiInfo));
      setIsNotifiOurConcour(JSON.parse(copy.notifiOurConcour));
    });
  };

  useEffect(() => {
    asyncFetchData();
  }, [refresh]);

  const [isNotifiAll, setIsNotifiAll] = useState<boolean | null>(null);
  const [isNotifiNotice, setIsNotifiNotice] = useState<boolean | null>(null);
  const [isNotifiBoard, setIsNotifiBoard] = useState<boolean | null>(null);
  const [isNotifiInfo, setIsNotifiInfo] = useState<boolean | null>(null);
  const [isNotifiOurConcour, setIsNotifiOurConcour] = useState<boolean | null>(null);

  const handleToggleNotifiAll = () => {
    if (isNotifiAll === true) {
      setIsNotifiAll(false)
      setIsNotifiNotice(false);
      setIsNotifiBoard(false);
      setIsNotifiInfo(false);
      setIsNotifiOurConcour(false);
    } else {
      setIsNotifiAll(true);
      setIsNotifiNotice(true);
      setIsNotifiBoard(true);
      setIsNotifiInfo(true);
      setIsNotifiOurConcour(true);
    }
  };

  const handleToggleNotifiNotice = () => {
    setIsNotifiNotice(!isNotifiNotice);
  };

  const handleToggleNotifiBoard = () => {
    setIsNotifiBoard(!isNotifiBoard);
  };

  const handleToggleNotifiInfo = () => {
    setIsNotifiInfo(!isNotifiInfo);
  };

  const handleToggleNotifiOurConcour = () => {
    setIsNotifiOurConcour(!isNotifiOurConcour);
  };

  const handleSaveSettings = () => {
    axios
      .post(`${MainURL}/notification/setting`, {
        userAccount : asyncGetData.userAccount,
        notifiAll : isNotifiAll,
        notifiBoard : isNotifiBoard,
        notifiInfo : isNotifiInfo,
        notifiNotice : isNotifiNotice,
        notifiOurConcour : isNotifiOurConcour
      })
      .then((res) => {
        if (res.data === true) {
          Alert.alert('입력되었습니다.');
          setRefresh(!refresh);
          props.navigation.replace('Notification');
        } else {
          Alert.alert(res.data)
        }
      })
      .catch(() => {
        console.log('실패함')
      })
  };

  const closeNotifiSetting = () => {
    props.navigation.goBack();
  };


 
  return (
    <View style={styles.container}>
      
      <SubTitle navigation={props.navigation} title='알림설정' enTitle='Setting'/>
      
      <Divider height={2} />
      
      <View style={styles.section}>
        <CustomSwitch title='전체 푸시 알림' value={isNotifiAll} setValue={setIsNotifiAll} toggleFuncfion={handleToggleNotifiAll} />
        <Divider height={2} />
      </View>

      <View style={[styles.section, {flex:1}]}>
        <CustomSwitch title='공지사항 알림' value={isNotifiNotice} setValue={setIsNotifiNotice} toggleFuncfion={handleToggleNotifiNotice} />
        <CustomSwitch title='게시판 새글 알림' value={isNotifiBoard} setValue={setIsNotifiBoard} toggleFuncfion={handleToggleNotifiBoard} />
      </View>

      <ButtonBox leftFunction={closeNotifiSetting} leftText='취소' rightFunction={handleSaveSettings} rightText='설정완료' />

    </View> 
   );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom:10
  },
  section: {
    padding: 20
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom:20
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding:2
  },
  switchButton : {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor:'#fff',
  }
});

