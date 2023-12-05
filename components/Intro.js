import React, {useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import {auth} from '../components/Firebase'; // Ensure this path is correct
import {signInWithEmailAndPassword} from 'firebase/auth';

const device_Height = Dimensions.get('window').height;
const device_Width = Dimensions.get('window').width;
const onFocusedHeight = device_Height * 0.8;
// Separate component for the login modal content
const LoginModalContent = ({
  onLogin,
  onEmailChange,
  onPasswordChange,
  email,
  password,
}) => {
  return (
    <View style={styles.modalContentContainer}>
      <View style={{width: '80%'}}>
        <TextInput
          style={{...styles.input, backgroundColor: '#f5f5f5'}}
          onChangeText={onEmailChange}
          value={email}
          placeholder="이메일"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={{width: '80%'}}>
        <TextInput
          style={{...styles.input, backgroundColor: '#f5f5f5'}}
          onChangeText={onPasswordChange}
          value={password}
          placeholder="비밀번호"
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.modalButton} onPress={onLogin}>
        <Text style={styles.modalButtonText}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function Intro() {
  const navigation = useNavigation();
  const modalizeRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const onOpen = () => {
    setIsLoginVisible(false);
    modalizeRef.current?.open();
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // console.log('Logged in with:', userCredential.user);
      modalizeRef.current?.close();
      navigation.navigate('Tab'); // Replace with your map screen route name
    } catch (error) {
      Alert.alert('Login failed', error.message);
    }
  };

  function ModalContent() {
    return (
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{marginTop: 100}}
          onPress={() => setIsLoginVisible(true)}>
          <View style={styles.modalButton}>
            <Text style={styles.modalButtonText}>로그인</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginTop: 30}}
          onPress={() => navigation.navigate('SignUp')}>
          <View style={styles.modalButton}>
            <Text style={styles.modalButtonText}>회원가입</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onOpen}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.header}>인솔</Text>
          <Text style={{top: 50, fontSize: 28}}>[ insol ]</Text>
          <Image
            source={require('../assets/7605994.jpg')}
            style={{top: '20%', width: device_Width, height: device_Width}}
          />
        </View>
      </TouchableWithoutFeedback>

      <Modalize
        ref={modalizeRef}
        snapPoint={device_Height / 2}
        modalStyle={styles.modalStyle}
        onClosed={() => setIsLoginVisible(false)}>
        {isLoginVisible ? (
          <LoginModalContent
            onLogin={handleLogin}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            email={email}
            password={password}
          />
        ) : (
          <ModalContent />
        )}
      </Modalize>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(177,168,235)',
  },
  header: {
    top: 30,
    fontSize: 60,
    fontWeight: 'bold',
  },
  modalButton: {
    width: 232,
    height: 64,
    backgroundColor: '#8C7FE1',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
  },
  modalContentContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  modalStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});
