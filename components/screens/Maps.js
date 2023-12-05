<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React, {useState, useEffect, useRef} from 'react';
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
<<<<<<< HEAD
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { auth, firestore } from '../Firebase';
=======
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {auth, firestore} from '../Firebase';
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
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
const originalConsoleWarn = console.warn;

console.warn = (message) => {
  if (message.indexOf('Warning: This synthetic event is reused for performance reasons.') !== -1 ||
      message.indexOf('Possible Unhandled Promise Rejection') !== -1 ||
      message.indexOf('Warning: This synthetic event is reused for performance reasons.') !== -1) {
    // 이 경고 메시지를 무시합니다.
    return;
  }

  originalConsoleWarn(message);
};

=======
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
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

export default function Maps() {
  const [jobInfo, setJobInfo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [users, setUsers] = useState([]); // 사용자들의 위치 데이터
  const [filteredUsers, setFilteredUsers] = useState([]);
  const mapRef = useRef(null);
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(true);
=======

>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
  const startBluetoothScan = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      console.log('Device found: ', device.name);
    });
  };

  const onHeaderButtonPress = () => {
    console.log('Header Button Pressed');
    startBluetoothScan();
  };

  useEffect(() => {
    // 위치 권한 요청
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
        position => {
          const {latitude, longitude} = position.coords;
          setCurrentPosition({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
<<<<<<< HEAD
          setIsLoading(false);
=======
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
        },
        error => {
          console.error(error);
        },
<<<<<<< HEAD
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
=======
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
      );
    };
    const updateCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          updateLocationInFirebase(latitude, longitude);
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
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error("Error fetching user's job:", error);
      }
    };

    // 모든 사용자의 위치 데이터 가져오기
    const fetchUsersLocation = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
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

    // 실시간 위치 업데이트 리스너 설정
    const subscribeToLocationUpdates = () => {
<<<<<<< HEAD
      const uid = auth.currentUser.uid;
      const userDocRef = doc(firestore, 'users', uid);
      getDoc(userDocRef).then((userDocSnap) => {
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
            const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
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
    
    const locationUpdateInterval = setInterval(updateCurrentLocation, 30000); // 600000ms = 10분
    requestLocationPermission();
    fetchUserJob()
=======
      const usersRef = collection(firestore, 'users');
      const unsubscribe = onSnapshot(usersRef, querySnapshot => {
        const updatedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFilteredUsers(updatedUsers);
      });

      return unsubscribe;
    };
    const locationUpdateInterval = setInterval(updateCurrentLocation, 30000); // 600000ms = 10분
    requestLocationPermission();
    fetchUserJob();
    fetchUsersLocation();
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
    fetchFilteredUsers();
    const locationUpdateUnsubscribe = subscribeToLocationUpdates();

    // 컴포넌트 언마운트 시 실행될 코드
    return () => {
      clearInterval(locationUpdateInterval);
      locationUpdateUnsubscribe();
      // 여기에 필요한 경우 다른 정리 작업을 추가할 수 있습니다.
    };
  }, []);

<<<<<<< HEAD
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
=======
  if (!jobInfo || !currentPosition) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955

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
          {filteredUsers.map(
            user =>
              user.location && (
                <Marker
                  key={user.id}
                  coordinate={{
                    latitude: user.location.latitude,
                    longitude: user.location.longitude,
                  }}
                  title={user.name || 'Unknown'}
                />
              ),
          )}
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
    shadowOffset: {height: 3, width: 3},
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
<<<<<<< HEAD
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B1A8EB', // 배경색은 기존 컨테이너 배경색과 동일하게 설정
  },
=======
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
});
