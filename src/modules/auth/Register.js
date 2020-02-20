import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity
} from 'react-native';

import { fonts, colors } from '../../styles';
import { Button, BackgroundView, IconizedTextInput, LoadingOverlay } from '../../components'; 
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { calculatePortraitDimension, showToast, emailValidate, passwordValidate, sha256Hash } from '../../helpers'

import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';

import { signup } from '../../actions/AuthActions';

import CheckBox from 'react-native-check-box';

const { width: deviceWidth, height: deviceHeight } = calculatePortraitDimension();

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      privacyCheck: false,
      seePassword: false
    }
  }
  componentDidMount() {
  }

  registerAction = () => {
    const {email, password, privacyCheck} = this.state;
    const { dispatch } = this.props;
    if (!emailValidate(email)) {
      showToast('Invalid email address.')
      return;
    }

    if (!privacyCheck) {
      showToast('You must agree to the terms of use!')
      return;
    }

    sha256Hash(password, ( hashedPassword)=>{
      let credential = {
        email: email,
        password: hashedPassword,
        firebaseToken : ''
      }
      dispatch(signup(credential));
    })
  }

  gotoPrivacyPolicyPage(){
    console.log("privacy and policy");
    this.props.navigation.navigate('Terms');
  }

  getBackButton() {
      return <View style={{position:'absolute', width: 32, height:32, left: 16, alignItems:'center', justifyContent:'center', top: Platform.OS === 'ios' ? getStatusBarHeight(true) + 16 : 16}}>
        <TouchableOpacity onPress={()=>{
            this.props.navigation.goBack();
        }} >
          <Icon name="chevron-left" size={30} color="white" solid />
        </TouchableOpacity>
      </View>
  }

  getHeaderView() {
    return <View style={{flexDirection:'column'}}>
      <ImageBackground 
        style={{height: deviceWidth*4/6, width: deviceWidth}} 
        resizeMode='contain' source={require('../../../assets/images/bonestock.jpg')} 
        >
        <View style={{'position':'absolute', left:0, top:0, right:0, bottom: 0, backgroundColor:'rgba(75,75,75, 0.6)' }}/>
        {this.getBackButton()}
      </ImageBackground>
      <View style={{ justifyContent: 'center', alignItems: 'center', height: 120, alignSelf:'stretch'}}>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize: 32, color:'rgba(255,255,255,0.6)', marginTop:3 }}>{"Let's"}</Text>
            <Text style={{fontSize: 36, fontWeight:'bold', color:'white'}}> {"BONE"}</Text>
          </View>
      </View>
    </View>
  }

  getMiddleView() {
      const { email, password, seePassword } = this.state;
      return <View style={{flexDirection:'column', margin: 16, alignItems:'center'}}>
            <IconizedTextInput
              placeholder="Email"
              ref={(instance) => {
                this.emailTxt = instance;
              }}
              onSubmitEditing={() => {
                this.passwordTxt.focus();
              }}
              onChangeText={text => {
                this.setState({ email : text})
              }}
              keyboardType='email-address'
              value={email}
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={{marginTop: 0}}
              keyboardType='email-address'
              returnKeyType='next'
            />
            <IconizedTextInput
              placeholder="Password"
              ref={(instance) => {
                this.passwordTxt = instance;
              }}
              onChangeText={text => {
                this.setState({ password : text})
              }}
              onSubmitEditing={() => {

              }}
              seePassword={(visible) => {
                this.setState({seePassword: visible})
              }}
              seePasswordEyeIcon={<Icon name="eye" size={24} color="white" light />}
              seePasswordEyeSlashIcon={<Icon name="eye-slash" size={24} color="white" light />}
              value={password}
              secureTextEntry={!seePassword}
              textContentType='password'
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={{marginTop: 16}}
              returnKeyType='next'
            />

      </View>
  }

  getBottomView = () =>  {
    return <View style={{alignItems:'center', margin:16, marginBottom: 64, height: 64, alignSelf:'stretch'}}>
        <Button
            primary
            bordered
            style={{ alignSelf: 'stretch' }}
            caption={'GET IN'}
            onPress={() => {this.registerAction()}}
        />
        <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center', marginTop: 16}}>
          <CheckBox
              style={{width:30}}
                  onClick={()=>{
                  this.setState({
                    privacyCheck:!this.state.privacyCheck
                  })
              }}
              checkBoxColor={'white'}
              isChecked={this.state.privacyCheck}
              color={{color: 'white'}}
          />
        <TouchableOpacity 
          onPress={()=>{
            this.gotoPrivacyPolicyPage()
          }}>
         <Text style={{color: colors.red}}>{"You agreed to bone's terms of use"}</Text>
        </TouchableOpacity>
        </View>
      </View>
  }
  render() {
    const { auth } = this.props; 
    return (
      <View style={styles.background}>
        <LoadingOverlay visible={auth.isLoading}/>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='always'>
          <View style={styles.container}>
            <View style={{flex:1}}>
              {this.getHeaderView()}
              {this.getMiddleView()}
            </View>
            {this.getBottomView()}
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
  }
});

const mapStateToProps = (state) => ({ app: state.app, auth: state.auth });

export default connect(mapStateToProps)(Register);