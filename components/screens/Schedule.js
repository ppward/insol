import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Modal,
  Button,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Calendar} from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const itWidth = Dimensions.get('window').width;

export default function Schedule() {
  const [selected, setSelected] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [when, setWhen] = useState('');
  const [where, setWhere] = useState('');
  const [what, setWhat] = useState('');
  const [modelState, setModalState] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [timeSet, setTimeSet] = useState('');

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = date => {
    const kstDate = new Date(date.getTime());
    const formattedTime = new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // or true for 12-hour format
    }).format(kstDate);
    setTimeSet(formattedTime);
    console.log('A date has been picked: ', date);
    hideDatePicker();
  };

  const addSchedule = (when, where, what) => {
    setSchedules([
      ...schedules,
      {when, where, what, id: Math.random().toString()},
    ]);
  };
  const renderSchedule = ({item}) => (
    <View
      style={{
        width: itWidth * 0,
        height: 80,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
      }}>
      <Text>{item.when}</Text>
      <Text>{item.where}</Text>
      <Text>{item.what}</Text>
    </View>
  );

  const renderModal = () => {
    <Modal>
      <View>
        <TextInput placeholder="언제" value={when} onChangeText={setWhen} />
        <TextInput
          placeholder="어디에서"
          value={where}
          onChangeText={setWhere}
        />
        <TextInput placeholder="무엇을" value={what} onChangeText={setWhat} />
        <Button
          title="일정 추가"
          onPress={() => addSchedule(when, where, what)}
        />
      </View>
    </Modal>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>일정 </Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          style={{padding: 0, margin: 0, borderRadius: 15}}
          onDayPress={day => {
            setSelected(day.dateString);
            setModalState(true);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: 'orange',
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
          backgroundColor: 'lightgrey',
        }}>
        <FlatList
          data={schedules}
          renderItem={renderSchedule}
          keyExtractor={item => item.id}
        />
      </View>
      <View
        style={{
          width: itWidth * 0,
          height: 80,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'lightgrey',
        }}></View>

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
                value={where}
                onChangeText={setWhere}
              />
            </View>
          </View>
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
              }}></MapView>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{...styles.modalItemName, marginTop: 10}}>
              <Text style={styles.modalItemText}>시간</Text>
            </View>
            <TouchableOpacity
              style={{...styles.modalItemInput, marginTop: 10}}
              onPress={() => {
                showDatePicker();
              }}>
              <View style={{alignItems: 'center'}}>
                {timeSet !== '' ? (
                  <Text>{timeSet}</Text>
                ) : (
                  <Text>시간선택</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{...styles.modalItemName, marginTop: 10}}>
              <Text style={styles.modalItemText}>내용</Text>
            </View>
            <View style={{...styles.modalItemInput, marginTop: 10}}>
              <TextInput
                style={{marginLeft: 15}}
                placeholder="일정 내용을 입력해주세요."
                value={what}
                onChangeText={setWhat}
              />
            </View>
          </View>

          <Button
            title="일정 추가"
            onPress={() => {
              //addSchedule(when, where, what)
              setModalState(false);
              console.log('날짜: ', selected);
            }}
          />
        </SafeAreaView>
        <DateTimePickerModal
          mode="time"
          locale="en_GB" // Use "en_GB" here
          date={new Date()}
          isVisible={isDatePickerVisible}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
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
    width: itWidth * 0.8,
    height: 290,
    marginTop: 30,
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
