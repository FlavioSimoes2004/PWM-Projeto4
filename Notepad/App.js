import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const Stack = createStackNavigator();

const Folder = ({ name, onPress }) => {
    return (
        <TouchableOpacity style={styles.folder} onPress={onPress}>
            <Text style={styles.folderText}>{name}</Text>
        </TouchableOpacity>
    );
};

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>NiN</Text>
            <ScrollView contentContainerStyle={styles.foldersContainer}>
                <Folder name="Geral" onPress={() => { }} />
                <Folder name="Geral" onPress={() => { }} />
                <Folder name="Geral" onPress={() => { }} />

            </ScrollView>
        </View>
    );
};

export default function App() {
    const [fontsLoaded] = useFonts({
        'Autography': require('./assets/fonts/Autography.otf'),
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingTop: 65,
    },
    title: {
        fontSize: 60,
        fontFamily: 'Autography',
        color: '#333',
        textShadowColor: '#aaa',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
        marginBottom: 20,
    },
    foldersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 20,
    },
    folder: {
        width: 250,
        height: 75,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    folderText: {
        fontSize: 18,
        color: '#333',
    },
});