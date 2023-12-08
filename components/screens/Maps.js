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
import {auth, firestore, signOut} from '../Firebase';
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
  const navigation = useNavigation();
  const handleLogout = () => {
    // Display a confirmation dialog
    Alert.alert(
      'Log Out', // Alert Title
      'Are you sure you want to log out?', // Alert Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await auth.signOut();
              navigation.navigate('Intro');
            } catch (error) {
              console.error('Error signing out: ', error);
            }
          },
        },
      ],
      {cancelable: false}, // This prevents the alert from being dismissed by tapping outside of it
    );
  };
  // 헤더 버튼 클릭 핸들러
  luetoothScan();

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
    // jobInfo 상태를 확인하여 '학생'인 경우에만 함수 실행
    console.log('jobinfoText=', jobInfo.text);
    console.log('jobinfo=', jobInfo);

    if (jobInfo && jobInfo.text === '학생') {
      const userDocRef = doc(firestore, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      console.log('----=-=-=-=-=');
      if (userDocSnap.exists()) {
        const {kindergartenlocation} = userDocSnap.data();
        if (
          kindergartenlocation &&
          'latitude' in kindergartenlocation &&
          'longitude' in kindergartenlocation
        ) {
          const distance = getDistanceFromLatLonInM(
            currentLatitude,
            currentLongitude,
            kindergartenlocation.latitude,
            kindergartenlocation.longitude,
          );

          const isInGarten = distance <= 100; // 100미터 이내인지 확인
          await setDoc(userDocRef, {ingarten: isInGarten}, {merge: true});
          console.log(`ingarten status updated to ${isInGarten}`);
        } else {
          console.error('Kindergarten location data is missing or invalid');
        }
      } else {
        console.error('User document does not exist');
      }
    }
    console.log('.........');
  };
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
      const studentQuery = query(
        collection(firestore, 'users'),
        where('email', '==', studentEmail),
      );

      // Listen for changes on the student's document
      const unsubscribe = onSnapshot(studentQuery, querySnapshot => {
        querySnapshot.forEach(doc => {
          const studentData = doc.data();
          // When 'ingarten' becomes true, show an alert
          if (studentData.ingarten === true) {
            Alert.alert('알림', '아이가 유치원에 무사히 도착했습니다.');
          }
        });
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [studentEmail]);
  useEffect(() => {
    const fetchSchedules = async () => {
      if (classData !== '') {
        try {
          const q = query(
            collection(firestore, 'schedules'),
            where('class', '==', classData),
          );
          const querySnapshot = await getDocs(q);

          // Check if the querySnapshot has any documents
          if (querySnapshot.size === 0) {
            // If no documents are found, set schedules to an empty array
            setSchedules([]);
          } else {
            // If documents are found, map over them and set schedules
            const schedulesData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setSchedules(schedulesData);
          }
        } catch (error) {
          console.error('Error occurred while retrieving schedule: ', error);
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
          const {latitude, longitude} = position.coords;
          setCurrentPosition({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });

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
          updateInGartenStatus(latitude, longitude, uid); //<--- 안된?
        },
        error => {
          console.error('Location update error:', error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };
    // 사용자 직업 정보 가져오기
    const fetchUserJob = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const job = userDocSnap.data().job;
          setJobInfo(jobDetails[job]);
          setClassData(userDocSnap.data.class);
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
          setClassData(userClass);
          if (['선생님', '버스기사'].includes(userJob)) {
            usersQuery = query(
              collection(firestore, 'users'),
              where('job', '==', '학생'),
              where('class', '==', userClass),
            );
          } else if (userJob === '학부모') {
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
    fetchUserJob();
    fetchFilteredUsers();

    const locationUpdateInterval = setInterval(updateCurrentLocation, 30000); // 10분마다 위치 업데이트
    const locationUpdateUnsubscribe = subscribeToLocationUpdates();

    // 컴포넌트 언마운트 시 실행될 코드
    return () => {
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
                      ? require('../../image/markerImage/teacher.png')
                      : require('../../image/markerImage/boy.png')
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
                  image={require('../../image/markerImage/calendar.png')}
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
