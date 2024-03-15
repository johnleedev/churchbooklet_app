import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Typography } from './Typography';

export const ButtonBox :React.FC<{
    leftFunction: () => void;
    leftText: string,
    rightFunction: () => void;
    rightText: string,
    marginTop?: number,
    marginBottom? : number
}> = (props)=>{
    
  return (
    <View style={{flexDirection:'row', justifyContent:'center', marginTop: props.marginTop ?? null, marginBottom: props.marginBottom ?? null}}>
          
      <View style={styles.ButtonBox}>
        <TouchableOpacity 
          style={[styles.Button, {borderColor: '#8C8C8C'}]} 
          onPress={props.leftFunction}>
          <Typography color='#8C8C8C' fontWeightIdx={1}>{props.leftText}</Typography>
        </TouchableOpacity>
      </View>

      <View style={styles.ButtonBox}>
        <TouchableOpacity 
          style={[styles.Button, {borderColor: '#333'}]} 
          onPress={props.rightFunction}>
          <Typography fontWeightIdx={1}>{props.rightText}</Typography>
        </TouchableOpacity>
      </View>

    </View>
  )
}


const styles = StyleSheet.create({
  ButtonBox: {
    width: '48%',
    alignItems:'center',
    marginBottom:20,
  },
  Button: {
    width: '90%',
    borderWidth:1, 
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'center',
  },
})