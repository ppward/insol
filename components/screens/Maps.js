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
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { BleManager } from 'react-native-ble-plx';

// 직업별 이미지와 텍스트 상세 정보
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

// 사용자의 현재 위치를 Firebase에 업데이트하는 함수
const updateLocationInFirebase = async (latitude, longitude) => {
  try {
    const uid = auth.currentUser.uid;
    const userLocationRef = doc(firestore, 'users', uid);

    await setDoc(userLocationRef, {
      location: {
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      }
    }, { merge: true });

    console.log('Location updated in Firebase');
  } catch (error) {
    console.error('Error updating location:', error);
  }
};

export default function Maps() {
  const [jobInfo, setJobInfo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const mapRef = useRef(null);
  const bleManager = new BleManager();

  // 블루투스 스캔 시작 함수
  const startBluetoothScan = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      console.log("Device found: ", device.name);
    });
  };

  // 블루투스 버튼 클릭 핸들러
  const onHeaderButtonPress = () => {
    console.log('Header Button Pressed');
    startBluetoothScan();
  };

  // 위치 권한 요청 및 사용자 정보 가져오기
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        // iOS 권한 요청 로직
      } else if (Platform.OS === 'android') {
        const response = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (response !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Location permission denied');
          return;
        }
      }

      // 현재 위치 가져오기
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        },
        error => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
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

    // 권한 요청 및 사용자 정보 가져오기 실행
    requestLocationPermission();
    fetchUserJob();

    // 주기적으로 현재 위치 업데이트
    const intervalId = setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          updateLocationInFirebase(latitude, longitude);
        },
        error => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 } // 수정된 부분
      );
    }, 60000); // 1분마다 실행

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, []);

  // 필터링된 사용자 위치 데이터 가져오기
  useEffect(() => {
    const fetchFilteredUsers = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const { job: userJob, email: userEmail, class: userClass } = userDocSnap.data();

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
              where('job', '==', '학생'),
              where('parent', '==', userEmail),
            );
          } else {
            // 다른 사용자 역할에 대한 처리
            return;
          }

          // Firestore의 실시간 갱신 리스너 설정
          const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
            const usersData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setFilteredUsers(usersData);
          });

          return unsubscribe; // 컴포넌트 언마운트 시 리스너 해제
        }
      } catch (error) {
        console.error("Error fetching filtered users:", error);
      }
    };

    fetchFilteredUsers();
  }, []);

  if (!jobInfo || !currentPosition) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
          showsUserLocation={true}
        >
          {filteredUsers.map(user => (
            user.location && (
              <Marker
                key={user.id}
                coordinate={{
                  latitude: user.location.latitude,
                  longitude: user.location.longitude,
                }}
                title={user.name || 'Unknown'}
              />
            )
          ))}
        </MapView>
        {currentPosition && (
          <TouchableOpacity
            style={styles.button}
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
    shadowOffset: { height: 3, width: 3 },
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
