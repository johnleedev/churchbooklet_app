import React from 'react';
import {View, Text, Button} from 'react-native';
import { WebView } from 'react-native-webview';
import { SubTitle } from '../../Components/SubTitle';

function PersonInfo (props : any) {

  const Url = `https://churchbooklet.com/personalinfo.html`;

  return (
    <View style={{ flex: 1, backgroundColor:'#fff'}}>
      <SubTitle title='개인정보처리방침' enTitle='persinalInfo' navigation={props.navigation}/>
      <View style={{flex: 1, padding:20}}>
      <WebView 
        style={{flex:1, alignItems:'center', justifyContent:'center'}}
        source={{ uri: Url }}
      />
      </View>
    </View>
  );
}

export default PersonInfo ;
