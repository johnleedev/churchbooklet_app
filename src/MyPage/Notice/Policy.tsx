import React from 'react';
import {View, Text, Button} from 'react-native';
import { WebView } from 'react-native-webview';
import { SubTitle } from '../../Components/SubTitle';

function Policy (props : any) {

  const Url = `https://churchbooklet.com/usingpolicy.html`;

  return (
    <View style={{ flex: 1, backgroundColor:'#fff'}}>
      <SubTitle title='이용표준약관' enTitle='usingpolicy' navigation={props.navigation}/>
      <View style={{flex: 1, padding:20}}>
      <WebView 
        style={{flex:1, alignItems:'center', justifyContent:'center'}}
        source={{ uri: Url }}
      />
      </View>
    </View>
  );
}

export default Policy ;
