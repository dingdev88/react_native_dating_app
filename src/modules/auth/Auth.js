import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import { fonts, colors } from '../../styles';
import { Button, BackgroundView } from '../../components'; 
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';


export default class Auth extends React.Component {

  componentDidMount() {
  }

  render() {
    return (
      <View style={styles.background}>
        <BackgroundView/>
        
        <View style={styles.container}>
            <Button
                primary
                bordered
                style={{ alignSelf: 'stretch', marginBottom: 16 }}
                caption={'Login'}
                bgColor={colors.black}
                onPress={() => {this.props.navigation.navigate('Login')}}
            />
            <Button
                secondary
                bordered
                bgColor={colors.black}
                style={{ alignSelf: 'stretch', marginBottom: 32 }}
                caption={'Sign up'}
                onPress={() => {{this.props.navigation.navigate('Register')}}}
            />

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
    marginTop: Platform.OS === 'ios' ? getStatusBarHeight(true) : 0,
    marginBottom: getBottomSpace(),
  },
  background: {
    flex: 1,

  }
});
