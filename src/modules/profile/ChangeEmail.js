import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Image,
  TextInput
} from 'react-native';

import { connect } from 'react-redux'; 
import { fonts, colors } from '../../styles';
import { Button, BackgroundView, IconizedTextInput, LoadingOverlay } from '../../components'; 
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { calculatePortraitDimension, showAlert, emailValidate } from '../../helpers'
import { updateEmail } from '../../actions/AuthActions';

const { width: deviceWidth, height: deviceHeight } = calculatePortraitDimension();

class ChangeEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value : props.navigation.getParam('value'),
        title: 'Change Email',
        inputType: 'textinput'
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.auth.error != nextProps.auth.error && nextProps.auth.error) {
      showAlert("Whoops", nextProps.auth.error);
    } 
    if(this.props.auth.success != nextProps.auth.success && nextProps.auth.success) {
      if( this.props.navigation.state.params.returnData)
        this.props.navigation.state.params.returnData(this.state.value);
        this.props.navigation.goBack();
    } 

  } 

  getHeaderView() {
      return <View style={{flexDirection:'column'}}>
        <Image style={{height: deviceWidth*4/6, width: deviceWidth}} 
               resizeMode='contain' 
               source={require('../../../assets/images/bonestock.jpg')} />
      </View>
  }

  getMiddleView() {
      const { value, inputType } = this.state;
      return <View style={{flexDirection:'column', margin: 16, flex:1, alignSelf:'stretch' }}>
            {
                inputType == 'textinput' && 
                    <IconizedTextInput
                    onChangeText={text => {
                    this.setState({ value : text})
                    }}
                    value={value}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType='email-address'
                    placeholder={'Enter Your Email'}
                    placeholderTextColor={colors.gray}
                    containerStyle={{marginTop: 0, backgroundColor:'white'}}
                    textStyle={{color:'black'}}
                />
            }
            {
                inputType == 'textarea' && 
                <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={10}
                    underlineColorAndroid='transparent'
                    placeholderTextColor={colors.gray}
                    placeholder={this.state.title}
                    onChangeText={(text) => {
                    this.setState({ bio: text });
                    }}
                />
                
            }
         
      </View>
  }

  getBottomView = () =>  {
    return <View style={{height: 64, alignItems: 'center', alignSelf: 'stretch', paddingHorizontal: 30}}>
        <Button
            style={{ alignSelf: 'stretch', marginBottom: 32, marignLeft :0, marginRight:0 }}
            caption={'CONFIRM'}
            bgColor={'white'}
            textColor={'black'}
            caption={'CONFIRM'}
            onPress={() => {
                this.onChangeEmail(this.state.value, this.props.auth.user.id)
            }}
        />
      </View>
  }

  onChangeEmail = (email, userId) => {
    if (!emailValidate(email)) {
        showAlert('Whoops','Invalid email address.')
        return;
      }
    this.props.dispatch(updateEmail(userId, email));
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

export default connect(mapStateToProps)(ChangeEmail);