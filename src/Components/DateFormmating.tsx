
// AsyncStorage 데이터 저장하기
const DateFormmating = (date : string) => {
    
    const targetDate = new Date(date).getTime();
    const currentDate = new Date().getTime();
    const differenceInMilliseconds = currentDate - targetDate;

    const minutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 31);

    if (months > 0) {
        return `${months}달 전`;
    } else if (days > 0) {
        return `${days}일 전`;
    } else {
        return `오늘`;
    } 
  };

  export default DateFormmating;