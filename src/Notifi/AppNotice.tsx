import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Text, Linking } from 'react-native';
import { Typography } from '../Components/Typography';
import MainImageURL from "../../MainImageURL";
import { Divider } from '../Components/Divider';
import { SubTitle } from '../Components/SubTitle';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function AppNotice(props : any) {

  interface NoticeProps {
    width: number;
    title: string;
    content : string;
  }
  
  const TextBox : React.FC<NoticeProps> = ({ width, title, content }) => (
    <View style={styles.section}>
      <View style={{flexDirection:'row', marginBottom:10}}>
        <Image
          source={require("../images/orangetitle.png")}
          style={{width:width, height:50, resizeMode:'cover', opacity:0.5, marginRight:5}}>
        </Image>
        <View style={{position:'absolute', bottom:10, left:7}}>
          <Typography fontSize={25} fontWeightIdx={1} marginBottom={5}>{title}</Typography>
        </View>
      </View>
      <View>
        <Typography fontSize={18}><Text style={{lineHeight:30}}>{content}</Text></Typography>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      
      {/* title */}
      <SubTitle title='사용설명서' navigation={props.navigation}/>
                
      <Divider height={2} />

      <ScrollView>
        <TextBox width={150} title='내 교회 찾기' content={`화면 아래 2번째 탭(내교회)에서 교회 등록 버튼을 누르셔서, 교회 정보를 입력하시면 됩니다.`}/>
        <View style={[styles.section, {alignItems:'center'}]}>
          <Image
            source={require("../images/notice/notice3.jpeg")}
            style={{width:350, height:600, resizeMode:'contain', borderRadius:10}}>
          </Image>
          <Image
            source={require("../images/notice/notice7.jpeg")}
            style={{width:350, height:530, resizeMode:'contain', borderRadius:10}}>
          </Image>
          <Image
            source={require("../images/notice/notice4.jpeg")}
            style={{width:350, height:600, resizeMode:'contain', borderRadius:10}}>
          </Image>
        </View>
        <TextBox width={180} title='등록 승인 대기' content={`내교회로 등록하게 되면 '승인 대기' 상태가 됩니다. 교회 담당자의 승인을 받아야, 정식으로 사용할 수 있습니다.`}/>
        <View style={[styles.section, {alignItems:'center'}]}>
          <Image
            source={require("../images/notice/notice8.jpeg")}
            style={{width:350, height:430, resizeMode:'contain', borderRadius:10}}>
          </Image>
        </View>
        <TextBox width={180} title='어플 링크 전송' content={`내교회 등록이 완료되고 나면, 교회 정보가 정식으로 보여지게 됩니다. 상단 오른쪽에 공유 버튼을 누르면, 어플 링크가 복사됩니다. 링크를 다른 성도들에게 전달하실 수 있습니다.`}/>
        <View style={[styles.section, {alignItems:'center'}]}>
          <Image
            source={require("../images/notice/notice9.jpeg")}
            style={{width:350, height:430, resizeMode:'contain', borderRadius:10}}>
          </Image>
        </View>
        <View style={{height:100}}></View>
      </ScrollView>
     
    </View> 
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding:20
  },
  
});

