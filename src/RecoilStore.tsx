import { atom } from "recoil";

interface UserDataProps {
  userAccount : string;
  userName : string;
  userChurch : string;
  userChurchKey : string;
  userURL : string;
  userImage : string;
  mainPastor : boolean;
  checkUsingPolicy: boolean;
  checkPersonalInfo: boolean;
  checkContentsRestrict: boolean;
  checkInfoToOthers: boolean;
  checkServiceNotifi: boolean;
  refreshToken : string;
}

export const recoilLoginData = atom<UserDataProps>({
  key: "selectedChurch",
  default: {
    userAccount : '',
    userName : '',
    userChurch : '',
    userChurchKey : '',
    userURL : '',
    userImage : '',
    mainPastor : false,
    checkUsingPolicy: false,
    checkPersonalInfo: false,
    checkContentsRestrict: false,
    checkInfoToOthers: false,
    checkServiceNotifi: false,
    refreshToken : ''
  }
});


