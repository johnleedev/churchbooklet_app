import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';

export const Title :React.FC<{
    title : string,
    enTitle : string,
    paddingHorizontal? : number,
    paddingVertical? : number
}> = (props)=>{
    
  return (
    <View style={{marginTop:15, paddingHorizontal: props.paddingHorizontal ?? 20, paddingVertical : props.paddingVertical ?? 10}}>
      <View style={{flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', marginBottom:5}}>
        <Typography fontSize={20} fontWeightIdx={0}>{props.title}</Typography>
        <Typography color='#C9AE00' fontSize={14} >{props.enTitle}</Typography>
      </View>
    </View>
  )
}

