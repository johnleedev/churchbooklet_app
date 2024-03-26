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

export default function RegisterBoard (props : any) {

  interface ChurchsProps {
    id: number;
    churchName : string;
    religiousbody : string;
    churchAddress: string;
    churchPhone: string;
    churchPastor: string;
  }

  const [churchs, setChurchs] = useState<ChurchsProps[]>([]);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);

  const fetchPosts = () => {
    axios.get(`${MainURL}/churchs/getchurchs`).then((res) => {
      if (res.data) {
        setIsResdataFalse(false);
        let copy: any = [...res.data];
        copy.reverse();
        setChurchs(copy)
      } else {
        setIsResdataFalse(true);
      }
      
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);


  return (
    <View style={styles.container}>
      <Title title='새로 등록된 교회' enTitle='New'/>
      <View style={{paddingHorizontal:20, width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
        <Typography fontSize={12} color='#8C8C8C'>최근 10개 까지만 보여집니다.</Typography>
      </View>
      <View style={styles.section}>
        {
          churchs.slice(0,10).map((item:any, index:any)=>{

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={index} 
                style={{marginVertical:10}}
                onPress={()=>{
                  props.navigation.navigate("Navi_ChurchSearch", {screen : "ChurchSearchDetail", params: { data: item, sort : 'search' }});
                }}
              >
                <View style={{flexDirection:'row', alignItems:'center', marginBottom:15}}>
                  <View style={{width:'90%', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <Typography fontWeightIdx={1} fontSize={18}>{item.churchName}</Typography>
                    <View style={{alignItems:'flex-end'}}>
                      <Typography fontSize={14} color='#8C8C8C'>{item.religiousbody}</Typography>
                      <Typography fontSize={14} color='#8C8C8C'>{item.churchAddressCity} {item.churchAddressCounty}</Typography>
                    </View>
                  </View>
                  <View style={{width:'10%', alignItems:'flex-end'}}>
                    <AntDesign name='right'/>
                  </View>
                </View>
                <Divider/>
              </TouchableOpacity>
            )
          })
        } 
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
  

});


