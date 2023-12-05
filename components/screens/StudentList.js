<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, {useState, useEffect} from 'react';
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
<<<<<<< HEAD
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { auth, firestore } from '../Firebase';
=======
} from 'react-native';
import {auth, firestore} from '../Firebase';
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
<<<<<<< HEAD
import { CheckBox } from '@rneui/themed';
=======
import {CheckBox} from '@rneui/themed';
import {PermissionsAndroid, Platform} from 'react-native';
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
import Geolocation from '@react-native-community/geolocation';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [checkedIds, setCheckedIds] = useState({});
  const [userClass, setUserClass] = useState('');
  const [teacherName, setTeacherName] = useState('');
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse');
=======
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
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
            if (userJob === '선생님') {
              setTeacherName(userName);
            }
            const {class: userClass} = userDocSnap.data();
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

          if (querySnapshot.docs.length === 0) {
            console.log('No students found.');
          } else {
            const fetchedStudents = [];
            const fetchedCheckedIds = {};

            for (const docSnapshot of querySnapshot.docs) {
              const studentData = docSnapshot.data();
              const studentId = docSnapshot.id;
              const lastCheckedDate =
                studentData.attendance?.timestamp?.split('T')[0];
              let isChecked = studentData.attendance?.checked || false;

              if (lastCheckedDate && lastCheckedDate !== currentDate) {
                isChecked = false;
                await updateDoc(doc(firestore, 'users', studentId), {
                  'attendance.checked': false,
                  'attendance.timestamp': new Date().toISOString(),
                });
              }

              fetchedStudents.push({
                id: studentId,
                ...studentData,
                checked: isChecked,
              });
              fetchedCheckedIds[studentId] = isChecked;
            }

            setStudents(fetchedStudents);
            setCheckedIds(fetchedCheckedIds);
          }
        } else {
          console.log('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleAttendance = async () => {
<<<<<<< HEAD
    setIsLoading(true);
    const userLocation = await getCurrentUserLocation();
    if (!userLocation) {
      setIsLoading(false);
      return;
    }

    const tempCheckedIds = { ...checkedIds };
    for (const student of students) {
      const isClose = await checkProximity(userLocation, student.location);
      tempCheckedIds[student.id] = isClose;
=======
    const userLocation = await getCurrentUserLocation();
    if (!userLocation) return;

    // 모든 학생에 대한 출석 확인을 위한 임시 객체
    const tempCheckedIds = {...checkedIds};

    for (const student of students) {
      const isClose = await checkProximity(userLocation, student.location);
      tempCheckedIds[student.id] = isClose;

>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
      if (isClose) {
        await updateDoc(doc(firestore, 'users', student.id), {
          'attendance.checked': true,
          'attendance.timestamp': new Date().toISOString(),
        });
      }
    }
<<<<<<< HEAD
    setCheckedIds(tempCheckedIds);
    setIsLoading(false);
  };
  
=======

    // 모든 학생 처리 후 상태 업데이트
    setCheckedIds(tempCheckedIds);
  };
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955

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

<<<<<<< HEAD
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        style={{ width: 67, height: 67 }}
=======
  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image
        style={{width: 67, height: 67}}
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
        source={require('../../image/학생.png')}
      />
      <Text style={styles.itemText}>{item.name}</Text>
      <CheckBox
        checked={!!checkedIds[item.id]}
<<<<<<< HEAD
        disabled={true}
        iconType="material-community"
        checkedIcon="checkbox-outline"
        uncheckedIcon="checkbox-blank-outline"
=======
        disabled={true} // 체크박스를 비활성화합니다.
        iconType="material-community"
        checkedIcon="checkbox-outline"
        uncheckedIcon={'checkbox-blank-outline'}
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
<<<<<<< HEAD
      {isLoading ? (
        <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ) : (
        <View>
          <View style={styles.headerContainer}>
            <Image
              style={styles.profileImage}
              source={require('../../image/선생님.png')}
            />
            <View style={styles.userInfoContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.profileName}>
                  {teacherName || '선생님 이름'}
                </Text>
                <Text style={styles.profileName}> 선생님</Text>
              </View>
  
              <View style={{...styles.classInfoContainer, flexDirection: 'row'}}>
                <Text style={styles.classInfoText}>{userClass}</Text>
                <Text> 반</Text>
              </View>
              <TouchableOpacity
                style={styles.attendanceButton}
                onPress={handleAttendance}>
                <Text style={styles.attendanceButtonText}>출석</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={students}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </SafeAreaView>
  );
  
=======
      <View style={styles.headerContainer}>
        <Image
          style={styles.profileImage}
          source={require('../../image/선생님.png')}
        />
        <View style={styles.userInfoContainer}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.profileName}>
              {teacherName || '선생님 이름'}
            </Text>
            <Text style={styles.profileName}> 선생님</Text>
          </View>

          <View style={{...styles.classInfoContainer, flexDirection: 'row'}}>
            <Text style={styles.classInfoText}>{userClass}</Text>
            <Text> 반</Text>
          </View>
          <TouchableOpacity
            style={styles.attendanceButton}
            onPress={handleAttendance}>
            <Text style={styles.attendanceButtonText}>출석</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
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
<<<<<<< HEAD
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
=======
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
});
