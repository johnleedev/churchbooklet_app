import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Text, Linking } from 'react-native';
import { Typography } from '../Components/Typography';
import MainImageURL from "../../MainImageURL";
import { Divider } from '../Components/Divider';
import { SubTitle } from '../Components/SubTitle';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function AppNoticePastor(props : any) {

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
        <TextBox width={130} title='테스트교회' content={`목회자가 처음 가입시, 자동으로 등록되며, 전반적인 사용 환경을 경험할 수 있습니다. 2번째 탭(내교회) 제일 하단에 '교회나가기' 버튼을 누르시면, 나갈 수 있습니다.`}/>
        <View style={[styles.section, {alignItems:'center'}]}>
          <Image
            source={require("../images/notice/notice1.jpeg")}
            style={{width:350, height:600, resizeMode:'contain', borderRadius:10}}>
          </Image>
          <Image
            source={require("../images/notice/notice2.jpeg")}
            style={{width:350, height:600, resizeMode:'contain', borderRadius:10}}>
          </Image>
        </View>
        <TextBox width={150} title='내 교회 등록' content={`교회에서 나가게 되면, '교회 찾기'과 '교회 등록하기' 버튼이 활성화 됩니다. 교회 등록 버튼을 누르셔서, 교회 정보를 입력하시면 됩니다.`}/>
        <View style={[styles.section, {alignItems:'center'}]}>
          <Image
            source={require("../images/notice/notice3.jpeg")}
            style={{width:350, height:600, resizeMode:'contain', borderRadius:10}}>
          </Image>
        </View>
        <TextBox width={120} title='교인 등록' content={`목회자가 교인들 정보를 일일히 입력할 필요 없이, 교인들이 직접 어플에 가입 후 교회 검색 후에, 내교회로 등록하면 됩니다.`}/>
        <View style={[styles.section, {alignItems:'center'}]}>
          <Image
            source={require("../images/notice/notice4.jpeg")}
            style={{width:350, height:600, resizeMode:'contain', borderRadius:10}}>
          </Image>
        </View>
        <TextBox width={180} title='교인 정보 입력' content={`목회자가 가입하지 않은 성도들의 신상 정보를 직접 입력하지 못하는 것은, 개인정보방침 때문입니다. 개인정보가 공유되는 이 어플의 특성상, 성도들이 가입할 때 개인정보 제공 동의를 하셔야만 하기 때문입니다.
단, 성도들이 가입할 때, 본인의 프로필 정보를 "저 대신 담당 목회자가 대신 입력해주세요"에 동의하신 분들에 한하여, 담당 목회자가 직접 신상 정보를 입력할 수 있습니다.`}/>
        <View style={[styles.section, {alignItems:'center'}]}>
          <Image
            source={require("../images/notice/notice6.jpeg")}
            style={{width:350, height:600, resizeMode:'contain', borderRadius:10}}>
          </Image>
        </View>
        <TextBox width={120} title='등록 승인' content={`내교회로 등록하게 되면 '승인 대기' 상태가 됩니다. 교회 담당자의 승인을 받아야, 정식으로 사용할 수 있습니다.`}/>
        <View style={[styles.section, {alignItems:'center'}]}>
          <Image
            source={require("../images/notice/notice5.jpeg")}
            style={{width:350, height:600, resizeMode:'contain', borderRadius:10}}>
          </Image>
        </View>
        <TextBox width={180} title='어플 링크 전송' content={`내교회 등록이 완료되고 나면, 교회 정보가 정식으로 보여지게 됩니다. 상단 오른쪽에 공유 버튼을 누르면, 어플 링크가 복사됩니다. 링크를 성도들에게 전달하시면 됩니다.`}/>
        <View style={[styles.section, {alignItems:'center'}]}>
          <Image
            source={require("../images/notice/notice9.jpeg")}
            style={{width:350, height:430, resizeMode:'contain', borderRadius:10}}>
          </Image>
        </View>
        <TextBox width={120} title='사용 요금' content={`100명 이하의 교회는 무료로 제공될 예정입니다. 그 이상의 교회는 차후 공지하겠습니다.`}/>
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

