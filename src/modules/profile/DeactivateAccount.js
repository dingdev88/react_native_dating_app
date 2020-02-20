import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Image,
  TextInput,
  Text
} from 'react-native';

import { connect } from 'react-redux'; 
import { fonts, colors } from '../../styles';
import { Button, BackgroundView, IconizedTextInput, LoadingOverlay } from '../../components'; 
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { calculatePortraitDimension, showAlert, emailValidate, sha256Hash } from '../../helpers'
import { deactivateAccount } from '../../actions/AuthActions';
import * as ACTION_TYPES from '../../actions/ActionTypes';

const { width: deviceWidth, height: deviceHeight } = calculatePortraitDimension();

class DeactivateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        title: 'Deactivate Account',
        password : ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.auth.error != nextProps.auth.error && nextProps.auth.error) {
      showAlert("Whoops", nextProps.auth.error);
    } 
    if(this.props.auth.success != nextProps.auth.success && 
            nextProps.auth.success && 
            nextProps.auth.currentAction == ACTION_TYPES.DEACTIVATE_ACCOUNT_SUCCESS) {
          this.props.navigation.navigate("ReactivateAccount");
    } 

  } 

  getHeaderView() {
      return <View style={{flexDirection:'column'}}>
        <Image style={{height: deviceWidth*4/6, width: deviceWidth}} 
               resizeMode='contain' 
               source={require('../../../assets/images/bonestock.jpg')} />
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 50, alignSelf:'stretch', marginTop: 32}}>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize: 24, color:'rgba(255,255,255,0.6)', marginTop:3 }}>{"COME BACK SOON!"}</Text>
            </View>
        </View>
      </View>
  }

  getMiddleView() {
      const { password, inputType } = this.state;
      return <View style={{flexDirection:'column', margin: 16, flex:1, alignSelf:'stretch' }}>
                 <IconizedTextInput
                    onChangeText={text => {
                    this.setState({ password : text})
                    }}
                    value={password}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    placeholder={'Enter Your Password'}
                    placeholderTextColor={colors.gray}
                    containerStyle={{marginTop: 0, backgroundColor:'white'}}
                    textStyle={{color:'black'}}
                />
            
         
      </View>
  }

  getBottomView = () =>  {
    return <View style={{height: 82, alignItems: 'center', alignSelf: 'stretch', paddingHorizontal: 30, marginBottom:32}}>
        <Text style={{fontSize: 14, color: colors.red, marginBottom: 16}}>Click on CONFIRM to deactivate your account.</Text>
             
        <Button
            style={{ alignSelf: 'stretch', marginBottom: 32, marignLeft :0, marginRight:0 }}
            caption={'CONFIRM'}
            bgColor={'white'}
            textColor={'black'}
            caption={'CONFIRM'}
            onPress={() => {
                this.onDeactivateAccount(this.state.password, this.props.auth.user.id)
            }}
        />
      </View>
  }

  onDeactivateAccount = (password, userId) => {
    if (password == '') {
        showAlert('Whoops','Please input password.')
        return;
      }
      sha256Hash(password, ( hashedPassword)=>{
        this.props.dispatch(deactivateAccount(userId, hashedPassword));
      })

  } 
  
  render() {


    return (
      <View style={styles.background}>
        <LoadingOverlay visible={this.props.auth.isLoading}/>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='always'>
          <View style={styles.container}>
            <View style={{flex:1, alignItems:'center'}}>
              {this.getHeaderView()}
              {this.getMiddleView()}
            </View>

             { this.getBottomView()}
  
          </View>
        </KeyboardAwareScrollView>
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom: getBottomSpace()
  },
  background: {
    flex: 1,
    backgroundColor: 'black'
  },
  
  text: {
    fontSize: 14,
    color: 'white'
  },

  textArea: {
    borderRadius: 4,
    padding: 8,
    borderColor: colors.lightGray,
    color: colors.black,
    backgroundColor: 'white',
    fontSize: 14,
    marginTop: 16,
    borderWidth: 1,
    minHeight: 120,
    flex:1,
    alignSelf:'stretch',
    marginBottom: 16
  }
});

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps)(DeactivateAccount);