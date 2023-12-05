<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
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
<<<<<<< HEAD
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from './Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { query, collection, where, getDoc, getDocs, setDoc, doc } from 'firebase/firestore';
=======
} from 'react-native';
import { auth, firestore } from './Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { query, collection, where, getDocs ,setDoc, doc } from 'firebase/firestore';
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955

const SignUpScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputClass, setInputClass] = useState('');
  const [inputJob, setInputJob] = useState('');
  const [inputStudentEmail, setInputStudentEmail] = useState('');
<<<<<<< HEAD
  const [kindergartens, setKindergartens] = useState([]); // 유치원 목록 상태
  const [selectedKindergarten, setSelectedKindergarten] = useState(); // 선택된 유치원 상태
  const [loading, setLoading] = useState(false);


  const fetchKindergartens = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, 'kindergarden'));
      const fetchedKindergartens = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        location: doc.data().location,
      }));
  
      if (fetchedKindergartens.length === 0) {
        Alert.alert('경고', '유치원 정보를 불러올 수 없습니다. 관리자에게 문의하세요.');
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
    // 기본 유효성 검사
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

    // 특정 역할에 대한 추가 유효성 검사
    if (inputJob === '학부모' && !inputStudentEmail.includes('@')) {
      Alert.alert('오류', '학생 이메일 형식이 잘못되었습니다');
      return;
    }

    // 이름을 기준으로 선택된 유치원 객체 찾기
    let selectedKinderInfo = null;
    if (inputJob === '학생' && selectedKindergarten) {
      selectedKinderInfo = kindergartens.find(kinder => kinder.id === selectedKindergarten);
      if (!selectedKinderInfo) {
        Alert.alert('오류', '유치원을 선택해 주세요');
=======

  const handleSignUp = async () => {
    let studentClass = '';
    if (!inputEmail.includes('@')) {
      Alert.alert('Error', 'Invalid email format');
      return;
    }
    if (inputPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (inputName.trim().length === 0) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    if (inputJob !== '학부모' && inputClass.trim().length === 0) {
      Alert.alert('Error', 'Class name is required');
      return;
    }

    if (inputJob === '학부모') {
      if (!inputStudentEmail.includes('@')) {
        Alert.alert('Error', 'Invalid student email format');
        return;
      }
  
      try {
        const studentsQuery = query(
          collection(firestore, 'users'),
          where('email', '==', inputStudentEmail),
          where('job', '==', '학생'),
        );
        const querySnapshot = await getDocs(studentsQuery);
  
        if (querySnapshot.empty) {
          Alert.alert('Error', 'No student account found with the provided email');
          return;
        } else {
          const studentDoc = querySnapshot.docs[0];
          const studentData = studentDoc.data();
  
          if (studentData.parent) {
            Alert.alert('Error', 'A parent is already registered for this student');
            return;
          } else {
            studentClass = studentData.class;
            await setDoc(studentDoc.ref, { ...studentData, parent: inputEmail });
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to verify student email');
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
        return;
      }
    }

<<<<<<< HEAD
    // Firebase 인증을 사용하여 사용자 등록
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, inputEmail, inputPassword);

      // Firestore에 저장할 사용자 데이터 준비
      const userData = {
        email: inputEmail,
        name: inputName,
        job: inputJob,
        class: inputClass,
        studentEmail: inputJob === '학부모' ? inputStudentEmail : null,
      };
      console.log('-----------------------------------------------------',selectedKinderInfo)
      // 사용자가 학생인 경우 선택한 유치원 정보 추가
      if (inputJob === '학생' && selectedKinderInfo) {
        console.log('-----------------------------------------------------')
        userData.kindergarten = selectedKinderInfo.name;
        // 유치원의 위치 정보 추가
        // 데이터 구조에 맞게 location 필드가 객체 형태로 저장되어야 합니다.
        userData.location = {
          latitude: selectedKinderInfo.location.latitude,
          longitude: selectedKinderInfo.location.longitude
        };
        console.log(`Selected kindergarten's name: ${selectedKinderInfo.name}`);
        console.log(`Selected kindergarten's location: ${JSON.stringify(selectedKinderInfo.location)}`);
      }

      // 사용자 데이터를 Firestore에 저장
      await setDoc(doc(firestore, 'users', userCredential.user.uid), userData);

      Alert.alert('성공', '사용자 등록에 성공했습니다');
      navigation.navigate('Intro'); // 성공 시 소개 화면으로 이동
    } catch (error) {
      Alert.alert('오류', error.message);
=======
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputEmail,
        inputPassword,
      );
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        email: inputEmail,
        class: inputJob === '학부모' ? studentClass : inputClass,
        name: inputName,
        job: inputJob,
        studentEmail: inputJob === '학부모' ? inputStudentEmail : null,
      });
      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('Intro');
    } catch (error) {
      Alert.alert('Error', error.message);
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
    }
  };

  const handleLoginPress = job => {
    setInputJob(job);
    setModalVisible(true);
  };

<<<<<<< HEAD
  const renderModalContent = () => {
    return (
      <View style={styles.modalView}>
        <TextInput
          style={styles.input}
          onChangeText={setInputEmail}
          value={inputEmail}
          placeholder="이메일"
=======
  const renderModalContent = () => (
    <View style={styles.modalView}>
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
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
          placeholderTextColor="#C7C7CD"
          keyboardType="email-address"
          autoCapitalize="none"
        />
<<<<<<< HEAD
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
          <Picker
            selectedValue={selectedKindergarten}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedKindergarten(itemValue);
            }}
            style={styles.pickerStyle}
          >
            {kindergartens.map((kinder) => (
              <Picker.Item key={kinder.id} label={kinder.name} value={kinder.id} />
            ))}
          </Picker>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
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
      <View style={{ ...styles.half, alignItems: 'flex-end' }}>
=======
      )}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{...styles.half, alignItems: 'flex-end'}}>
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
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

<<<<<<< HEAD
      <View style={{ ...styles.half, alignItems: 'flex-start' }}>
=======
      <View style={{...styles.half, alignItems: 'flex-start'}}>
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
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
<<<<<<< HEAD
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
=======
        onRequestClose={() => setModalVisible(!modalVisible)}>
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            {renderModalContent()}
          </View>
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
<<<<<<< HEAD
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
=======
>>>>>>> 6a5ec255b3e00d339450966d675f64a943bf2955
});

export default SignUpScreen;
