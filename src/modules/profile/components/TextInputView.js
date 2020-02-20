import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Image,
  TextInput
} from 'react-native';

import { fonts, colors } from '../../../styles';
import { Button, BackgroundView, IconizedTextInput, LoadingOverlay } from '../../../components'; 
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { calculatePortraitDimension, showToast } from '../../../helpers'

const { width: deviceWidth, height: deviceHeight } = calculatePortraitDimension();

class TextInputView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value : props.navigation.getParam('value'),
        title: props.navigation.getParam('title'),
        inputType: props.navigation.getParam('inputType') || 'textinput'
    }
  }

  getHeaderView() {
      return <View style={{flexDirection:'column'}}>
        <Image style={{height: deviceWidth*4/6, width: deviceWidth}} 
               resizeMode='contain' 
               source={require('../../../../assets/images/bonestock.jpg')} />
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
                    placeholder={this.state.title}
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
                    value={value}
                    textAlignVertical="top"
                    onChangeText={(text) => {
                    this.setState({ value: text });
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
                if( this.props.navigation.state.params.returnData)
                    this.props.navigation.state.params.returnData(this.state.value);
                this.props.navigation.goBack();
            }}
        />
      </View>
  }

  
  render() {

    const { auth } = this.props; 
    return (
      <View style={styles.background}>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
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

export default TextInputView;