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

import { forgotPassword } from '../../actions/AuthActions';

const { width: deviceWidth, height: deviceHeight } = calculatePortraitDimension();

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
/*      email: 'dingtester@mail.com',
      password: 'aa',*/
      seePassword: false
    }
  }

  componentDidMount() {
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.auth.error !== nextProps.auth.error && nextProps.auth.error) {
      //forgot password faild
      showToast("Invalid email.", "short")
    } else if (this.props.auth.success !== nextProps.auth.success && nextProps.auth.success) {
      //forgot success
      this.setState({email: ''});
      showToast("Email is sent successfully.", "short")
    }
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
      </View>
  }

  getMiddleView() {
      const { email, password, seePassword } = this.state;
      console.log('email:', email);
      return <View style={{flexDirection:'column', margin: 16, alignItems:'center'}}>
            <IconizedTextInput
              placeholder="Email"
              ref={(instance) => {
                this.emailTxt = instance;
              }}
              onChangeText={text => {
                this.setState({ email : text})
              }}
              value={email}
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={{marginTop: 0}}
              returnKeyType='next'
              keyboardType='email-address'
            />
         
      </View>
  }

  getBottomView = () =>  {
    return <View style={{height: 64, marginBottom:48, alignItems: 'center', alignSelf: 'stretch', paddingHorizontal: 30}}>
        <Button
            primary
            style={{ alignSelf: 'stretch', marignLeft :0, marginRight:0 }}
            caption={'Submit'}
            onPress={() => {
              this.onSubmit();
            }}
        />
      </View>
  }

  onSubmit = () => {
    const {email, password} = this.state;
    const { dispatch } = this.props;
    if (!emailValidate(email)) {
      showToast('Invalid email address.', 'short')
      return;
    }
    dispatch(forgotPassword(email));
  
  }
  
  render() {

    const { auth } = this.props; 
    return (
      <View style={styles.background}>
        <LoadingOverlay visible={auth.isLoading}/>
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
  forgot: {
    fontSize : 14,
    color: colors.red,
    marginTop: 8,
    fontWeight: "400"
  }
});

const mapStateToProps = (state) => ({ app: state.app, auth: state.auth });

export default connect(mapStateToProps)(ForgotPassword);