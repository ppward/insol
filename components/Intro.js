import React, {useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';

const device_Height = Dimensions.get('window').height;
const device_Width = Dimensions.get('window').width;

export default function Intro() {
  const navigation = useNavigation();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const modalizeRef = useRef(null);
  const onOpen = () => {
    modalizeRef.current?.open();
  };
  function ModalContent() {
    return (
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity style={{marginTop: 150}}>
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
    <TouchableWithoutFeedback onPress={() => onOpen()}>
      <View
        style={{
          ...styles.container,
          backgroundColor: 'rgb(177,168,235)',
        }}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.header}>인솔</Text>
          <Text style={{top: 50, fontSize: 28}}>[ insol ]</Text>
          <Image
            source={require('../assets/7605994.jpg')}
            style={{top: '20%', width: device_Width, height: device_Width}}
          />
        </View>

        <Modalize
          snapPoint={device_Height / 2}
          ref={modalizeRef}
          modalStyle={{backgroundColor: 'rgba(255,255,255,0.5)'}}>
          <ModalContent />
        </Modalize>
      </View>
    </TouchableWithoutFeedback>
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
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
  },
});
