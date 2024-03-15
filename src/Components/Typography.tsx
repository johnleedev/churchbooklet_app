import React from 'react';
import { Text as RNText } from 'react-native';

const fontFamilies = ['Pretendard-Bold', 'Pretendard-SemiBold', 'Pretendard-Regular', 'Pretendard-Light', 'Pretendard-Thin']

export const Typography:React.FC<{
    fontWeightIdx?: number,
    color?:string,
    fontSize?:number,
    marginBottom?:number,
    children:React.ReactElement | any | React.ReactElement[]
}> = (props)=>{
    
  return (
    <RNText 
      style={{
        fontFamily: fontFamilies[props.fontWeightIdx ?? 2],
        color: props.color ?? '#000',
        fontSize: props.fontSize ?? 16,
        marginBottom: props.marginBottom ?? null,
      }}
      >
      {props.children}
    </RNText>
  )
}
