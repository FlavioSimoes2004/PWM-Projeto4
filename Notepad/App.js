import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const Stack = createStackNavigator();

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>NiN</Text>
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
        paddingTop: 100,
    },
    title: {
        fontSize: 60,
        fontFamily: 'Autography',
        color: '#333',
        textShadowColor: '#aaa',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
});
