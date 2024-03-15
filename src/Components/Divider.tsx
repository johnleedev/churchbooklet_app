import React from 'react';
import { View } from 'react-native';

export const Divider:React.FC<{
    height?:number,
    marginVertical?:number
}> = (props)=>{
    
  return (
    <View
      style={{
        width: '100%',
        height: props.height ?? 1,
        marginVertical: props.marginVertical ?? 0,
        backgroundColor: '#F5F4F3'
      }}
      >
    </View>
  )
}
