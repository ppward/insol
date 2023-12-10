import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {auth, firestore} from '../Firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import {CheckBox} from '@rneui/themed';
import Geolocation from '@react-native-community/geolocation';
import {ActivityIndicator} from 'react-native';

export default function BusList() {
  const [students, setStudents] = useState([]);
  const [busAttendance, setBusAttendance] = useState({});
  const [userClass, setUserClass] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const getCurrentUserLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return Promise.reject('Location permission not granted');
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.error('Error getting current location:', error);
          reject(null);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    });
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const {
            job: userJob,
            email: userEmail,
            class: userClass,
            name: userName,
          } = userDocSnap.data();

          let studentsQuery;
          if (['선생님', '버스기사'].includes(userJob)) {
            if (userJob === '버스기사') {
              setTeacherName(userName);
            }
            setUserClass(userClass);
            studentsQuery = query(
              collection(firestore, 'users'),
              where('job', '==', '학생'),
              where('class', '==', userClass),
            );
          } else if (userJob === '학부모') {
            studentsQuery = query(
              collection(firestore, 'users'),
              where('job', '==', '학생'),
            );
          } else {
            console.log('User is not authorized to view student list.');
            return;
          }

          const querySnapshot = await getDocs(studentsQuery);
          const currentDate = new Date().toISOString().split('T')[0];

          const fetchedStudents = [];
          const fetchedBusAttendance = {};

          for (const docSnapshot of querySnapshot.docs) {
            const studentData = docSnapshot.data();
            const studentId = docSnapshot.id;

            let isChecked = false;
            if (userJob === '버스기사') {
              isChecked = studentData.busAttendance?.checked || false;
              const lastCheckedDate =
                studentData.busAttendance?.timestamp?.split('T')[0];
              if (lastCheckedDate && lastCheckedDate !== currentDate) {
                isChecked = false;
                await updateDoc(doc(firestore, 'users', studentId), {
                  'busAttendance.checked': false,
                  'busAttendance.timestamp': new Date().toISOString(),
                });
              }
            }

            fetchedStudents.push({
              id: studentId,
              ...studentData,
              checked: isChecked,
            });
            fetchedBusAttendance[studentId] = isChecked;
          }

          setStudents(fetchedStudents);
          setBusAttendance(fetchedBusAttendance);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleBusAttendance = async () => {
    setIsLoading(true);
    const userLocation = await getCurrentUserLocation();
    if (!userLocation) {
      setIsLoading(false); // 로딩 종료
      return;
    }

    // 모든 학생에 대한 버스 출석 확인을 위한 임시 객체
    const newBusAttendance = {...busAttendance};

    // 각 학생에 대한 처리
    for (const student of students) {
      const isClose = await checkProximity(userLocation, student.location);
      newBusAttendance[student.id] = isClose;

      if (isClose) {
        await updateDoc(doc(firestore, 'users', student.id), {
          'busAttendance.checked': true,
          'busAttendance.timestamp': new Date().toISOString(),
        });
      } else {
        newBusAttendance[student.id] = false;
      }
    }

    // 모든 학생 처리 후 상태 업데이트
    setBusAttendance(newBusAttendance);
    setIsLoading(false);
  };

  const checkProximity = (userLocation, studentLocation) => {
    const {latitude: userLat, longitude: userLng} = userLocation;
    const {latitude: studentLat, longitude: studentLng} = studentLocation;
    const distance = getDistanceFromLatLonInKm(
      userLat,
      userLng,
      studentLat,
      studentLng,
    );
    return distance < 0.5;
  };
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const deg2rad = deg => {
    return deg * (Math.PI / 180);
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image
        style={{width: 67, height: 67}}
        source={require('../../image/학생.png')}
      />
      <Text style={styles.itemText}>{item.name}</Text>
      <CheckBox
        checked={!!busAttendance[item.id]} // busAttendance 사용
        disabled={true}
        iconType="material-community"
        checkedIcon="checkbox-outline"
        uncheckedIcon="checkbox-blank-outline"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Image
              style={styles.profileImage}
              source={require('../../image/버스.png')}
            />
            <View style={styles.userInfoContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.profileName}>
                  {teacherName || '선생님 이름'}
                </Text>
                <Text style={styles.profileName}> 버스기사 </Text>
              </View>

              <View
                style={{...styles.classInfoContainer, flexDirection: 'row'}}>
                <Text style={styles.classInfoText}>{userClass}</Text>
                <Text> 반</Text>
              </View>
              <TouchableOpacity
                style={styles.attendanceButton}
                onPress={handleBusAttendance}>
                <Text style={styles.attendanceButtonText}>출석</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={students}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B1A8EB',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 16,
    marginTop: 36,
  },
  profileImage: {
    width: 93,
    height: 93,
    borderRadius: 46.5,
    borderWidth: 2,
    borderColor: 'black',
  },
  userInfoContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 15,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  classInfoContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 4,
  },
  classInfoText: {
    fontSize: 16,
    color: '#000',
  },
  attendanceButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  attendanceButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
