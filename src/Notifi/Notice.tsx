import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import MainURL from "../../MainURL";
import { Typography } from '../Components/Typography';
import { SubTitle } from '../Components/SubTitle';
import { Divider } from '../Components/Divider';
import DateFormmating from '../Components/DateFormmating';

const Stack = createNativeStackNavigator();

const NoticeDetail = (props : any) => {
  
  const data = props.route.params.data;

  return (
    <View style={styles.container}>
      <SubTitle title='' enTitle='' navigation={props.navigation}/>
      <Divider/>
      <View style={styles.noticeContainer}>
        <Typography fontSize={18} marginBottom={10} fontWeightIdx={1}>{data.title}</Typography>
        <Typography fontSize={12} color='#8C8C8C' >{data.date}</Typography>
        <Divider height={2} marginVertical={10}/>
        <Typography marginBottom={4} >{data.content}</Typography>
      </View>
    </View>
  );
};

const Notice = () => {

  const [data, setDate] = useState<any>([]);

  const getNotice = () => {
    axios
    .get(`${MainURL}/notice/noticelist`)
    .then((res) => {
      let copy: any = [...res.data];
      copy.reverse();
      setDate(copy);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  useEffect(() => {
    getNotice();
  }, []);

  const NoticeList = ( props :any) => {
    return (
      <View style={styles.container}>

        <SubTitle title='공지사항' enTitle='Notice' navigation={props.navigation}/>
        <Divider height={2}/>
        
        <View style={styles.section}>
        {
          data.map((item:any, index:any)=>{
            return(
              <TouchableOpacity
                key={index}
                style={styles.item}
                onPress={() => props.navigation.navigate('NoticeDetail', { data : item })}
              >
                <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:5}}>
                  <View>
                    <Typography marginBottom={4} fontWeightIdx={1}>{item.title}</Typography>
                    <Typography fontSize={14} >{item.date}</Typography>
                  </View>
                  <AntDesign name='right'/>
                </View>
                <Divider height={2} marginVertical={5}/>
              </TouchableOpacity>
            )
          })
        }
        </View>
      </View>
    );
  };

  return (
    <Stack.Navigator 
      initialRouteName="NoticeList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="NoticeList" component={NoticeList}/>
      <Stack.Screen name="NoticeDetail" component={NoticeDetail}/>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
  },
  section: {
    padding:20
  },
  item: {
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  noticeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding:20
  },
  
});

export default Notice;
