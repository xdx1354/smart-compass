import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'
import React, { useState } from 'react';
import BluetoothScreen from './components/Bluetooth/BluetoothScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FilesScreen from './components/Files/FilesScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather, Octicons } from '@expo/vector-icons';
import MapScreen from './components/Map/MapScreen';
import { BLEProvider } from './components/BLEProvider';


const Tab = createBottomTabNavigator();

function BottomTabNavg() {
  return(

    <Tab.Navigator
    initialRouteName='BluetoothScreen'
    screenOptions={{
      tabBarActiveTintColor: '#6200EE',
      tabBarInactiveTintColor: 'white',
      tabBarStyle: {
        backgroundColor: '#383838', // Change this to your desired color
      },
      headerShown: false
    }}
    >
      
      <Tab.Screen
        name="BluetoothScreen"
        component={BluetoothScreen}
        options={{
          tabBarLabel: 'BT',
          tabBarIcon: ({ color, size }) => (
            <Feather name="bluetooth" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="FilesScreen"
        component={FilesScreen}
        options={{
          tabBarLabel: 'Files',
          tabBarIcon: ({ color, size }) => (
            <Feather name="file" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" color={color} size={size} />
          ),
        }}
      />

    </Tab.Navigator>

  );
}


export default function App() {

  return(
    <BLEProvider>
      <NavigationContainer>
        <BottomTabNavg/>
        <StatusBar style="auto" />
      </NavigationContainer>
    </BLEProvider>
  )
}

const styles = StyleSheet.create({

  // container: {
  //   flex: 1,
  //   backgroundColor: '#2D2D2D',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  // },

  // headerBox: {
  //   // flex: 1,
  //   flexDirection: 'row',
  //   backgroundColor:'#2D2D2D',
  //   width:'100%',
  //   height: 110,
  //   paddingTop: 20,
  //   paddingLeft: 10,
  //   paddingBottom: 10,
  //   paddingRight: 10,
  //   borderBottomLeftRadius: 20,
  //   borderBottomRightRadius: 20,
  // },

  // headerLeftInnerBox: {
  //   flex: 1,
  //   flexDirection: 'column',
  //   height: 110,
  //   marginLeft:12,
  //   marginTop:5,
  //   marginBottom: 5,
  // },

  // headerText: {
  //   fontFamily: 'RobotoBlack',
  //   fontSize: 32,
  // },

  // headerConnected: {
  //   fontFamily: 'RobotoBlack',
  //   fontSize: 24,
  //   color: '#018786', // Kolor dla "connected"
  // },

  // headerDisconnected: {
  //   fontFamily: 'RobotoBlack',
  //   fontSize: 24,
  //   color: '#B00020', // Kolor dla "disconnected"
  // },

  headerRightInnerBox: {
    marginTop:10,
    width: 110,
  },

  headerImage: {
    height: 70,
    resizeMode: 'contain',
  },

  mainBox: {
    flexDirection: 'column',
    height: 640,
    width: 350,
    borderRadius: 20,
    backgroundColor: '#EEF5DB',
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  mainBoxSmallText: {
    fontFamily:'RobotoMedium',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },

  mainBoxBigText: {
    fontFamily:'RobotoMedium',
    fontSize: 24,
    marginBottom: 20,

  },

  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#729294',
    height: 72,
    // paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    zIndex: 1, 
  },

  navBarButton: {
    flex: 1,
    width: '33%', 
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2,
  },
  navBarImage: {
    height: 36,
    width: '33%',
    resizeMode: 'contain',
  },

});
