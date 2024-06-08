import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Button, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [note, setNote] = useState({ title: '', description: '' });
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const saveNote = async () => {
    const newNotes = [...notes, note];
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    setNotes(newNotes);
    setNote({ title: '', description: '' });
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
        <Text style={styles.deleteButton} onPress={deleteNote}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.noteContainer}>
      <View>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
      {renderDeleteButton(index)}
    </View>
  );

  return (
    <View style={styles.container}>
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
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 10,
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
    maxWidth: '90%',
  },

  noteTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
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
});