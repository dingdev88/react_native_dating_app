/* eslint-disable import/no-unresolved */
import React from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { getBottomSpace } from 'react-native-iphone-x-helper';

import { colors, fonts } from '../../styles';

import Profile from '../profile/Profile';
import Home from '../home/Home';
import Chat from '../chat/Chat';

const iconProfile = require('../../../assets/images/tab_profile.png');
const iconHome = require('../../../assets/images/tab_bone.png');
const iconChat = require('../../../assets/images/tab_chat.png');

const styles = StyleSheet.create({
  tabBarItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  tabBarIcon: {
    width: 23,
    height: 23,
  },
  tabBarIconFocused: {
    tintColor: 'red',
  },
  headerContainer: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
  },
  headerCaption: {
    fontFamily: fonts.primaryRegular,
    color: colors.white,
    fontSize: 18,
  },
});

export default createMaterialTopTabNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: {
        header: null,
      },
    },
    Home: {
      screen: Home,
      navigationOptions: {
        header: null,
      },
    },
    Chat: {
      screen: Chat,
      navigationOptions: {
        title: 'Chats'
      },
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      // eslint-disable-next-line react/prop-types
      tabBarVisible: navigation.state.routeName != 'Profile' ,
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconSource;
        switch (routeName) {
          case 'Home':
            iconSource = iconHome;
            break;
          case 'Chat':
            iconSource = iconChat;
            break;
          case 'Profile':
            iconSource = iconProfile;
            break;
          default:
            iconHome = iconHome;
        }
        return (
          <View style={styles.tabBarItemContainer}>
            <Image
              resizeMode="contain"
              source={iconSource}
              style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]}
            />
          </View>
        );
      },
    }),
    initialRouteName:'Home',
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      style: {
        backgroundColor: 'black',
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(255,255,255,0.3)',
        paddingBottom: getBottomSpace()
      },
      labelStyle: {
        color: 'white',
      },
      activeTintColor:'red',
      indicatorStyle: {
        backgroundColor: 'transparent',
    },
    },
  },
);

