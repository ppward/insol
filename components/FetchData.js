import {auth, firestore} from './Firebase';
import {
  doc,
  getDoc,
  collection,
  where,
  getDocs,
  query,
} from 'firebase/firestore';

let userDataCache = {}; // 유저의 데이터를 저장하는 변수

export const fetchUserData = async () => {
  try {
    const uid = auth.currentUser?.uid; // 현재 로그인 되어있는 유저의 uid를 가져오고 , 아니면 null 을 저장하는 함수
    if (!uid) throw new Error('현재 로그인 되어있지 않음.');

    const userDocRef = doc(firestore, 'users', uid); // doc을 설정하는 변수 (데이터베이스 이름,컬렉션이름, document 이름)
    const userDocSnap = await getDoc(userDocRef); //getDoc 함수를 이용해서 데이터를 가져오는 함수

    if (userDocSnap.exists()) {
      //getDoc을 사용해서 받아온 데이터가 존재하는지  확인
      userDataCache = userDocSnap.data(); // 유저 데이터를 저장
      return userDataCache; // 저장 된 값 반환
    } else {
      throw new Error('사용자를 찾을 수 없음');
    }
  } catch (error) {
    console.error('유저데이터를 가져오는 중 오류 발생:', error.message);
    throw error; //
  }
};

export const getUserDataSync = () => {
  return userDataCache; //값을 반환하는 함수
};

export const fetchScheduleLists = async classNum => {
  let schedules = []; // Initialize schedules as an empty array
  try {
    const q = query(
      collection(firestore, 'schedules'),
      where('class', '==', classNum),
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      schedules = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
    console.log('schedule의 배열확인', schedules);
    return schedules;
  } catch (error) {
    console.error('Error occurred while retrieving schedule:', error);
    return []; // Return an empty array in case of error
  }
};
