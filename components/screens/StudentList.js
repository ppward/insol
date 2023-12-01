import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {auth, firestore} from '../Firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import {CheckBox} from '@rneui/themed';
export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const {job: userJob, email: userEmail} = userDocSnap.data();

          let studentsQuery;
          if (['선생님', '버스기사'].includes(userJob)) {
            const {class: userClass} = userDocSnap.data();
            studentsQuery = query(
              collection(firestore, 'users'),
              where('job', '==', '학생'),
              where('class', '==', userClass),
            );
          } else if (userJob === '학부모') {
            studentsQuery = query(
              collection(firestore, 'users'),
              where('job', '==', '학생'),
            );
          } else {
            console.log('User is not authorized to view student list.');
            return;
          }

          const querySnapshot = await getDocs(studentsQuery);
          if (querySnapshot.docs.length === 0) {
            console.log('No students found.');
          } else {
            const userList = querySnapshot.docs
              .map(userDoc => {
                const userData = userDoc.data();
                console.log(`Student's email: ${userData.email}`);
                if (userJob === '학부모' && userData.parent !== userEmail) {
                  return null;
                }
                return {id: userDoc.id, ...userData};
              })
              .filter(Boolean);
            setStudents(userList);
          }
        } else {
          console.log('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image
        style={{width: 67, height: 67}}
        source={require('../../image/학생.png')}
      />
      <Text style={styles.itemText}>
        {item.name} - {item.class}
      </Text>
      <CheckBox
        checked={checked}
        onPress={() => setChecked(!checked)}
        iconType="material-community"
        checkedIcon="checkbox-outline"
        uncheckedIcon={'checkbox-blank-outline'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{height: 220, flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            width: 165,
            height: 220,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            marginLeft: 20,
            borderRadius: 15,
          }}>
          <Image
            style={{width: 93, height: 93}}
            source={require('../../image/선생님.png')}
          />
          <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 5}}>
            선생님 이름
          </Text>
        </View>
        <View>
          <TouchableOpacity style={{backgroundColor: 'green', marginLeft: 50}}>
            <Text>출석</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: '#B1A8EB',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#F6F1E8',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
  },
  itemText: {
    fontSize: 16,
  },
});
