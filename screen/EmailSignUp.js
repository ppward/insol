// RegisterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth } from '../components/Firebase'; // Firebase 설정 파일에서 auth를 불러옵니다

const EmailSignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
        // 회원가입 후 로그인 화면 또는 다른 화면으로 이동
        navigation.navigate('Login');
      })
      .catch(error => alert(error.message));
  }

  return (
    <View>
      <TextInput
        placeholder="이메일"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        placeholder="비밀번호"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <Button
        onPress={handleSignUp}
        title="회원가입"
      />
    </View>
  );
}

export default EmailSignUp;
