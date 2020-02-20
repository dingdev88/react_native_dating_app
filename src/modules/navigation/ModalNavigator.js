import React from 'react';
import { Image, TouchableOpacity,View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import MainNavigator from './MainNavigator';
import PhotoModal from '../shared/PhotoModal';

const modalNavigator = createStackNavigator(
  {    
    Main: {
      screen: MainNavigator,
      navigationOptions: {
        header: null,
      },
    },
    PhotoModal:{
        screen: PhotoModal,
        navigationOptions: {
            header: null,
          },
    }
    
  },
  {
    mode: 'modal',
    transparentCard: true,

    transitionConfig : () => ({
      containerStyle: {
        backgroundColor: 'transparent',
      }
    }),
  },
);

export default createAppContainer(modalNavigator);
