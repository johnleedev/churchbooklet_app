import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Typography } from './Typography';

export const SubTitle :React.FC<{
    navigation:any,
    title?: string,
    enTitle?: string,
    paddingHorizontal? : number,
    paddingVertical? : number
}> = (props)=>{
    
  return (
    <View style={[styles.contentTitleBox, {paddingHorizontal: props.paddingHorizontal ?? 20, paddingVertical : props.paddingVertical ?? 10}]}>
      <View style={{flex:1, alignItems:'flex-start'}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={()=>{
            props.navigation.goBack()
          }}>
           <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{flex:2, alignItems:'center'}}>
        <Typography fontSize={18} fontWeightIdx={1}>{props.title}</Typography>
      </View>
      <View style={{flex:1, alignItems:'flex-end'}}>
        <Typography color='#C9AE00' fontSize={12} >{props.enTitle}</Typography>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  contentTitleBox : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent:'center',
  },
})