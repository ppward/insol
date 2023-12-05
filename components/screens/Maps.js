import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { auth, firestore } from '../Firebase';
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

<<<<<<< HEAD
// 직업별 이미지와 텍스트 정보
=======
const originalConsoleWarn = console.warn;

console.warn = message => {
  if (
    message.indexOf(
      'Warning: This synthetic event is reused for performance reasons.',
    ) !== -1 ||
    message.indexOf('Possible Unhandled Promise Rejection') !== -1 ||
    message.indexOf(
      'Warning: This synthetic event is reused for performance reasons.',
    ) !== -1
  ) {
    // 이 경고 메시지를 무시합니다.
    return;
  }

  originalConsoleWarn(message);
};

>>>>>>> 94a67a36a8924a39398bfd45a847a61a5dc9a7e7
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
      { merge: true },
    );

    console.log('Location updated in Firebase');
  } catch (error) {
    console.error('Error updating location:', error);
  }
};

// 메인 컴포넌트
export default function Maps() {
  const [jobInfo, setJobInfo] = useState(null); // 사용자 직업 정보
  const [currentPosition, setCurrentPosition] = useState(null); // 현재 위치
  const [users, setUsers] = useState([]); // 모든 사용자 위치 데이터
  const [filteredUsers, setFilteredUsers] = useState([]); // 필터링된 사용자 위치 데이터
  const mapRef = useRef(null);

  // 헤더 버튼 클릭 핸들러
  const onHeaderButtonPress = () => {
    console.log('Header Button Pressed');
    startBluetoothScan();
  };
  function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // 거리 (m)
    return distance;
  }

  // 도(degree)에서 라디안(radian)으로 변환하는 함수
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  const updateInGartenStatus = async (currentLatitude, currentLongitude, uid) => {
    // jobInfo 상태를 확인하여 '학생'인 경우에만 함수 실행
    if (jobInfo && jobInfo.text === '학생') {
      const userDocRef = doc(firestore, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const { kindergartenlocation } = userDocSnap.data();
        if (kindergartenlocation && 'latitude' in kindergartenlocation && 'longitude' in kindergartenlocation) {
          const distance = getDistanceFromLatLonInM(
            currentLatitude,
            currentLongitude,
            kindergartenlocation.latitude,
            kindergartenlocation.longitude
          );
  
          const isInGarten = distance <= 100; // 100미터 이내인지 확인
          await setDoc(
            userDocRef,
            { ingarten: isInGarten },
            { merge: true }
          );
          console.log(`ingarten status updated to ${isInGarten}`);
        } else {
          console.error('Kindergarten location data is missing or invalid');
        }
      } else {
        console.error('User document does not exist');
      }
    }
  };

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
        async position => { // async 키워드를 추가했습니다.
          const { latitude, longitude } = position.coords;
          setCurrentPosition({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });

          // 현재 사용자의 UID를 가져옵니다.
          const uid = auth.currentUser.uid;
          // 현재 위치와 Firebase의 kindergartenlocation을 비교합니다.
          await updateInGartenStatus(latitude, longitude, uid); // 위치 업데이트 함수를 호출합니다.
        },
        error => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    // 현재 위치 실시간 업데이트
    const updateCurrentLocation = async () => {
      if (jobInfo && jobInfo.text === '학생') {
        Geolocation.getCurrentPosition(
          async position => {
            const {latitude, longitude} = position.coords;
            updateLocationInFirebase(latitude, longitude);
            
            // 현재 사용자의 UID를 가져옵니다.
            const uid = auth.currentUser.uid;
            // 현재 위치와 Firebase의 kindergartenlocation을 비교합니다.
            await updateInGartenStatus(latitude, longitude, uid);
          },
          error => {
            console.error('Location update error:', error);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    };
    const locationUpdateInterval1 = setInterval(updateCurrentLocation, 600000); // 10분마다 위치 업데이트
    // 사용자 직업 정보 가져오기
    const fetchUserJob = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const job = userDocSnap.data().job;
          setJobInfo(jobDetails[job]);
  
          // 학생인 경우에만 위치 업데이트 인터벌을 설정합니다.
          if (job === '학생') {
            const locationUpdateInterval = setInterval(updateCurrentLocation, 600000); // 10분마다 위치 업데이트
            return () => clearInterval(locationUpdateInterval);
          }
        }
      } catch (error) {
        console.error("Error fetching user's job:", error);
      }
    };

    // 필터링된 사용자 위치 데이터 가져오기
    const fetchFilteredUsers = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

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
            // 자녀(학생) 조회
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
            setFilteredUsers([
              ...studentsSnapshot.docs.map(doc => doc.data()),
              ...teachersData,
            ]);
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

<<<<<<< HEAD
    // 컴포넌트 마운트 시 실행되는 코드
=======
    const locationUpdateInterval = setInterval(updateCurrentLocation, 30000); // 600000ms = 10분
>>>>>>> 94a67a36a8924a39398bfd45a847a61a5dc9a7e7
    requestLocationPermission();
    fetchUserJob();
    fetchFilteredUsers();

    const locationUpdateInterval = setInterval(updateCurrentLocation, 30000); // 10분마다 위치 업데이트
    const locationUpdateUnsubscribe = subscribeToLocationUpdates();

    // 컴포넌트 언마운트 시 실행될 코드
    return () => {
      clearInterval(locationUpdateInterval1);
      clearInterval(locationUpdateInterval);
      locationUpdateUnsubscribe();
    };
  }, []);

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
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onHeaderButtonPress}>
          <Text style={styles.headerButtonText}>버튼</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={currentPosition}
          showsUserLocation={true}>
          {filteredUsers.map((user, index) => (
            user.location && (
              <Marker
                key={index} // 인덱스를 키로 사용
                coordinate={{
                  latitude: user.location.latitude,
                  longitude: user.location.longitude,
                }}
                title={user.name || 'Unknown'}
              />
            )
          ))}
        </MapView>

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
    shadowOffset: { height: 3, width: 3 },
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
