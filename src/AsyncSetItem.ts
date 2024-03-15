import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage 데이터 저장하기
const AsyncSetItem = async (Token : string, Account: string, Name : string, Phone : string, Church : string, ChurchKey : string, Duty:string, URL : string) => {
    try {
      await AsyncStorage.setItem('token', Token);
      await AsyncStorage.setItem('account', Account);
      await AsyncStorage.setItem('name', Name);
      await AsyncStorage.setItem('phone', Phone);
      await AsyncStorage.setItem('church', Church);
      await AsyncStorage.setItem('churchkey', ChurchKey);
      await AsyncStorage.setItem('duty', Duty);
      await AsyncStorage.setItem('URL', URL);
    } catch (error) {
      console.log('AsycSet_err', error);
    }
  };

  export default AsyncSetItem;