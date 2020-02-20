import React from 'react';
import { Image, TouchableOpacity,View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';


import Auth from '../auth/Auth';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Terms from '../term/Terms';
import ForgotPassword from '../auth/ForgotPassword';

import { colors, fonts } from '../../styles';

const stackNavigator = createStackNavigator(
  {
    Auth: {
      screen: Auth,
      navigationOptions: {
        header: null,
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        header: null,
      },
    },
    Register: {
      screen: Register,
      navigationOptions: {
        header: null,
      },
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {
        header: null,
      },
    },
    Terms: {
      screen: Terms,
      navigationOptions: {
        title: 'Terms of Service'
      }
    }
  },
  {
    defaultNavigationOptions: () => ({
      titleStyle: {
        fontFamily: fonts.primaryLight,
      },
      headerStyle: {
        backgroundColor: colors.primary,
        borderBottomWidth: 0,
      },
      headerBackground: (
        <View
          style={{ flex: 1, backgroundColor: 'black' }}
        />
      ),
      headerTitleStyle: {
        color: 'white',
        fontFamily: fonts.primaryRegular,
        fontSize: 24
      },
      headerTintColor: 'white',
      headerLeft: props => (
        <TouchableOpacity
          onPress={props.onPress}
          style={{
            paddingLeft: 25,
          }}
        >
          <Image
            source={require('../../../assets/images/icons/arrow-back.png')}
            resizeMode="contain"
            style={{
              height: 20,
            }}
          />
        </TouchableOpacity>
      ),
    }),
  },
);

export default createAppContainer(stackNavigator);
