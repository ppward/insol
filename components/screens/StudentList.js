import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { auth, firestore } from '../Firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // 현재 로그인한 사용자의 정보를 가져옵니다.
        const uid = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
    
        if (userDocSnap.exists()) {
          const { class: userClass, job: userJob } = userDocSnap.data();
          // '선생님', '버스기사', '부모님' 중 하나일 때만 진행합니다.
          if (['선생님', '버스기사', '부모님'].includes(userJob)) {
            // job이 '학생'이고 현재 사용자와 동일한 'class'를 가진 사용자들을 쿼리합니다.
            const studentsQuery = query(
              collection(firestore, 'users'),
              where('job', '==', '학생'),
              where('class', '==', userClass)
            );
            const querySnapshot = await getDocs(studentsQuery);
            if (querySnapshot.docs.length === 0) {
              console.log('No students found in the same class.');
            } else {
              const userList = querySnapshot.docs.map(userDoc => {
                const userData = userDoc.data();
                return { id: userDoc.id, ...userData };
              });
              setStudents(userList);
            }
          } else {
            console.log('User is not authorized to view student list.');
          }
        } else {
          console.log('User document does not exist.');
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
  
    fetchStudents();
  }, []);
  

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name} - {item.class}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  itemContainer: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  itemText: {
    fontSize: 16,
  },
});
