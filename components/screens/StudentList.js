import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { auth, firestore } from '../Firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const { job: userJob, email: userEmail } = userDocSnap.data();

          let studentsQuery;
          if (['선생님', '버스기사'].includes(userJob)) {
            const { class: userClass } = userDocSnap.data();
            studentsQuery = query(
              collection(firestore, 'users'),
              where('job', '==', '학생'),
              where('class', '==', userClass)
            );
          } else if (userJob === '학부모') {
            studentsQuery = query(
              collection(firestore, 'users'),
              where('job', '==', '학생')
            );
          } else {
            console.log('User is not authorized to view student list.');
            return;
          }

          const querySnapshot = await getDocs(studentsQuery);
          if (querySnapshot.docs.length === 0) {
            console.log('No students found.');
          } else {
            const userList = querySnapshot.docs.map(userDoc => {
              const userData = userDoc.data();
              console.log(`Student's email: ${userData.email}`);
              if (userJob === '학부모' && userData.parent !== userEmail) {
                return null;
              }
              return { id: userDoc.id, ...userData };
            }).filter(Boolean);
            setStudents(userList);
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