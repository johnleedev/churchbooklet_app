import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage 데이터 불러오기

const AsyncGetItem = async () => {
  try {
    const refreshToken : string | null = await AsyncStorage.getItem('token');
    const userAccount : string | null = await AsyncStorage.getItem('account');
    const userName : string | null = await AsyncStorage.getItem('name');
    const userChurch : string | null = await AsyncStorage.getItem('church');
    const userChurchKey : string | null = await AsyncStorage.getItem('churchkey');
    const userDuty : string | null = await AsyncStorage.getItem('duty');
    
    return {
      refreshToken, userAccount, userName,userChurch, userChurchKey, userDuty
    }
    
  } catch (error) {
    console.log(error);
  }
};

export default AsyncGetItem;