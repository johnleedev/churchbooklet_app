import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { Typography } from '../../Components/Typography';
import { SubTitle } from '../../Components/SubTitle';

function Question (props : any) {
    return (
      <View style={{flex:1}}>
       <SubTitle title='문의하기' enTitle='Question' navigation={props.navigation}/>
       <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:20}}>
          <Typography marginBottom={10}> 메일&카카오톡으로 문의해주세요 </Typography>
          <Typography marginBottom={10}> thebetterpeople@naver.com </Typography>
          <Typography marginBottom={10}> 카카오톡 ID : thebetterpeople </Typography>
        </View>
    </View>
    );
  }

export default Question ;
