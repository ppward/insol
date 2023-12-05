import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Modal,
<<<<<<< HEAD
=======
  Alert,
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Calendar} from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
<<<<<<< HEAD
=======
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
  deleteDoc,
} from 'firebase/firestore';

>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
const API_KEY = 'AIzaSyC3k7HBbhN327lvM3fyx006TZ3bHcYS9KY';
const itWidth = Dimensions.get('window').width;

export default function Schedule() {
  const [selected, setSelected] = useState('');
  const [schedules, setSchedules] = useState([]);

  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [coord, setCoord] = useState({
    latitude: 36.7991,
    longitude: 127.0748,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [modelState, setModalState] = useState(false);
<<<<<<< HEAD

=======
  const [userData, setUserData] = useState({});
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

<<<<<<< HEAD
=======
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
          console.log(userDocSnap.data().class);
        } else {
          console.error('No such Document');
        }
      } catch (error) {
        console.error('Error such Document : ', error);
      }
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const q = query(
          collection(firestore, 'schedules'),
          where('class', '==', userData.class),
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
    };
    if (userData.class) {
      fetchSchedules();
    }
  }, [userData]);

>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  // 종료시간 선택기를 보여주는 함수
  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  // 시작시간 선택기를 숨기는 함수
  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  // 종료시간 선택기를 숨기는 함수
  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };
  // 시작시간을 설정하는 함수
  const handleStartConfirm = date => {
    const formattedTime = formatTime(date); // 시간 형식을 설정하는 함수
    setStartTime(formattedTime);
    hideStartTimePicker();
  };

  // 종료시간을 설정하는 함수
  const handleEndConfirm = date => {
    const formattedTime = formatTime(date); // 시간 형식을 설정하는 함수
    setEndTime(formattedTime);
    hideEndTimePicker();
  };
  // 시간 형식을 설정하는 함수
  const formatTime = date => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };
  /// place api 자동완성 코드

  const [predictions, setPredictions] = useState([]);
  const country = 'KR';
  const [autocompleteVisible, setAutocompleteVisible] = useState(false);
  const handlePredictionPress = predict => {
    setAddress(predict);
  };
  const handleQueryChange = async value => {
    //아직 해야함.
    setAddress(value);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          value,
        )}&key=${API_KEY}&components=country:${country}`,
      );

      if (response.ok) {
        const data = await response.json();
        if (data.predictions) {
          const topPredictions = data.predictions.slice(0, 4);
          console.log(topPredictions);
          setPredictions(topPredictions);
        } else {
          setPredictions([]);
        }
      } else {
        setPredictions([]);
      }
    } catch (error) {
      setPredictions([]);
    }
  };
  const renderPrediction = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          margin: 1,
<<<<<<< HEAD

=======
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
          height: 30,
          justifyContent: 'center',
        }}
        onPress={() => handlePredictionPress(item.description)}>
        <Text>{item.description}</Text>
      </TouchableOpacity>
    );
  };
<<<<<<< HEAD
=======

>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
  const geocodeAddress = async address => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address,
        )}&key=${API_KEY}`,
      );
      const data = await response.json();
      if (data.status === 'OK') {
        const {lat, lng} = data.results[0].geometry.location;
        return {latitude: lat, longitude: lng};
      } else if (data.status === 'ZERO_RESULTS') {
        console.log('No results found for the specified address.');
        return null;
      } else {
        console.log(`Geocoding failed with status: ${data.status}`);
        return null;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const handleSearch = async () => {
    if (address.trim() === '') {
      console.log('Please enter a valid address');
      return;
    }

    const coordinates = await geocodeAddress(address);
    if (coordinates) {
      setCoord(prevCoord => ({
        ...prevCoord,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      }));
      console.log('Coordinates:', coordinates);
    } else {
      console.log('Failed to geocode address. Please try again.');
    }
  };
<<<<<<< HEAD
  const addSchedule = (date, address, startTime, endTime, description) => {
    setSchedules(prevSchedules => [
      ...prevSchedules,
      {
        date,
        address,
        startTime,
        endTime,
        description,
        id: Math.random().toString(),
      },
    ]);
=======
  const addSchedule = async (
    date,
    address,
    startTime,
    endTime,
    description,
  ) => {
    const newSchedule = {
      date,
      address,
      startTime,
      endTime,
      description,
    };
    try {
      const docRef = doc(collection(firestore, 'schedules'));
      await setDoc(docRef, {...newSchedule, class: userData.class}); // 파이어베이스 데이타 추가
      setSchedules(prevSchedules => [
        ...prevSchedules,
        {...newSchedule, id: docRef.id},
      ]);
    } catch (error) {
      console.error('Error adding schedule to firebase: ', error);
    }
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
  };
  const markedDates = schedules.reduce((acc, curr) => {
    const dot = {key: 'dot', color: 'blue', selectedDotColor: 'blue'};

    if (curr.date) {
      if (acc[curr.date]) {
        // If there's already an entry for this date, just push the dot
        acc[curr.date].dots.push(dot);
      } else {
        // Otherwise, create a new entry
        acc[curr.date] = {dots: [dot], marked: true};
      }
    }
    return acc;
  }, {});
<<<<<<< HEAD

=======
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const openEditModal = scheduleId => {
    const scheduleToEdit = schedules.find(
      schedule => schedule.id === scheduleId,
    );
    console.log('여기', scheduleToEdit);
    if (scheduleToEdit) {
      setSelected(scheduleToEdit.date);
      setAddress(scheduleToEdit.address);
      setStartTime(scheduleToEdit.startTime);
      setEndTime(scheduleToEdit.endTime);
      setDescription(scheduleToEdit.description);
      setEditId(scheduleId);
      //setEdit(true); // Assuming you have a state to track if it's an edit operation
      setModalState(true);
      setEdit(true);
    }
  };

  const updateSchedule = async () => {
    const editedSchedule = {
      date: selected,
      address: address,
      startTime: startTime,
      endTime: endTime,
      description: description,
      id: editId,
    };

    const updatedSchedules = schedules.map(schedule =>
      schedule.id === editId ? {...schedule, ...editedSchedule} : schedule,
    );
    setSchedules(updatedSchedules);

    // Update in Firestore
    const scheduleRef = doc(firestore, 'schedules', editId);
    try {
      await setDoc(scheduleRef, editedSchedule, {merge: true});
      console.log('Schedule updated successfully');
    } catch (error) {
      console.error('Error updating schedule: ', error);
    }

    // Reset states and close modal
    setEdit(false);

    setEditId('');
    // Reset other states like selected, address, etc. if needed
  };

  const deleteSchedule = async scheduleId => {
    const docRef = doc(firestore, 'schedules', scheduleId);

    try {
      await deleteDoc(docRef);
      console.log('Document successfully deleted!');

      // Update state to remove the schedule from the list
      setSchedules(prevSchedules =>
        prevSchedules.filter(schedule => schedule.id !== scheduleId),
      );
    } catch (error) {
      console.error('Error removing schedule: ', error);
    }
  };
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
  // TextInput에 포커스가 있을 때 자동완성 활성화
  const handleFocus = () => {
    setAutocompleteVisible(true);
  };
  useEffect(() => {
    console.log(schedules);
  }, [schedules]);
  // TextInput에서 포커스를 잃었을 때 자동완성 비활성화
  const handleBlur = () => {
    setAutocompleteVisible(false);
  };
  const renderSchedule = ({item}) => {
    // Check if 'item' is not null or undefined.
    if (!item) {
      return null; // or return a placeholder component
    }
<<<<<<< HEAD

    // Return the component that formats the schedule information.
    if (selected === item.date) {
      return (
        <View>
          <Text>장소 {item.address}</Text>
          <Text>날짜 {item.date}</Text>
          <Text>
            시간 {item.startTime}~{item.endTime}
          </Text>
          <Text>활동내용 {item.description}</Text>
        </View>
      );
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>일정 </Text>
        </View>
        <View>
          <TouchableOpacity
            style={{
              width: 80,
=======
    const handleLongPress = () => {
      if (userData.job === '선생님') {
        Alert.alert('일정 삭제', '현재 선택한 일정을 삭제하시겠습니까?', [
          // Button array
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => deleteSchedule(item.id),
          },
        ]);
      }
    };
    const handlePress = () => {
      if (userData.job === '선생님') {
        openEditModal(item.id);
      }
    };
    // Return the component that formats the schedule information.
    if (selected === item.date) {
      return (
        <TouchableOpacity
          onPress={() => handlePress()}
          onLongPress={() => {
            handleLongPress();
          }}>
          <View>
            <Text>장소 {item.address}</Text>
            <Text>날짜 {item.date}</Text>
            <Text>
              시간 {item.startTime}~{item.endTime}
            </Text>
            <Text>활동내용 {item.description}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };
  const completeModal = () => {
    setModalState(false);
    setSelected('');
    setAddress('');
    setStartTime('');
    setEndTime('');
    setDescription('');
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>일정 </Text>
      </View>
      {userData.job === '선생님' && (
        <View style={{position: 'absolute', right: 20, top: 80}}>
          <TouchableOpacity
            style={{
              width: 60,
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#4CAF50',
              borderRadius: 15,
            }}
            onPress={() => {
              setModalState(true);
            }}>
            <View>
<<<<<<< HEAD
              <Text>추가</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
=======
              <Text style={{fontWeight: 'bold'}}>추가</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
      <View style={styles.calendarContainer}>
        <Calendar
          style={{padding: 0, margin: 0, borderRadius: 15, height: 355}}
          onDayPress={day => {
            setSelected(day.dateString);
          }}
          markedDates={{
            ...markedDates, // Spread the markedDates from the reducer
            [selected]: {
              ...markedDates[selected], // Spread any existing properties for the selected date
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: 'orange',
              selectedColor: 'blue', // Assuming you want the selected day to also have a blue background
            },
          }}
        />
      </View>
<<<<<<< HEAD
      <View
        style={{
          margin: 15,
          width: itWidth * 0.9,
          height: 250,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          flex: 1,
        }}>
        {schedules.length !== 0 && (
          <FlatList
            data={schedules}
            renderItem={renderSchedule}
            keyExtractor={item => item.id}
          />
=======
      <View style={styles.scheduleBox}>
        {schedules.some(schedule => schedule.date === selected) ? (
          <FlatList
            data={schedules.filter(schedule => schedule.date === selected)}
            renderItem={renderSchedule}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text>일정이 없습니다</Text>
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
        )}
      </View>

      {/* 모달 창 시작 */}
      <Modal visible={modelState}>
        <SafeAreaView style={styles.modalContainerView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>일정</Text>
            <Text style={styles.modalHeaderText}>추가하기</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                ...styles.modalItemName,
                marginTop: 80,
              }}>
              <Text style={styles.modalItemText}>장소</Text>
            </View>
            <View
              style={{
                ...styles.modalItemInput,
                marginTop: 80,
              }}>
              <TextInput
                style={{marginLeft: 15}}
                placeholder="장소를 입력해주세요."
                value={address}
                onChangeText={handleQueryChange}
                returnKeyType="search"
                onSubmitEditing={() => handleSearch()}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </View>
          </View>
          {autocompleteVisible && address !== '' && (
<<<<<<< HEAD
            <View
              style={{
                position: 'absolute',
                width: '90%',

                height: 100,
                alignSelf: 'center',
                alignItems: 'center',
                top: 310,
                zIndex: 1,
                borderRadius: 10,
                backgroundColor: '#FFF',
              }}>
=======
            <View style={styles.predictionBox}>
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
              <FlatList
                data={predictions}
                renderItem={renderPrediction}
                keyExtractor={item => item.place_id}
                style={styles.predictionsList}
              />
            </View>
          )}
          <View
            style={{
              margin: 10,
              width: '90%',
              height: 200,
              alignSelf: 'center',
              backgroundColor: '#fff',
              borderRadius: 15,
            }}>
            <MapView
              style={{flex: 1, borderRadius: 15}}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: 37.077,
                longitude: 127.102,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              region={coord}></MapView>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{...styles.modalItemName, marginTop: 10}}>
              <Text style={styles.modalItemText}>시간</Text>
            </View>
            <TouchableOpacity
<<<<<<< HEAD
              style={{
                justifyContent: 'center',
                marginLeft: 15,
                backgroundColor: '#fff',
                width: 120,
                borderRadius: 10,
                marginTop: 10,
              }}
=======
              style={{...styles.timePickerModal, marginLeft: 15}}
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
              onPress={() => {
                showStartTimePicker();
              }}>
              <View style={{alignItems: 'center'}}>
                {startTime == '' ? (
                  <Text>시작시간</Text>
                ) : (
                  <Text>{startTime}</Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
<<<<<<< HEAD
              style={{
                justifyContent: 'center',
                marginLeft: 5,
                backgroundColor: '#fff',
                width: 120,
                borderRadius: 10,
                marginTop: 10,
              }}
=======
              style={styles.timePickerModal}
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
              onPress={() => {
                showEndTimePicker();
              }}>
              <View style={{alignItems: 'center'}}>
                {endTime == '' ? <Text>종료시간</Text> : <Text>{endTime}</Text>}
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                marginLeft: 20,
                width: 90,
                height: 150,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#8C7FE1',
                borderRadius: 15,
                marginTop: 10,
              }}>
              <Text style={styles.modalItemText}>내용</Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                marginLeft: 15,
                backgroundColor: '#fff',
                width: 245,
                height: 150,
                borderRadius: 10,
                marginTop: 10,
              }}>
              <TextInput
                style={{marginLeft: 15}}
                placeholder="일정 내용을 입력해주세요."
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>
<<<<<<< HEAD

          <TouchableOpacity
            onPress={() => {
              addSchedule(selected, address, startTime, endTime, description);
              setModalState(false);
              setSelected('');
              setAddress('');
              setStartTime('');
              setEndTime('');
              setDescription('');
            }}>
            <Text>일정추가</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalState(false);
              setSelected('');
              setAddress('');
              setStartTime('');
              setEndTime('');
              setDescription('');
            }}>
            <Text>취소</Text>
          </TouchableOpacity>
=======
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={{
                ...styles.scheduleModalButton,
                marginLeft: 20,
                backgroundColor: edit ? 'lightskyblue' : '#4E9F3D',
              }}
              onPress={() => {
                if (edit) {
                  // 수정 로직
                  updateSchedule();
                } else {
                  // 일정 추가 로직
                  addSchedule(
                    selected,
                    address,
                    startTime,
                    endTime,
                    description,
                  );
                }
                completeModal();
              }}>
              <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                {edit ? '수정하기' : '일정추가'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.scheduleModalButton,
                marginRight: 30,
                backgroundColor: 'red',
              }}
              onPress={() => {
                setEdit(false);
                setEditId('');
                completeModal();
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>취소</Text>
            </TouchableOpacity>
          </View>
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
        </SafeAreaView>

        <DateTimePickerModal
          isVisible={isStartTimePickerVisible}
          mode="time"
          locale="en_GB"
          date={new Date()}
          onConfirm={handleStartConfirm}
          onCancel={hideStartTimePicker}
        />

        {/* 종료시간 선택기 */}
        <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time"
          locale="en_GB"
          date={new Date()}
          onConfirm={handleEndConfirm}
          onCancel={hideEndTimePicker}
        />
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#B1A8EB',
  },
  headerContainer: {
    width: 150,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#8C7FE1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 26,
  },
  calendarContainer: {
    width: itWidth * 0.9,
    height: 330,
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
  },
<<<<<<< HEAD
=======
  scheduleBox: {
    margin: 15,
    width: itWidth * 0.9,
    height: 250,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  predictionBox: {
    position: 'absolute',
    width: '90%',
    height: 100,
    alignSelf: 'center',
    alignItems: 'center',
    top: 310,
    zIndex: 1,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
  modalContainerView: {
    flex: 1,
    backgroundColor: '#B1A8EB',
  },
  modalHeader: {
    marginTop: 30,
    width: 200,
    height: 85,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#8C7FE1',
  },
  modalHeaderText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalItemName: {
    marginLeft: 20,
    width: 90,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8C7FE1',
    borderRadius: 15,
  },
  modalItemInput: {
    justifyContent: 'center',
    marginLeft: 15,
    backgroundColor: '#fff',
    width: 245,
    borderRadius: 10,
  },
  modalItemText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
<<<<<<< HEAD
=======
  timePickerModal: {
    justifyContent: 'center',
    marginLeft: 5,
    backgroundColor: '#fff',
    width: 120,
    borderRadius: 10,
    marginTop: 10,
  },
  scheduleModalButton: {
    width: 120,
    height: 50,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  scheduleModalButtonText: {},
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
});
