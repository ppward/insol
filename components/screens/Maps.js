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
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { auth, firestore } from '../Firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { BleManager } from 'react-native-ble-plx';

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
  부모님: {
    image: require('../../image/부모님.png'),
    text: '부모님',
  },
};

export default function Maps() {
  const [jobInfo, setJobInfo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const mapRef = useRef(null);
  const bleManager = new BleManager();

  useEffect(() => {
    requestLocationPermission();
    fetchUserJob();

    const locationInterval = setInterval(updateLocation, 60000); // 1분마다 위치 업데이트

    return () => clearInterval(locationInterval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      // iOS 권한 요청 (필요한 경우)
    } else if (Platform.OS === 'android') {
      const grantedLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      const grantedBluetooth = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      );

      if (grantedLocation !== PermissionsAndroid.RESULTS.GRANTED ||
          grantedBluetooth !== PermissionsAndroid.RESULTS.GRANTED) {
        console.error('Location or Bluetooth permission denied');
        return;
      }
    }
    updateLocation();
  };

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

  const updateLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        updateUserLocationInFirebase(latitude, longitude);
      },
      error => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const updateUserLocationInFirebase = (latitude, longitude) => {
    const uid = auth.currentUser.uid;
    const userDocRef = doc(firestore, 'users', uid);

    setDoc(userDocRef, { location: { latitude, longitude } }, { merge: true })
      .then(() => {
        console.log('User location updated in Firebase.');
      })
      .catch(error => {
        console.error('Error updating user location:', error);
      });
  };

  const startBluetoothScan = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      console.log("Device found: ", device.name);
    });
  };

  const onHeaderButtonPress = async () => {
    console.log('Header Button Pressed');
    const targetUserLocation = await getTargetUserLocation('ppsls@naver.com');
    if (targetUserLocation && currentPosition) {
      const distance = calculateDistance(
        currentPosition.latitude,
        currentPosition.longitude,
        targetUserLocation.latitude,
        targetUserLocation.longitude
      );
  
      if (distance <= 0.5) { // 거리가 0.5km (500m) 이내인 경우
        console.log('가까이 있음');
      } else {
        console.log('멀리 있음');
      }
    }
  };

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
          showsUserLocation={false}
        />
        {currentPosition && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              mapRef.current.animateToRegion(currentPosition, 1000);
            }}>
            <Image
              style={{ width: 24, height: 24, tintColor: '#FFF' }}
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
    flexGrow: 1, // 컨테이너가 가능한 많은 공간을 차지하도록 함
    marginRight: 40, // 버튼과의 간격 조정
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 25,
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
    backgroundColor: '#46afcf',
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
