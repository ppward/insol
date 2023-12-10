import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {auth, firestore} from './Firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {
  query,
  collection,
  where,
  getDoc,
  getDocs,
  setDoc,
  doc,
} from 'firebase/firestore';

const SignUpScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputClass, setInputClass] = useState('');
  const [inputJob, setInputJob] = useState('');
  const [inputStudentEmail, setInputStudentEmail] = useState('');
  const [kindergartens, setKindergartens] = useState([]); // 유치원 목록 상태
  const [selectedKindergarten, setSelectedKindergarten] = useState(); // 선택된 유치원 상태
  const [loading, setLoading] = useState(false);

  const fetchKindergartens = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(firestore, 'kindergarden'),
      );
      const fetchedKindergartens = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        location: doc.data().location,
      }));

      if (fetchedKindergartens.length === 0) {
        Alert.alert(
          '경고',
          '유치원 정보를 불러올 수 없습니다. 관리자에게 문의하세요.',
        );
        return;
      }

      setKindergartens(fetchedKindergartens);
      // 초기 선택된 유치원을 설정합니다.
      setSelectedKindergarten(fetchedKindergartens[0].id);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch kindergartens');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchKindergartens();
  }, []);

  const handleSignUp = async () => {
    // 입력값 기본 유효성 검사
    if (!inputEmail.includes('@')) {
      Alert.alert('오류', '이메일 형식이 잘못되었습니다');
      return;
    }
    if (inputPassword.length < 6) {
      Alert.alert('오류', '비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }
    if (inputName.trim().length === 0) {
      Alert.alert('오류', '이름은 필수 항목입니다');
      return;
    }
    let studentClass = null;
    // 학부모 회원가입 처리
    if (inputJob === '학부모') {
      if (!inputStudentEmail.includes('@')) {
        Alert.alert('오류', '학생 이메일 형식이 잘못되었습니다');
        return;
      }

      // 입력받은 학생 이메일로 Firestore에서 학생 문서 조회
      const studentQuery = query(
        collection(firestore, 'users'),
        where('email', '==', inputStudentEmail),
      );
      const studentQuerySnapshot = await getDocs(studentQuery);

      if (!studentQuerySnapshot.empty) {
        const studentDoc = studentQuerySnapshot.docs[0]; // 첫 번째 문서를 선택
        studentClass = studentDoc.data().class; // 학생의 class 정보 저장

        // 이미 parent 필드가 존재하면 회원가입 중단
        if (studentDoc.data().parent) {
          Alert.alert('오류', '이미 다른 학부모가 등록된 학생입니다.');
          return;
        }

        // 학생 문서에 학부모 이메일 저장
        await setDoc(studentDoc.ref, {parent: inputEmail}, {merge: true});
      } else {
        Alert.alert('오류', '등록된 학생의 이메일이 존재하지 않습니다.');
        return;
      }
    }
    // 이름을 기준으로 선택된 유치원 객체 찾기
    let selectedKinderInfo = null;
    if (inputJob === '학생' && selectedKindergarten) {
      selectedKinderInfo = kindergartens.find(
        kinder => kinder.id === selectedKindergarten,
      );
      if (!selectedKinderInfo) {
        Alert.alert('오류', '유치원을 선택해 주세요');
        return;
      }
    }
    // Firebase 인증을 사용하여 사용자 계정 생성
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputEmail,
        inputPassword,
      );

      // Firestore에 저장할 사용자 데이터 준비
      const userData = {
        email: inputEmail,
        name: inputName,
        job: inputJob,
        class: inputClass,
        class: inputJob === '학부모' ? studentClass : inputClass,
        // 학부모의 경우 studentEmail을 저장하고, 그렇지 않은 경우 null을 저장
        studentEmail: inputJob === '학부모' ? inputStudentEmail : null,
        // 다른 필드 추가 가능
        attendance: {
          checked: false, // 기본값을 false로 설정
          timestamp: '', // timestamp를 빈 문자열로 설정
        },
      };
      // 사용자가 학생인 경우 선택한 유치원 정보 추가
      if (inputJob === '학생' && selectedKinderInfo) {
        console.log('-----------------------------------------------------');
        userData.kindergarten = selectedKinderInfo.name;
        // 유치원의 위치 정보 추가
        // 데이터 구조에 맞게 location 필드가 객체 형태로 저장되어야 합니다.
        userData.kindergartenlocation = {
          latitude: selectedKinderInfo.location.latitude,
          longitude: selectedKinderInfo.location.longitude,
        };
        console.log(`Selected kindergarten's name: ${selectedKinderInfo.name}`);
        console.log(
          `Selected kindergarten's location: ${JSON.stringify(
            selectedKinderInfo.location,
          )}`,
        );
      }
      // Firestore에 사용자 문서 생성
      await setDoc(doc(firestore, 'users', userCredential.user.uid), userData);

      Alert.alert('성공', '회원가입에 성공했습니다.');
      navigation.navigate('Intro'); // 성공적으로 등록 후 이동할 화면
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };

  const handleLoginPress = job => {
    setInputJob(job);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    return (
      <KeyboardAvoidingView
        style={styles.modalView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TextInput
          style={styles.input}
          onChangeText={setInputEmail}
          value={inputEmail}
          placeholder="이메일"
          placeholderTextColor="#C7C7CD"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setInputPassword}
          value={inputPassword}
          placeholder="비밀번호"
          placeholderTextColor="#C7C7CD"
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setInputName}
          value={inputName}
          placeholder="이름"
          placeholderTextColor="#C7C7CD"
          autoCapitalize="none"
        />
        {inputJob !== '학부모' && (
          <TextInput
            style={styles.input}
            onChangeText={setInputClass}
            value={inputClass}
            placeholder="반 이름"
            placeholderTextColor="#C7C7CD"
            autoCapitalize="none"
          />
        )}
        {inputJob === '학부모' && (
          <TextInput
            style={styles.input}
            onChangeText={setInputStudentEmail}
            value={inputStudentEmail}
            placeholder="학생 이메일"
            placeholderTextColor="#C7C7CD"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
        {inputJob === '학생' && (
          <TouchableWithoutFeedback
            onPress={event => {
              event.stopPropagation();
            }}>
            <View style={{height: 50, width: 150}}>
              <Picker
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 15, // Removed semicolon as it's invalid inside an object
                }}
                selectedValue={selectedKindergarten}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedKindergarten(itemValue)
                }>
                {kindergartens.map(kinder => (
                  <Picker.Item
                    key={kinder.id}
                    label={kinder.name}
                    value={kinder.id}
                  />
                ))}
              </Picker>
            </View>
          </TouchableWithoutFeedback>
        )}
        <TouchableOpacity
          style={
            inputJob === '학생'
              ? {...styles.button, marginTop: 200}
              : styles.button
          }
          onPress={handleSignUp}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{...styles.half, alignItems: 'flex-end'}}>
        <View style={styles.quadrant}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => handleLoginPress('선생님')}>
            <Image
              source={require('../image/선생님.png')}
              style={styles.image}
            />
            <Text style={styles.label}>선생님 로그인</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quadrant}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => handleLoginPress('학생')}>
            <View style={styles.signupButton}>
              <Image
                source={require('../image/학생.png')}
                style={styles.image}
              />
              <Text style={styles.label}>학생 로그인</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{...styles.half, alignItems: 'flex-start'}}>
        <View style={styles.quadrant}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => handleLoginPress('학부모')}>
            <Image
              source={require('../image/부모님.png')}
              style={styles.image}
            />
            <Text style={styles.label}>학부모 로그인</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quadrant}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => handleLoginPress('버스기사')}>
            <Image source={require('../image/버스.png')} style={styles.image} />
            <Text style={styles.label}>버스기사 로그인</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>{renderModalContent()}</View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#B1A8EB',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 320,
    height: 400,
    backgroundColor: 'rgba(255,255,255,0)',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  half: {
    flex: 1,
    flexDirection: 'row',
  },
  quadrant: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupButton: {
    width: 165,
    height: 260,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  input: {
    width: 200,
    height: 50,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    textAlign: 'center',
    backgroundColor: '#F7F7F7',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerStyle: {
    width: '100%', // 또는 원하는 너비
    height: 50, // 또는 원하는 높이
    backgroundColor: '#FFFFFF', // 흰색 배경
    color: '#000000', // 검은색 글자
  },
  button: {
    width: 150,
    height: 50,
    marginTop: 40,
    backgroundColor: '#4E9F3D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
