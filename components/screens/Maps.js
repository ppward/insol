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
import { doc, getDoc, setDoc, collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';

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

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        // iOS 권한 요청 코드
      } else if (Platform.OS === 'android') {
        const response = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (response !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Location permission denied');
          return;
        }
      }

      // 위치 가져오기
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
          // Firebase에 위치 업데이트
          updateLocationInFirebase(latitude, longitude);
        },
        error => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
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

    requestLocationPermission();
    fetchUserJob();

    const intervalId = setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          updateLocationInFirebase(latitude, longitude);
        },
        error => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }, 600000);

    return () => clearInterval(intervalId);
  }, []);

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
            // 자녀(학생) 조회
            const studentsQuery = query(
              collection(firestore, 'users'),
              where('parent', '==', userEmail),
              where('job', '==', '학생')
            );
            const studentsSnapshot = await getDocs(studentsQuery);
            const childrenClasses = studentsSnapshot.docs.map(doc => doc.data().class);

            // 해당 반의 선생님 조회
            const teachersQuery = query(
              collection(firestore, 'users'),
              where('class', 'in', childrenClasses),
              where('job', '==', '선생님')
            );
            const teachersSnapshot = await getDocs(teachersQuery);
            const teachersData = teachersSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));

            // 자녀와 선생님 정보를 상태에 저장
            setFilteredUsers([...studentsSnapshot.docs.map(doc => doc.data()), ...teachersData]);
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
            const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
              const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));
              setFilteredUsers(usersData);
            });

            return unsubscribe;
          }
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
      </View>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={currentPosition}
          showsUserLocation={true}
        >
          {filteredUsers.map((user, index) => {
            if (user.location) {
              const key = user.id ? user.id.toString() : `user-${index}`;
              return (
                <Marker
                  key={key}
                  coordinate={{
                    latitude: user.location.latitude,
                    longitude: user.location.longitude,
                  }}
                  title={user.name || 'Unknown'}
                />
              );
            }
            return null;
          })}
        </MapView>
        {currentPosition && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              mapRef.current.animateToRegion(currentPosition, 1000);
            }}>
            <Image
              style={{ width: 28, height: 28, tintColor: '#fff' }}
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
});
