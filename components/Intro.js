import React, {useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Button, TextInput, Provider as PaperProvider} from 'react-native-paper';

export default function Intro() {
  const chartHeight = Dimensions.get('window').height;
  const chartWidth = Dimensions.get('window').width;

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const modalizeRef = useRef(null);
  const onOpen = () => {
    modalizeRef.current?.open();
  };
  function ModalContent() {
    return (
      <ScrollView>
        <TouchableOpacity>
          <View>
            <Text>로그인</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
            <Text>회원가입</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  return (
    <TouchableWithoutFeedback onpress={() => onOpen()}>
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
            style={{top: '20%', width: chartWidth, height: chartWidth}}
          />
        </View>

        <Modalize ref={modalizeRef}>
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
  },
  header: {
    top: 30,
    fontSize: 60,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  modalText: {
    borderRadius: 4,
    margin: 5,
  },
});
