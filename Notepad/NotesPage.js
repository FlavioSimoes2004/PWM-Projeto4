import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotesPage({ route }) {
    const { folder } = route.params;
    const [note, setNote] = useState({ title: '', content: '', date: '' });
    const [notes, setNotes] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);

    useEffect(() => {
        loadNotes();
    }, []);

    const saveNote = async () => {
        if (note.title === '') {
            Alert.alert('Error', 'Please fill in the title.');
            return;
        }

        const cDate = new Date();
        note.date = cDate.toDateString();

        let newNotes = [...notes];
        if (editIndex !== null) {
            newNotes[editIndex] = note;
            setEditIndex(null);
        } else {
            newNotes = [...notes, note];
        }

        await AsyncStorage.setItem(`${folder.title}_notes`, JSON.stringify(newNotes));
        setNotes(newNotes);
        setNote({ title: '', content: '', date: '' });
        setShowForm(false);
    };

    const deleteNote = async (index) => {
        const newNotes = [...notes];
        newNotes.splice(index, 1);
        await AsyncStorage.setItem(`${folder.title}_notes`, JSON.stringify(newNotes));
        setNotes(newNotes);
    };

    const loadNotes = async () => {
        const storedNotes = await AsyncStorage.getItem(`${folder.title}_notes`);
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
        setShowForm(true);
    };

    const openNoteModal = (note) => {
        setCurrentNote(note);
        setShowNoteModal(true);
    };

    const renderEditButton = (index) => {
        return (
            <TouchableOpacity onPress={() => editNote(index)} style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
        );
    };

    const renderDeleteButton = (index) => {
        return (
            <TouchableOpacity onPress={() => deleteNoteAlert(index)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.noteContainer} key={index}>
            <TouchableOpacity style={styles.note} onPress={() => openNoteModal(item)}>
                <Text style={styles.noteText}>{item.title}</Text>
                <Text numberOfLines={2} ellipsizeMode="tail">
                    {item.content}
                </Text>
            </TouchableOpacity>
            <View style={styles.buttonsContainer}>
                {renderEditButton(index)}
                {renderDeleteButton(index)}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{folder.title} Notes</Text>
            <View style={styles.separator} />
            <FlatList
                data={notes}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.noteList}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyListText}>No notes found</Text>
                )}
            />
            <TouchableOpacity
                onPress={() => {
                    setNote({ title: '', content: '', date: '' });
                    setEditIndex(null);
                    setShowForm(true);
                }}
                style={styles.addButton}
            >
                <Text style={styles.buttonText}>Add New Note</Text>
            </TouchableOpacity>
            <Modal
                visible={showForm}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={note.title}
                            onChangeText={(text) => setNote({ ...note, title: text })}
                        />
                        <TextInput
                            style={[styles.input, styles.contentInput]}
                            placeholder="Content"
                            multiline={true}
                            numberOfLines={4}
                            value={note.content}
                            onChangeText={(text) => setNote({ ...note, content: text })}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={saveNote} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowForm(false)} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={showNoteModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{currentNote?.title}</Text>
                        <Text>{currentNote?.content}</Text>
                        <TouchableOpacity onPress={() => setShowNoteModal(false)} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingTop: 40,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    separator: {
        width: '90%',
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 20,
    },
    noteList: {
        paddingBottom: 20,
        alignItems: 'center'
    },
    noteContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    note: {
        width: 250,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        padding: 10,
        marginBottom: 2,
    },
    noteText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 250,
    },
    editButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
        width: '49%',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
        width: '49%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
    },
    addButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        width: 150,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        width: '100%',
    },
    contentInput: {
        height: 80,
    },
});
