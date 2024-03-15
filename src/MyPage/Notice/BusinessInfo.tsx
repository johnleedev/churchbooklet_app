import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { Typography } from '../../Components/Typography';
import { SubTitle } from '../../Components/SubTitle';

export default function BusinessInfo (props : any) {
    return (
      <View style={{flex:1, backgroundColor:'#fff'}}>
       <SubTitle title='사업자정보' navigation={props.navigation} enTitle='BusinessInfo'/>
       <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:20}}>
          <Typography marginBottom={10}>더좋은사람들</Typography>
          <Typography marginBottom={10}>사업자등록번호 : 736-29-01512</Typography>
          <Typography marginBottom={10}>통신판매업 신고번호 : 2023-대구달성-1006호</Typography>
          <Typography marginBottom={10}>대표 E-Mail : thebetterpeople@naver.com</Typography>
          <Typography marginBottom={10}>대표 카카오톡 ID : thebetterpeople</Typography>
        </View>
    </View>
    );
  }


