import React, { useState } from 'react';
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
} from 'react-native';
import { auth, firestore } from './Firebase'; // Firebase 설정이 올바르게 되어있어야 합니다.
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { query, collection, where, getDocs ,setDoc, doc } from 'firebase/firestore';

const SignUpScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputClass, setInputClass] = useState('');
  const [inputJob, setInputJob] = useState('');
  const [inputStudentEmail, setInputStudentEmail] = useState('');

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
      // 학부모 회원가입 시 학생 이메일 검증 및 부모 정보 업데이트
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
            studentClass = studentData.class; // 학생의 class 정보 저장
            await setDoc(studentDoc.ref, { ...studentData, parent: inputEmail });
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to verify student email');
        return;
      }
    }
  
    // 계정 생성 로직
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputEmail,
        inputPassword,
      );
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        email: inputEmail,
        class: inputJob === '학부모' ? studentClass : inputClass, // 학부모는 학생의 class 사용
        name: inputName,
        job: inputJob,
        studentEmail: inputJob === '학부모' ? inputStudentEmail : null,
      });
      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('Intro');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLoginPress = job => {
    setInputJob(job);
    setModalVisible(true);
  };

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
          placeholderTextColor="#C7C7CD"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );

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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
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
});

export default SignUpScreen;
