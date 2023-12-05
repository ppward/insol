import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import Maps from '../components/screens/Maps';
import Schedule from '../components/screens/Schedule';
import StudentList from '../components/screens/StudentList';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import BusList from '../components/screens/BusList';
const Tab = createBottomTabNavigator();

export default function TabNav() {
  const [userRole, setUserRole] = useState(null);
  const auth = getAuth(); // 파이어베이스 인증 서비스 초기화
  const firestore = getFirestore(); // 파이어베이스 Firestore 서비스 초기화

  useEffect(() => {
    // 사용자 인증 상태가 변경될 때 실행될 리스너 설정
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // 사용자가 로그인한 경우, 사용자의 'job' 정보를 가져옴
        const userDocRef = doc(firestore, 'users', user.uid);
        getDoc(userDocRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUserRole(userData.job); // 가져온 'job' 값을 userRole 상태에 저장
          }
        });
      } else {
        // 사용자가 로그아웃한 경우
        setUserRole(null);
      }
    });

    // 컴포넌트 언마운트 시 리스너 해제
    return () => unsubscribe();
  }, [auth, firestore]);

  return (
    <Tab.Navigator initialRouteName="Map" screenOptions={{ headerShown: false }}>
      { (userRole === '선생님' ) && (
        <Tab.Screen
          name="StudentsList"
          component={StudentList}
          options={{
            tabBarIcon: () => (
              <Image
                style={{ width: 30, height: 30 }}
                source={require('../assets/customer.png')}
              />
            ),
          }}
        />
      )}
      { (userRole === '버스기사' ) && (
        <Tab.Screen
          name="BusList"
          component={BusList}
          options={{
            tabBarIcon: () => (
              <Image
                style={{ width: 30, height: 30 }}
                source={require('../assets/customer.png')}
              />
            ),
          }}
        />
      )}
       <Tab.Screen
        name="Map"
        component={Maps}
        options={{
          tabBarIcon: () => (
            <Image
              style={{width: 30, height: 30}}
              source={require('../assets/boy.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        options={{
          tabBarIcon: () => (
            <Image
              style={{width: 30, height: 30}}
              source={require('../assets/calendar.png')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
