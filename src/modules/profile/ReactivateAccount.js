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
import { calculatePortraitDimension, showAlert, emailValidate } from '../../helpers'
import { reactivateAccount, logout } from '../../actions/AuthActions';

const { width: deviceWidth, height: deviceHeight } = calculatePortraitDimension();

class ReactivateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        password : ''
    }
  }

  componentWillReceiveProps(nextProps) {

  } 

  getHeaderView() {
      return <Image style={{height: deviceWidth*4/6, width: deviceWidth*4/6}} 
               resizeMode='contain' 
               source={require('../../../assets/images/brokenbone.png')} />
      
 
  }

  getBottomView = () =>  {
    return <View style={{height: 160, alignItems: 'center', alignSelf: 'stretch', paddingHorizontal: 30}}>
        <Text style={{fontSize: 14, color: colors.red, marginBottom: 16}}>Your Account has been currently deactivated</Text>
        <Button
            style={{ alignSelf: 'stretch', marginBottom: 16, marignLeft :0, marginRight:0 }}
            bgColor={'white'}
            textColor={'black'}
            caption={'ACTIVATE AGAIN'}
            onPress={() => {
                this.onReactivateAccount(this.props.auth.user.id)
                this.props.navigation.goBack();
            }}
        />
        <Button
            style={{ alignSelf: 'stretch', marginBottom: 32, marignLeft :0, marginRight:0 }}
            bgColor={colors.red}
            textColor={'white'}
            caption={'LOG OUT'}
            onPress={() => {
                this.props.dispatch(logout())
            }}
        />
      </View>
  }

  onReactivateAccount = (userId) => {
  
    this.props.dispatch(reactivateAccount(userId));
  } 
  
  render() {


    return (
      <View style={styles.background}>
        <LoadingOverlay visible={this.props.auth.isLoading}/>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='always'>
          <View style={styles.container}>
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
              {this.getHeaderView()}
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

export default connect(mapStateToProps)(ReactivateAccount);