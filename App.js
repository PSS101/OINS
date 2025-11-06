import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();
import React,{useState} from 'react';
import { StyleSheet, Text, View,TextInput, TouchableOpacity ,SafeAreaView } from 'react-native';
import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
export default function App() {
  return (
    <View style={styles.container}>
      <Text>OINS</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
