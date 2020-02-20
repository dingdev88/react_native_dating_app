import React from 'react';
import { Image, TouchableOpacity,View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';


import Auth from '../auth/Auth';
import Login from '../auth/Login';
import Register from '../auth/Register';

import { colors, fonts } from '../../styles';
import MainTabNavigator from './MainTabNavigator';
import GalleryEdit from '../profile/GalleryEdit';
import UploadPhoto from '../profile/UploadPhoto';
import ProfileEdit from '../profile/ProfileEdit';
import TextInputView from '../profile/components/TextInputView';
import MultipleItemPickerView from '../profile/components/MultipleItemPickerView';
import Settings from '../profile/Settings';
import ChangeEmail from '../profile/ChangeEmail';
import ChangePassword from '../profile/ChangePassword';
import UserFilter from '../home/UserFilter';
import PublicProfile from '../profile/PublicProfile';
import BlockingList from '../profile/BlockingList';
import LockCode from '../lock-code/LockCode';
import DeactivateAccount from '../profile/DeactivateAccount';
import ReactivateAccount from '../profile/ReactivateAccount';
import Terms from '../term/Terms';
import Messages from '../chat/Messages';

const stackNavigator = createStackNavigator(
  {    
    Main: {
      screen: MainTabNavigator,
      navigationOptions: {
        header: null,
      },
    },
    Messages: {
      screen: Messages,
      navigationOptions: {
        header: null
      },
    },
    LockVerify: {
      screen: LockCode,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      },
    },
    
    ReactivateAccount: {
      screen: ReactivateAccount,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      },
    },
    DeactivateAccount: {
      screen: DeactivateAccount,
      navigationOptions: {
        title: 'Deactivate Account'
      },
    },
    LockCode: {
      screen: LockCode,
      navigationOptions: {
        title: 'Lock Code'
      },
    },
    
    BlockingList: {
      screen: BlockingList,
      navigationOptions: {
        title: 'Blocking List',
      },
    },
    UserFilter: {
      screen: UserFilter,
      navigationOptions: {
        header: null
      }
    },
    ChangeEmail: {
      screen: ChangeEmail,
      navigationOptions: {
        title: 'Change Email',
      },
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {
        title: 'Change Password',
      },
    },
    MultipleItemPickerView: {
      screen: MultipleItemPickerView,
      navigationOptions: ({navigation}) => ({
        title: navigation.state.params.title || "Display"
      })
    },
    TextInputView: {
      screen: TextInputView,
      navigationOptions: ({navigation}) => ({
        title: navigation.state.params.title || "Display"
      })
    },
    ProfileEdit: {
      screen: ProfileEdit,
      navigationOptions: {
        title: 'Edit Profile',
        header: null,
      }
    },
    PublicProfile: {
      screen: PublicProfile,
      navigationOptions: {
        header: null
      }
    },
    GalleryEdit: {
      screen: GalleryEdit,
      navigationOptions: {
        header: null,
      },
    },
    UploadPhoto: {
      screen: UploadPhoto,
      navigationOptions: {
        title: 'Upload',
      },
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        title: 'Settings'
      }
    },
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
    Terms: {
      screen: Terms,
      navigationOptions: ({navigation}) => ({
        title: navigation.state.params.title || "Terms Of Service"
      })
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
        color: colors.white,
        fontFamily: fonts.primaryRegular,
        fontSize: 24
      },
      headerTintColor: '#222222',
      headerLeft: props => (
        <TouchableOpacity
          onPress={props.onPress}
          style={{
            paddingLeft: 8,
            width: 40,
            height: 40,
            justifyContent:'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('../../../assets/images/icons/arrow-back.png')}
            resizeMode="contain"
            style={{
              height: 30,
            }}
          />
        </TouchableOpacity>
      ),
    }),
  },
);

export default createAppContainer(stackNavigator);
