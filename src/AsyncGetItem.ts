import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage 데이터 불러오기

const AsyncGetItem = async () => {
  try {
    const refreshToken : string | null = await AsyncStorage.getItem('token');
    const userAccount : string | null = await AsyncStorage.getItem('account');
    const userName : string | null = await AsyncStorage.getItem('name');
    const userPhone : string | null = await AsyncStorage.getItem('phone');
    const userChurch : string | null = await AsyncStorage.getItem('church');
    const userChurchKey : string | null = await AsyncStorage.getItem('churchkey');
    const userDuty : string | null = await AsyncStorage.getItem('duty');
    const userURL : string | null = await AsyncStorage.getItem('URL');
    
    return {
      refreshToken, userAccount, userName, userPhone, userChurch, userChurchKey, userDuty, userURL
    }
    
  } catch (error) {
    console.log(error);
  }
};

export default AsyncGetItem;