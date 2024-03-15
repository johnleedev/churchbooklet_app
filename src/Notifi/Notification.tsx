import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios'
import MainURL from "../../MainURL";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SubTitle } from '../Components/SubTitle';
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import DateFormmating from '../Components/DateFormmating';
import { useRoute } from '@react-navigation/native';

export default function Notification (props : any) {

  const [notifications, setNotifications] = useState<any>([]);
  const fetchData = async () => {
    try {
      const res = await axios.get(`${MainURL}/notification/notifigetlist`);
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
  const day = today.getDate();
  const currentDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  const todayNotifiCopy = notifications.filter((e : any) => e.date === `${currentDate}`);
  const todayNotifi = todayNotifiCopy.reverse();
  const lastNotifiCopy = notifications.filter((e : any) => e.date !== `${currentDate}`);
  const lastNotifi = lastNotifiCopy.reverse();

  return (
    <ScrollView style={styles.container}>

      <SubTitle navigation={props.navigation} title='알림' enTitle='Notification'/>
      
      <Divider height={2} />

      <View style={styles.section}>
        <Typography fontSize={18} fontWeightIdx={1}>오늘의 알림</Typography>

        <View style={{position:'absolute', right:20, top:10}}>
          <TouchableOpacity
            onPress={()=>{
              props.navigation.navigate('NotificationSetting', {userAccount : ''})
            }}
          > 
            <AntDesign name="setting" size={20} color="black" style={{padding:10}}/>
          </TouchableOpacity>
        </View>   

        {todayNotifi?.length > 0 ? (
          todayNotifi?.map((item : any, index : any) => (
            <View key={index}
              style={{marginVertical: 10, borderWidth:1, borderColor:'#BDBDBD', borderRadius:10, padding:10}} 
            >
              <Typography marginBottom={5} fontWeightIdx={1}>{item.notifiTitle}</Typography>
              <Typography fontSize={14} >{item.notifiMessage}</Typography>
              <View style={{width:'100%', alignItems:'flex-end'}}>
                <Typography fontSize={12} color='#8C8C8C'>{DateFormmating(item.date)}</Typography>
              </View>
            </View>
          ))
        ) : (
          <Text style={{textAlign: 'center', margin: 20}}>오늘의 알림이 없습니다.</Text>
        )}
      </View>

      <Divider height={2} />

      <View style={styles.section}>
      <Typography fontSize={18} fontWeightIdx={1}>지난 알림</Typography>
      {
        lastNotifi.map((item: any, index: any)=>{
          return (
            <View key={index}
              style={{marginVertical: 10, borderWidth:1, borderColor:'#BDBDBD', borderRadius:10, padding:10}} 
            >
              <Typography marginBottom={5}  fontWeightIdx={1}>{item.notifiTitle}</Typography>
              <Typography fontSize={14} >{item.notifiMessage}</Typography>
              <View style={{width:'100%', alignItems:'flex-end', marginTop:10}}>
                <Typography fontSize={12} color='#8C8C8C'>{DateFormmating(item.date)}</Typography>
              </View>
            </View>
          )
        })
      }
      </View>
    </ScrollView> 
   );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20
  },

});

