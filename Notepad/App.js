import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Button, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientText from './components/GradientText'
import { useFonts } from 'expo-font';

export default function App() {
  
  const [note, setNote] = useState({ title: '', description: '', date: '' });
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const [fontsLoaded] = useFonts({
    'Autography': require('./assets/fonts/Autography.otf'),
  });

  const saveNote = async () => {
    if (note.title === '' || note.description === '') {
      Alert.alert('Error', 'Please fill in both the title and description.');
      return;
    }
    
    const cDate = new Date();
    note.date = cDate.toDateString();

    const newNotes = [...notes, note];
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    setNotes(newNotes);
    setNote({ title: '', description: '', date: ''});
  };

  const deleteNote = async (index) => {
    const newNotes = [...notes];
    newNotes.splice(index, 1);
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    setNotes(newNotes);
  };

  const loadNotes = async () => {
    const storedNotes = await AsyncStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  };

  const deleteNoteAlert = (index) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => deleteNote(index),
        },
      ],
      { cancelable: false },
    );
  };

  const renderDeleteButton = (index) => {
    return (
      <TouchableOpacity onPress={() => deleteNoteAlert(index)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.noteContainer} key={index}>
      <View style={styles.noteInfos}>
        <Text style={styles.noteDate}>{item.date}</Text> 
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
      {renderDeleteButton(index)}
    </View>
  );

  return (
    <View style={styles.container}>
      <GradientText text={'NiN'} style={styles.appTitle} gradientColors={['#ff7e5f', '#172892']}></GradientText>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={note.title}
          onChangeText={(text) => setNote({ ...note, title: text })}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          multiline={true}
          numberOfLines={4}
          value={note.description}
          onChangeText={(text) => setNote({ ...note, description: text })}
        />
        <Button
          style={styles.saveButton}
          title="Save"
          onPress={saveNote}
        />
      </View>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.noteList}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>No notes found</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: '80%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 10,
    overflow: 'scroll'
  },

  form: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20%',
    marginBottom: '10%'
  },

  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    width: '100%',
  },

  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },

  noteList: {
    paddingBottom: 20,
    alignItems: 'center'
  },

  noteContainer: {
    backgroundColor: 'whitesmoke',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%'
  },


  noteInfos: {
    width: '70%',
  },

  noteTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },

  noteDate: {
    marginBottom: 3,
    color: 'gray',
  },

  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },

  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
  },

  appTitle:
  {
    fontFamily: 'Autography',
    fontSize: 40,
  }
  
});