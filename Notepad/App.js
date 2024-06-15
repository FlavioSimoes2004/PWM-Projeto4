import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NotesPage from './NotesPage';

const Stack = createStackNavigator();

export default function App() {

    const [folder, setFolder] = useState({ title: '', date: '' });
    const [folders, setFolders] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadFolders();
    }, []);

    useEffect(() => {
        initializeDefaultFolder();
    }, []);

    const [fontsLoaded] = useFonts({
        'Autography': require('./assets/fonts/Autography.otf'),
    });

    const initializeDefaultFolder = async () => {
        const storedFolders = await AsyncStorage.getItem('folders');
        if (storedFolders) {
            const parsedFolders = JSON.parse(storedFolders);
            if (!parsedFolders.some(folder => folder.title === 'Geral')) {
                const defaultFolder = { title: 'Geral', date: new Date().toDateString() };
                const newFolders = [defaultFolder, ...parsedFolders];
                await AsyncStorage.setItem('folders', JSON.stringify(newFolders));
                setFolders(newFolders);
            } else {
                setFolders(parsedFolders);
            }
        } else {
            const defaultFolder = { title: 'Geral', date: new Date().toDateString() };
            await AsyncStorage.setItem('folders', JSON.stringify([defaultFolder]));
            setFolders([defaultFolder]);
        }
    };

    const saveFolder = async () => {
        if (folder.title === '') {
            Alert.alert('Error', 'Please fill in the title.');
            return;
        }

        const cDate = new Date();
        folder.date = cDate.toDateString();

        let newFolders = [...folders];
        if (editIndex !== null) {
            newFolders[editIndex] = folder;
            setEditIndex(null);
        } else {
            newFolders = [...folders, folder];
        }

        await AsyncStorage.setItem('folders', JSON.stringify(newFolders));
        setFolders(newFolders);
        setFolder({ title: '', date: '' });
        setShowForm(false);
    };

    const deleteFolder = async (index) => {
        const newFolders = [...folders];
        newFolders.splice(index, 1);
        await AsyncStorage.setItem('folders', JSON.stringify(newFolders));
        setFolders(newFolders);
    };

    const loadFolders = async () => {
        const storedFolders = await AsyncStorage.getItem('folders');
        if (storedFolders) {
            setFolders(JSON.parse(storedFolders));
        }
    };

    const deleteFolderAlert = (index) => {
        Alert.alert(
            'Delete Folder',
            'Are you sure you want to delete this folder?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => deleteFolder(index),
                },
            ],
            { cancelable: false },
        );
    };

    const editFolder = (index) => {
        setFolder(folders[index]);
        setEditIndex(index);
        setShowForm(true);
    };

    const renderEditButton = (index) => {
        return (
            <TouchableOpacity onPress={() => editFolder(index)} style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
        );
    };

    const renderDeleteButton = (index) => {
        if (folders[index].title === 'Geral') return null;
        return (
            <TouchableOpacity onPress={() => deleteFolderAlert(index)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.folderContainer} key={index}>
            <TouchableOpacity
                style={styles.folder}
                onPress={() => navigation.navigate('Notes', { folder: item })}
            >
                <Text style={styles.folderText}>{item.title}</Text>
            </TouchableOpacity>
            <View style={styles.buttonsContainer}>
                {renderEditButton(index)}
                {renderDeleteButton(index)}
            </View>
        </View>
    );

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Folders" component={FoldersScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Notes" component={NotesPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

function FoldersScreen({ navigation }) {
    const [folder, setFolder] = useState({ title: '', date: '' });
    const [folders, setFolders] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadFolders();
    }, []);

    useEffect(() => {
        initializeDefaultFolder();
    }, []);

    const initializeDefaultFolder = async () => {
        const storedFolders = await AsyncStorage.getItem('folders');
        if (storedFolders) {
            const parsedFolders = JSON.parse(storedFolders);
            if (!parsedFolders.some(folder => folder.title === 'Geral')) {
                const defaultFolder = { title: 'Geral', date: new Date().toDateString() };
                const newFolders = [defaultFolder, ...parsedFolders];
                await AsyncStorage.setItem('folders', JSON.stringify(newFolders));
                setFolders(newFolders);
            } else {
                setFolders(parsedFolders);
            }
        } else {
            const defaultFolder = { title: 'Geral', date: new Date().toDateString() };
            await AsyncStorage.setItem('folders', JSON.stringify([defaultFolder]));
            setFolders([defaultFolder]);
        }
    };

    const saveFolder = async () => {
        if (folder.title === '') {
            Alert.alert('Error', 'Please fill in the title.');
            return;
        }

        const cDate = new Date();
        folder.date = cDate.toDateString();

        let newFolders = [...folders];
        if (editIndex !== null) {
            newFolders[editIndex] = folder;
            setEditIndex(null);
        } else {
            newFolders = [...folders, folder];
        }

        await AsyncStorage.setItem('folders', JSON.stringify(newFolders));
        setFolders(newFolders);
        setFolder({ title: '', date: '' });
        setShowForm(false);
    };

    const deleteFolder = async (index) => {
        const newFolders = [...folders];
        newFolders.splice(index, 1);
        await AsyncStorage.setItem('folders', JSON.stringify(newFolders));
        setFolders(newFolders);
    };

    const loadFolders = async () => {
        const storedFolders = await AsyncStorage.getItem('folders');
        if (storedFolders) {
            setFolders(JSON.parse(storedFolders));
        }
    };

    const deleteFolderAlert = (index) => {
        Alert.alert(
            'Delete Folder',
            'Are you sure you want to delete this folder?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => deleteFolder(index),
                },
            ],
            { cancelable: false },
        );
    };

    const editFolder = (index) => {
        setFolder(folders[index]);
        setEditIndex(index);
        setShowForm(true);
    };

    const renderEditButton = (index) => {
        return (
            <TouchableOpacity onPress={() => editFolder(index)} style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
        );
    };

    const renderDeleteButton = (index) => {
        if (folders[index].title === 'Geral') return null;
        return (
            <TouchableOpacity onPress={() => deleteFolderAlert(index)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.folderContainer} key={index}>
            <TouchableOpacity
                style={styles.folder}
                onPress={() => navigation.navigate('Notes', { folder: item })}
            >
                <Text style={styles.folderText}>{item.title}</Text>
            </TouchableOpacity>
            <View style={styles.buttonsContainer}>
                {renderEditButton(index)}
                {renderDeleteButton(index)}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.appTitle}>NiN</Text>
            <Text style={styles.sectionTitle}>Folders</Text>
            <View style={styles.separator} />
            <FlatList
                data={folders}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.folderList}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyListText}>No folders found</Text>
                )}
            />
            <TouchableOpacity
                onPress={() => {
                    setFolder({ title: '', date: '' });
                    setEditIndex(null);
                    setShowForm(true);
                }}
                style={styles.addButton}
            >
                <Text style={styles.buttonText}>Add New Folder</Text>
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
                            value={folder.title}
                            onChangeText={(text) => setFolder({ ...folder, title: text })}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={saveFolder} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowForm(false)} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
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
    appTitle: {
        fontSize: 60,
        fontFamily: 'Autography',
        color: '#333',
        textShadowColor: '#aaa',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
        marginBottom: 50,
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
    form: {
        width: '90%',
        marginBottom: 20,
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
    saveButton: {
        marginTop: 10,
    },
    folderList: {
        paddingBottom: 20,
        alignItems: 'center'
    },
    folderContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    folder: {
        width: 250,
        height: 80,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        marginBottom: 2,
    },
    folderText: {
        fontSize: 18,
        color: '#333',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 245,
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
        backgroundColor: 'rgba(0,0,0,0.5)',
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
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
