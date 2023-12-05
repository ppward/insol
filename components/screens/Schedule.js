import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Modal,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Calendar} from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
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

  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

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

          height: 30,
          justifyContent: 'center',
        }}
        onPress={() => handlePredictionPress(item.description)}>
        <Text>{item.description}</Text>
      </TouchableOpacity>
    );
  };
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
              <Text>추가</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
              style={{
                justifyContent: 'center',
                marginLeft: 15,
                backgroundColor: '#fff',
                width: 120,
                borderRadius: 10,
                marginTop: 10,
              }}
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
              style={{
                justifyContent: 'center',
                marginLeft: 5,
                backgroundColor: '#fff',
                width: 120,
                borderRadius: 10,
                marginTop: 10,
              }}
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
});
