import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {auth, firestore} from '../Firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {CheckBox} from '@rneui/themed';
import {fetchUserData, getUserDataSync} from '../FetchData';

// 직업별 이미지와 텍스트 정보
const jobDetails = {
  선생님: {
    image: require('../../image/선생님.png'),
    text: '선생님',
  },
  버스기사: {
    image: require('../../image/버스.png'),
    text: '버스기사',
  },
  학생: {
    image: require('../../image/학생.png'),
    text: '학생',
  },
  학부모: {
    image: require('../../image/부모님.png'),
    text: '학부모',
  },
};

// Firebase에 사용자 위치 업데이트
const updateLocationInFirebase = async (latitude, longitude) => {
  try {
    const uid = auth.currentUser.uid;
    const userLocationRef = doc(firestore, 'users', uid);

    await setDoc(
      userLocationRef,
      {
        location: {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        },
      },
      {merge: true},
    );

    console.log('Location updated in Firebase');
  } catch (error) {
    console.error('Error updating location:', error);
  }
};

// 메인 컴포넌트
export default function Maps() {
  const [currentUID, setCurrentUID] = useState('');
  const [jobInfo, setJobInfo] = useState(null); // 사용자 직업 정보
  const [currentPosition, setCurrentPosition] = useState(null); // 현재 위치
  const [schedules, setSchedules] = useState([]); // 모든 사용자 위치 데이터
  const [filteredUsers, setFilteredUsers] = useState([]); // 필터링된 사용자 위치 데이터
  const mapRef = useRef(null);
  const [classData, setClassData] = useState('');
  const [attend, setAttend] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [reach, setReach] = useState(false);
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();

  useEffect(async () => {
<<<<<<< HEAD
    // 컴포넌트가 마운트될 때 실행되는 사이드 이펙트. 이 경우, 비동기 함수를 실행합니다.
    await fetchUserData();
    // 사용자 데이터를 비동기적으로 불러오는 함수를 호출합니다.
    const data = getUserDataSync();
    // 불러온 사용자 데이터를 동기적으로 가져옵니다.
    setUserData(data);
    // 상태 훅을 사용하여 사용자 데이터 상태를 설정합니다.
    setJobInfo(jobDetails[data.job]);
    // 사용자의 직업에 해당하는 정보를 상태에 설정합니다.
    console.log('컴포넌트화 된 데이터:', data);
    // 콘솔에 로그인한 사용자의 데이터를 출력합니다.
  }, []);
  
  const updateUserLocationAndStatus = async uid => {
    // 사용자의 위치와 상태를 업데이트하는 비동기 함수입니다.
    Geolocation.getCurrentPosition(
      async position => {
        // 현재 위치를 가져옵니다.
        const {latitude, longitude} = position.coords;
        // 위치 좌표에서 위도와 경도를 추출합니다.
=======
    await fetchUserData();
    const data = getUserDataSync();
    setUserData(data);
    setJobInfo(jobDetails[data.job]);
    console.log('컴포넌트화 된 데이터:', data);
  }, []);
  // 현재 위치를 업데이트하고 `jobInfo`가 '학생'일 때 유치원 도착 여부를 확인하는 함수
  const updateUserLocationAndStatus = async uid => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
        setCurrentPosition({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
<<<<<<< HEAD
        // 현재 위치 상태를 업데이트합니다.
        updateLocationInFirebase(latitude, longitude);
        // Firebase에 현재 위치를 업데이트하는 함수를 호출합니다.
        if (userData.job === '학생') {
          // 사용자가 학생인 경우 추가 처리를 합니다.
          updateInGartenStatus(latitude, longitude, uid);
          // 유치원 도착 상태를 업데이트하는 함수를 호출합니다.
=======
        updateLocationInFirebase(latitude, longitude);
        if (userData.job === '학생') {
          updateInGartenStatus(latitude, longitude, uid);
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
        }
      },
      error => {
        console.error(error);
<<<<<<< HEAD
        // 위치 정보를 가져오는 데 실패한 경우 에러를 출력합니다.
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      // 위치 정보를 가져올 때의 옵션을 설정합니다.
    );
  };
  
  const handleLogout = () => {
    // 로그아웃 처리를 위한 함수입니다.
    Alert.alert(
      '로그아웃', // 알림 제목
      '정말 로그아웃 하시겠습니까?', // 알림 메시지
=======
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃', // 알림 타이틀
      '정말 로그아웃 하시겠습니까?', // 알림 메세지
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
      [
        {
          text: '아니요',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
<<<<<<< HEAD
          // '아니요'를 선택했을 때의 처리를 정의합니다.
=======
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
        },
        {
          text: '네',
          onPress: async () => {
<<<<<<< HEAD
            // '네'를 선택했을 때의 처리를 정의합니다.
            try {
              await auth.signOut();
              // Firebase에서 로그아웃 처리를 합니다.
=======
            try {
              await auth.signOut();
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
              navigation.reset({
                index: 0,
                routes: [{name: 'Intro'}],
              });
<<<<<<< HEAD
              // 로그아웃 후 초기 화면으로 네비게이션을 리셋합니다.
            } catch (error) {
              console.error('Error signing out: ', error);
              // 로그아웃 중 에러가 발생한 경우 에러를 출력합니다.
=======
            } catch (error) {
              console.error('Error signing out: ', error);
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
            }
          },
        },
      ],
<<<<<<< HEAD
      {cancelable: false}, // 이 옵션은 알림창 외부를 탭하여 알림창을 닫을 수 없게 합니다.
    );
  };
  
=======
      {cancelable: false}, // This prevents the alert from being dismissed by tapping outside of it
    );
  };
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d

  function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // 거리 (m)
    return distance;
  }

  // 도(degree)에서 라디안(radian)으로 변환하는 함수
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  const updateInGartenStatus = async (
    currentLatitude,
    currentLongitude,
    uid,
  ) => {
<<<<<<< HEAD
    // 유치원 도착 여부를 업데이트하는 비동기 함수입니다.
    if (userData.job === '학생') {
      // 현재 로그인한 사용자가 '학생'인 경우에만 실행됩니다.
      const userDocRef = doc(firestore, 'users', uid);
      // Firebase에서 해당 사용자의 문서 참조를 가져옵니다.
      const userDocSnap = await getDoc(userDocRef);
      // 해당 사용자의 문서 스냅샷을 비동기적으로 가져옵니다.
      console.log('----=-=-=-=-=');
      if (userDocSnap.exists()) {
        // 문서가 존재하는 경우에만 실행됩니다.
        const {kindergartenlocation} = userDocSnap.data();
        // 사용자 문서에서 유치원 위치 정보를 가져옵니다.
=======
    // jobInfo 상태를 확인하여 '학생'인 경우에만 함수
    if (userData.job === '학생') {
      const userDocRef = doc(firestore, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      console.log('----=-=-=-=-=');
      if (userDocSnap.exists()) {
        const {kindergartenlocation} = userDocSnap.data();
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
        if (
          kindergartenlocation &&
          'latitude' in kindergartenlocation &&
          'longitude' in kindergartenlocation
        ) {
<<<<<<< HEAD
          // 유치원 위치 정보가 유효한 경우에만 실행됩니다.
=======
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
          const distance = getDistanceFromLatLonInM(
            currentLatitude,
            currentLongitude,
            kindergartenlocation.latitude,
            kindergartenlocation.longitude,
          );
<<<<<<< HEAD
          // 현재 위치와 유치원 위치 사이의 거리를 계산합니다.
          const isInGarten = distance <= 100; // 100미터 이내인지 확인합니다.
          await setDoc(userDocRef, {ingarten: isInGarten}, {merge: true});
          // Firebase 문서에 유치원 도착 여부를 업데이트합니다.
          console.log(`ingarten status updated to ${isInGarten}`);
        } else {
          console.error('Kindergarten location data is missing or invalid');
          // 유치원 위치 정보가 없거나 유효하지 않은 경우 에러를 출력합니다.
        }
      } else {
        console.error('User document does not exist');
        // 사용자 문서가 존재하지 않는 경우 에러를 출력합니다.
=======

          const isInGarten = distance <= 100; // 100미터 이내인지 확인
          await setDoc(userDocRef, {ingarten: isInGarten}, {merge: true});
          console.log(`ingarten status updated to ${isInGarten}`);
        } else {
          console.error('Kindergarten location data is missing or invalid');
        }
      } else {
        console.error('User document does not exist');
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
      }
    }
    console.log('.........');
  };
<<<<<<< HEAD
  
  useEffect(() => {
    // jobInfo 상태가 업데이트된 후에 위치 정보를 업데이트하는 useEffect
    let locationUpdateInterval;
    // 위치 업데이트를 위한 인터벌을 설정하기 위한 변수입니다.
    const uid = auth.currentUser?.uid;
    // 현재 로그인한 사용자의 UID를 가져옵니다.
    if (uid && jobInfo) {
      // UID와 jobInfo가 유효한 경우에만 실행됩니다.
      updateUserLocationAndStatus(uid);
      // 사용자의 위치와 상태를 업데이트하는 함수를 즉시 호출합니다.
      locationUpdateInterval = setInterval(() => {
        updateUserLocationAndStatus(uid);
      }, 30000); // 30초마다 위치 업데이트를 반복합니다.
    }
    return () => {
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
        // 컴포넌트가 언마운트되거나 jobInfo가 변경될 때 인터벌을 정리합니다.
      }
    };
  }, [jobInfo]);
  
  useEffect(() => {
    // 학생 출석체크를 위한 useEffect
    const uid = auth.currentUser.uid;
    // 현재 로그인한 사용자의 UID를 가져옵니다.
    const userDocRef = doc(firestore, 'users', uid);
    // 해당 사용자의 Firebase 문서 참조를 가져옵니다.
    setCurrentUID(uid);
    // 현재 UID 상태를 업데이트합니다.
  
    const unsubscribe = onSnapshot(userDocRef, doc => {
      // 해당 문서에 대한 실시간 리스너를 설정합니다.
      if (doc.exists()) {
        // 문서가 존재하는 경우에만 실행됩니다.
        const data = doc.data();
        // 문서의 데이터를 가져옵니다.
        if (data.job === '학생') {
          // 사용자가 학생인 경우에만 실행됩니다.
          if (
            data.attendance.hasOwnProperty('checked') &&
            data.attendance.checked === true
          ) {
            // 출석 체크 필드가 존재하고 true인 경우에만 실행됩니다.
            setAttend(true); // 출석 상태를 true로 설정합니다.
          } else {
            setAttend(false); // 그렇지 않으면 false로 설정합니다.
          }
        } else if (data.job === '부모님') {
          setStudentEmail(data.studentEmail);
          // 사용자가 부모님인 경우 자녀의 이메일을 설정합니다.
        }
      }
    });
    return () => unsubscribe();
    // 컴포넌트가 언마운트되는 경우 리스너를 해제합니다.
  }, [currentUID]);
  
  useEffect(() => {
    // 유치원 도착 알림을 위한 useEffect
    if (studentEmail.length !== 0) {
      // 학생 이메일이 유효한 경우에만 실행됩니다.
=======

  // `jobInfo` 상태가 업데이트된 후에 위치 정보를 업데이트하는 useEffect
  useEffect(() => {
    let locationUpdateInterval;

    const uid = auth.currentUser?.uid;
    if (uid && jobInfo) {
      // Call the function immediately to update status as soon as jobInfo is available
      updateUserLocationAndStatus(uid);

      // Then set up the interval to continue updating every 30 seconds
      locationUpdateInterval = setInterval(() => {
        updateUserLocationAndStatus(uid);
      }, 30000); // Interval set for 30 seconds
    }

    // Clear interval when component unmounts or jobInfo changes
    return () => {
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
      }
    };
  }, [jobInfo]);

  useEffect(() => {
    //학생 출석체크
    const uid = auth.currentUser.uid;
    const userDocRef = doc(firestore, 'users', uid);
    setCurrentUID(uid);

    const unsubscribe = onSnapshot(userDocRef, doc => {
      if (doc.exists()) {
        const data = doc.data();

        if (data.job === '학생') {
          if (
            // Check if the 'checked' field exists and if it is true
            data.attendance.hasOwnProperty('checked') &&
            data.attendance.checked === true
          ) {
            setAttend(true); // Update your state to true
            // Execute any additional logic when 'checked' is true
            // 테스트해보기
          } else {
            // Handle the case when 'checked' is not true or not present
            setAttend(false);
          }
        } else if (data.job === '부모님') {
          setStudentEmail(data.studentEmail);
        }
      }
    });

    // This will unsubscribe from the document when the component unmounts
    return () => unsubscribe();
  }, [currentUID]);

  useEffect(() => {
    // 유치원 도착알림
    if (studentEmail.length !== 0) {
      // Fetch the student's document using the email
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
      const studentQuery = query(
        collection(firestore, 'users'),
        where('email', '==', studentEmail),
      );
<<<<<<< HEAD
      // 해당 학생의 문서에 대한 쿼리를 생성합니다.
  
      const unsubscribe = onSnapshot(studentQuery, querySnapshot => {
        // 쿼리 결과에 대한 실시간 리스너를 설정합니다.
        querySnapshot.forEach(doc => {
          const studentData = doc.data();
          // 각 문서의 데이터를 가져옵니다.
          if (studentData.ingarten === true) {
            // 유치원에 도착했을 경우 알림을 표시합니다.
=======

      // Listen for changes on the student's document
      const unsubscribe = onSnapshot(studentQuery, querySnapshot => {
        querySnapshot.forEach(doc => {
          const studentData = doc.data();
          // When 'ingarten' becomes true, show an alert
          if (studentData.ingarten === true) {
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
            Alert.alert('알림', '아이가 유치원에 무사히 도착했습니다.');
          }
        });
      });
<<<<<<< HEAD
  
      return () => unsubscribe();
      // 컴포넌트가 언마운트되는 경우 리스너를 해제합니다.
    }
  }, [studentEmail]);
  
  useEffect(() => {
    // 컴포넌트가 마운트될 때 실행되는 useEffect 함수
  
    const fetchSchedules = async () => {
      // 반에 따른 일정을 가져오는 비동기 함수
      if (classData !== '') {
        // classData 상태가 비어있지 않은 경우에만 실행
=======

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [studentEmail]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (classData !== '') {
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
        try {
          const q = query(
            collection(firestore, 'schedules'),
            where('class', '==', classData),
          );
<<<<<<< HEAD
          // Firestore에서 해당 반의 일정을 쿼리하는 쿼리 생성
          const querySnapshot = await getDocs(q);
          // 쿼리 결과를 비동기적으로 가져옴
  
          if (querySnapshot.size === 0) {
            setSchedules([]);
            // 문서가 없으면 빈 배열로 schedules 상태를 설정
          } else {
=======
          const querySnapshot = await getDocs(q);

          // Check if the querySnapshot has any documents
          if (querySnapshot.size === 0) {
            // If no documents are found, set schedules to an empty array
            setSchedules([]);
          } else {
            // If documents are found, map over them and set schedules
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
            const schedulesData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
<<<<<<< HEAD
            // 문서가 있으면 해당 데이터로 schedules 상태를 설정
=======
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
            setSchedules(schedulesData);
          }
        } catch (error) {
          console.error('Error occurred while retrieving schedule: ', error);
<<<<<<< HEAD
          setSchedules([]);
          // 오류 발생 시 콘솔에 오류를 출력하고 schedules 상태를 빈 배열로 설정
        }
      }
    };
  
    if (classData && classData.trim().length > 0) {
      fetchSchedules();
      // classData 상태가 유효하면 fetchSchedules 함수를 호출
    }
  
    console.log('반이름:', classData);
    console.log('Map schedule', schedules);
    // classData 및 schedules 상태를 콘솔에 출력
  
    // 위치 권한 요청 및 현재 위치 설정
    const requestLocationPermission = async () => {
      // 위치 권한을 요청하는 비동기 함수
      if (Platform.OS === 'ios') {
        // iOS 플랫폼의 경우 별도의 처리가 필요할 수 있음
      } else if (Platform.OS === 'android') {
        // 안드로이드 플랫폼의 경우
        const response = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        // 위치 권한을 요청
        if (response !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Location permission denied');
          // 권한이 거부되었을 경우 콘솔에 오류 메시지 출력
          return;
        }
      }
  
      Geolocation.getCurrentPosition(
        async position => {
          // 현재 위치를 비동기적으로 가져옴
=======
          setSchedules([]); // Also set to empty if there is an error fetching schedules
        }
      }
    };

    if (classData && classData.trim().length > 0) {
      fetchSchedules();
    }

    console.log('반이름:', classData);
    console.log('Map schedule', schedules);
  }, [classData]);
  useEffect(() => {
    // 위치 권한 요청 및 현재 위치 설정
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        // iOS 권한 요청 로직 (필요한 경우)
      } else if (Platform.OS === 'android') {
        const response = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (response !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Location permission denied');
          return;
        }
      }

      Geolocation.getCurrentPosition(
        async position => {
          // async 키워드를 추가했습니다.
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
          const {latitude, longitude} = position.coords;
          setCurrentPosition({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
<<<<<<< HEAD
          // 현재 위치를 setCurrentPosition으로 상태 업데이트
          const uid = auth.currentUser.uid;
          // 현재 사용자의 UID 가져옴
          updateInGartenStatus(latitude, longitude, uid);
          // 현재 위치를 바탕으로 유치원 도착 상태를 업데이트하는 함수 호출
        },
        error => {
          console.error(error);
          // 위치 정보를 가져오는데 오류 발생 시 콘솔에 출력
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        // 위치 정보 가져오기 옵션 설정
      );
    };
  
    const updateCurrentLocation = async () => {
      // 현재 위치를 실시간으로 업데이트하는 비동기 함수
      Geolocation.getCurrentPosition(
        async position => {
          // 현재 위치를 비동기적으로 가져옴
          const {latitude, longitude} = position.coords;
          updateLocationInFirebase(latitude, longitude);
          // Firebase에 현재 위치를 업데이트
          const uid = auth.currentUser.uid;
          // 현재 사용자의 UID 가져옴
          updateInGartenStatus(latitude, longitude, uid);
          // 현재 위치를 바탕으로 유치원 도착 상태를 업데이트하는 함수 호출
        },
        error => {
          console.error('Location update error:', error);
          // 위치 업데이트 중 오류 발생 시 콘솔에 출력
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        // 위치 정보 가져오기 옵션 설정
      );
    };
  
    // 필터링된 사용자 위치 데이터 가져오기
    const fetchFilteredUsers = async () => {
      // 필터링된 사용자 위치 데이터를 가져오는 비동기 함수
      try {
        const uid = auth.currentUser.uid;
        // 현재 사용자의 UID 가져옴
        const userDocRef = doc(firestore, 'users', uid);
        // 현재 사용자의 문서 참조 가져옴
        const userDocSnap = await getDoc(userDocRef);
        // 현재 사용자의 문서 스냅샷을 비동기적으로 가져옴
  
        if (userDocSnap.exists()) {
          // 문서가 존재하는 경우에만 실행
=======

          // 현재 사용자의 UID를 가져옵니다.
          const uid = auth.currentUser.uid;
          // 현재 위치와 Firebase의 kindergartenlocation을 비교합니다.
          updateInGartenStatus(latitude, longitude, uid); // 위치 업데이트 함수를 호출합니다.
        },
        error => {
          console.error(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    // 현재 위치 실시간 업데이트
    const updateCurrentLocation = async () => {
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;
          updateLocationInFirebase(latitude, longitude); // <--- 실행 됌

          // 현재 사용자의 UID를 가져옵니다.
          const uid = auth.currentUser.uid;
          // 현재 위치와 Firebase의 kindergartenlocation을 비교합니다.
          updateInGartenStatus(latitude, longitude, uid);
        },
        error => {
          console.error('Location update error:', error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };
    // 필터링된 사용자 위치 데이터 가져오기
    const fetchFilteredUsers = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d
          const {
            job: userJob,
            email: userEmail,
            class: userClass,
          } = userDocSnap.data();
<<<<<<< HEAD
          // 문서에서 직업, 이메일, 반 정보를 가져옴
          let usersQuery;
          setClassData(userClass);
          // 반 정보를 classData 상태에 설정
          // 여기서부터는 사용자의 직업에 따라 다른 쿼리를 생성하여 Firestore에서 데이터를 가져오는 로직이 이어집니다.
          // 이 데이터는 앱의 다양한 기능에 사용됩니다.
        }
      } catch (error) {
        console.error('Error fetching filtered users:', error);
        // 오류 발생 시 콘솔에 오류 메시지 출력
      }
    };
  
    const subscribeToLocationUpdates = () => {
      // 위치 업데이트 리스너를 설정하는 함수
      const uid = auth.currentUser.uid;
      // 현재 사용자의 UID 가져옴
      const userDocRef = doc(firestore, 'users', uid);
      // 현재 사용자의 문서 참조 가져옴
      getDoc(userDocRef).then(userDocSnap => {
        // 현재 사용자의 문서 스냅샷을 비동기적으로 가져옴
        // 여기서부터는 사용자의 직업에 따라 다른 쿼리를 생성하여 위치 업데이트 리스너를 설정하는 로직이 이어집니다.
        // 이 리스너는 사용자 및 관련 데이터의 위치 정보가 변경될 때마다 이를 반영합니다.
      });
    };
  
    // 컴포넌트 마운트 시 실행되는 코드
    requestLocationPermission();
    // 위치 권한 요청 함수 호출
    fetchFilteredUsers();
    // 필터링된 사용자 위치 데이터 가져오기 함수 호출
    const locationUpdateUnsubscribe = subscribeToLocationUpdates();
    // 위치 업데이트 리스너 설정 및 해제를 위한 함수 호출
  
    // 컴포넌트 언마운트 시 실행될 코드
    return () => {
      locationUpdateUnsubscribe();
      // 위치 업데이트 리스너 해제
    };
  }, []);
  
=======
          let usersQuery;
          setClassData(userClass);
          if (['선생님', '버스기사'].includes(userData.job)) {
            usersQuery = query(
              collection(firestore, 'users'),
              where('job', '==', '학생'),
              where('class', '==', userClass),
            );
          } else if (userData.job === '학부모') {
            // 자녀(학생) 조회
            setStudentEmail(userDocSnap.data().studentEmail);
            const studentsQuery = query(
              collection(firestore, 'users'),
              where('parent', '==', userEmail),
              where('job', '==', '학생'),
            );
            const studentsSnapshot = await getDocs(studentsQuery);
            const childrenClasses = studentsSnapshot.docs.map(
              doc => doc.data().class,
            );

            // 해당 반의 선생님 조회
            const teachersQuery = query(
              collection(firestore, 'users'),
              where('class', 'in', childrenClasses),
              where('job', '==', '선생님'),
            );
            const teachersSnapshot = await getDocs(teachersQuery);
            const teachersData = teachersSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));

            // 자녀와 선생님 정보를 상태에 저장
            setFilteredUsers([...studentsSnapshot.docs.map(doc => doc.data())]);
          } else if (userJob === '학생') {
            usersQuery = query(
              collection(firestore, 'users'),
              where('job', '==', '선생님'),
              where('class', '==', userClass),
            );
          } else {
            return;
          }

          if (usersQuery) {
            const unsubscribe = onSnapshot(usersQuery, querySnapshot => {
              const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));
              setFilteredUsers(usersData);
            });

            return () => unsubscribe();
          }
        }
      } catch (error) {
        console.error('Error fetching filtered users:', error);
      }
    };

    // 위치 업데이트 리스너 설정
    const subscribeToLocationUpdates = () => {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(firestore, 'users', uid);
      getDoc(userDocRef).then(userDocSnap => {
        if (userDocSnap.exists()) {
          const {
            job: userJob,
            email: userEmail,
            class: userClass,
          } = userDocSnap.data();

          let usersQuery;
          if (['선생님', '버스기사'].includes(userJob)) {
            usersQuery = query(
              collection(firestore, 'users'),
              where('job', '==', '학생'),
              where('class', '==', userClass),
            );
          } else if (userJob === '학부모') {
            usersQuery = query(
              collection(firestore, 'users'),
              where('parent', '==', userEmail),
              where('job', '==', '학생'),
            );
          } else if (userJob === '학생') {
            usersQuery = query(
              collection(firestore, 'users'),
              where('job', '==', '선생님'),
              where('class', '==', userClass),
            );
          }

          if (usersQuery) {
            const unsubscribe = onSnapshot(usersQuery, querySnapshot => {
              const updatedFilteredUsers = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));
              setFilteredUsers(updatedFilteredUsers);
            });

            return unsubscribe;
          }
        }
      });
    };

    // 컴포넌트 마운트 시 실행되는 코드
    requestLocationPermission();
    fetchFilteredUsers();
    const locationUpdateUnsubscribe = subscribeToLocationUpdates();
    // 컴포넌트 언마운트 시 실행될 코드
    return () => {
      locationUpdateUnsubscribe();
    };
  }, []);
>>>>>>> bfd59892f4747415daa88848b0ff2c244506606d

  // 로딩 뷰
  if (!jobInfo || !currentPosition) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // 메인 뷰
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image source={jobInfo.image} style={styles.profilePic} />
          <Text style={styles.headerText}>{jobInfo.text}</Text>
          {jobInfo && jobInfo.text === '학생' && (
            <CheckBox
              checked={attend}
              disabled={true}
              iconType="material-community"
              checkedIcon="checkbox-outline"
              uncheckedIcon="checkbox-blank-outline"
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => handleLogout()}>
          <Text style={styles.headerButtonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={currentPosition}
          showsUserLocation={true}>
          {filteredUsers.map(
            (user, index) =>
              user.location && (
                <Marker
                  key={index} // 인덱스를 키로 사용
                  coordinate={{
                    latitude: user.location.latitude,
                    longitude: user.location.longitude,
                  }}
                  title={user.name || 'Unknown'}
                  image={
                    jobInfo && jobInfo.text === '학생'
                      ? require('../../image/markerImage/teacher_marker.png')
                      : require('../../image/markerImage/boy_marker.png')
                  }
                />
              ),
          )}
          {schedules.map((item, index) => {
            return (
              item.location && (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: item.location.latitude,
                    longitude: item.location.longitude,
                  }}
                  title={item.address || 'Unknown'}
                  image={require('../../image/markerImage/calendar_marker.png')}
                />
              )
            );
          })}
        </MapView>
        {currentPosition && (
          <TouchableOpacity
            style={styles.currentPositionButton}
            onPress={() => {
              mapRef.current.animateToRegion(currentPosition, 1000);
            }}>
            <Image
              style={{width: 28, height: 28, tintColor: '#fff'}}
              source={require('../../assets/target.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B1A8EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    width: '100%',
  },
  headerButton: {
    backgroundColor: '#4E9F3D',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    flexGrow: 1,
    marginRight: 40,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
  },
  mapContainer: {
    width: '80%',
    height: '70%',
    alignSelf: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#9933FF',
    padding: 10,
    borderRadius: 20,
    elevation: 3,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOffset: {height: 3, width: 3},
  },
  currentPositionButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#9933FF',
    padding: 10,
    borderRadius: 20,
    elevation: 3,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOffset: {height: 3, width: 3},
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
