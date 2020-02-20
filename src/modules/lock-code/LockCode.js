import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
} from 'react-native';

import { connect } from 'react-redux';
import { fonts, colors } from '../../styles';
import { Button } from '../../components';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import LockNumberPad from './components/LockNumberPad';
import { enableLock, disableLock } from '../../actions/LockCodeActions';

class LockCode extends React.Component {
    constructor(props) {
      super(props);
      this.state= {
        mode: props.navigation.getParam('mode'), // capture : verify : reset
        capturedLockCode: ''
      }
    }
    
    render(){
        const { lockCode,locked } = this.props.lockCode
        return (<View style={styles.container}>
           <Text style={styles.title}>{locked ? 'Enter Password' : 'New Password'} </Text>
           <LockNumberPad
              lockCodeLength={6}
              onCaptured={(lockCode) => {
                this.setState({capturedLockCode: lockCode})
              }}
              onVerified ={ (lockCode) => {
                  this.props.navigation.goBack();
                  if(this.state.mode == 'reset') {
                    this.props.dispatch(disableLock());
                  }
              }}
              onReset = {()=> {
                this.setState({capturedLockCode: ''})
              }}
              mode={this.state.mode == 'capture'? 'capture' : 'verify'}
              verifyCode={lockCode}
           />
           <View style={{flex:1}}/>
           {
             this.state.capturedLockCode.length == 6 &&
             <Button
              secondary
              style={{ alignSelf: 'stretch', marginBottom: 32, marginTop:16, marignLeft :0, marginRight:0 }}
              caption={'SET PASSWORD'}
              textColor={'white'}
              bgColor={colors.red}
              onPress={() => {
                  this.props.navigation.goBack();
                  this.props.dispatch(enableLock(this.state.capturedLockCode));
              }}
            />
           }

        </View>);
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'black',
      marginBottom: getBottomSpace()
    },
    title: {
      fontSize: 32,
      fontWeight: '200',
      color: 'white',
      marginTop: 32
    }
  });
  const mapStateToProps = (state) => ({ lockCode: state.lockCode });

export default connect(mapStateToProps)(LockCode);