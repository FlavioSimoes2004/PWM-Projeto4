import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Button, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import GradientText from './components/GradientText'
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowAlert: true,
    })
})

export default function App() {

    const [note, setNote] = useState({ title: '', description: '', date: '', reminder: new Date() });
    const [notes, setNotes] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [selectDate, setSelectDate] = useState(new Date());
    const [selectTime, setSelectTime] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);


    useEffect(() => {
        loadNotes();
    }, []);

    /*const [fontsLoaded] = useFonts({
      'Autography': require('./assets/fonts/Autography.otf'),
    });*/

    const saveNote = async () => {
        if (note.title === '' || note.description === '') {
            Alert.alert('Error', 'Please fill in both the title and description.');
            return;
        }

        note.reminder.setUTCFullYear(selectDate.getUTCFullYear(), selectDate.getUTCMonth(), selectDate.getDate());
        note.reminder.setUTCMinutes(selectTime.getMinutes());
        note.reminder.setUTCHours(selectTime.getHours() + 3);
        note.reminder.setUTCSeconds(0);
        Alert.alert(note.reminder.toString());

        const cDate = new Date();
        note.date = cDate.toDateString();

        let newNotes = [...notes];
        if (editIndex !== null) {
            newNotes[editIndex] = note;
            setEditIndex(null);
        } else {
            newNotes = [...notes, note];
        }

        await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
        setNotes(newNotes);
        setNote({ title: '', description: '', date: '', reminder: note.reminder });
        await handleReminder();
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

    const editNote = (index) => {
        setNote(notes[index]);
        setEditIndex(index);
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDateConfirm = (date) => {
        console.warn(date);
        setSelectDate(date);
        hideDatePicker();
    };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (date) => {
        console.warn(date);
        setSelectTime(date);
        hideTimePicker();
    };

    async function handleReminder() {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
            alert('If you want a notification, please set the permision on first');
            return;
        }
        await Notifications.scheduleNotificationAsync({
            content: {
                title: note.title,
                body: note.description,
            },
            trigger: {
                date: note.reminder,
            }
        })
    }

    const renderEditButton = (index) => {
        return (
            <TouchableOpacity onPress={() => editNote(index)}>
                <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
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
            <View style={styles.buttonContainer}>
                {renderEditButton(index)}
                {renderDeleteButton(index)}
            </View>
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

                <Text>Reminder(Optional)</Text>
                <Button title="Select Date" style={styles.button} onPress={showDatePicker} />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={hideDatePicker}
                />
                <Button title="Select Time" style={styles.button} onPress={showTimePicker} />
                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={handleTimeConfirm}
                    onCancel={hideTimePicker}
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
        height: '95%',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 30,
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
        marginBottom: '5%'
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
        marginTop: 1,
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

    editButton: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 10,
    },

    buttonContainer: {
        flexDirection: 'row',
    },

    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
    },

    appTitle:
    {
        fontFamily: 'Autography',
        fontSize: 40,
    },

    button:
    {
        fontSize: 1,
    }

});