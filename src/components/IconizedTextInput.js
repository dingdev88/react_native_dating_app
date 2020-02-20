import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, StyleSheet, TextInput, Image, Text, TouchableOpacity} from 'react-native';

import { fonts, colors } from '../styles';

class IconizedTextInput extends React.Component {
  focus = () => {
    this.textInput.focus();
  };
  render () {
    const { props } = this;
    return (
    
        <View style={[{ flexDirection: 'row', alignItems:'center' }, {...props.containerStyle}]}>
            {
                props.icon &&
                <Image source={props.icon} style={styles.icon} />
            }
            
            <View style={{ alignSelf: 'stretch', flexDirection: 'column', marginLeft: props.icon ? 16: 0, flex:1 }}>
                {
                  props.description && 
                  <Text style={{color: colors.transparentWhite}}>{props.description}</Text>
                }
                <View style={{ alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center'}}>
                  { 
                    props.phoneNumberPrefix && 
                    <Text style={{color:colors.white, paddingRight: 8}}>{props.phoneNumberPrefix}</Text>
                  }
                  <TextInput
                      ref={(component) => {
                          this.textInput = component;
                      }}
                      placeholderTextColor={props.placeholderTextColor || colors.transparentWhite}
                      underlineColorAndroid={colors.transparentWhite}
                      {...props}
                      style={[this.props.bordered? styles.bordered: null ,  styles.default,this.props.bold? styles.bold: null, {flex: 1}, this.props.textStyle]}
                  />
                </View>

                {Platform.OS === 'ios' && (
                    <View style={{ height: 0.5, backgroundColor: colors.transparentWhite }} />
                )}
            </View>
            {
              props.seePasswordEyeIcon && props.seePasswordEyeSlashIcon &&
              <TouchableOpacity
                onPress={()=>{
                  this.props.seePassword && 
                    this.props.seePassword(this.props.secureTextEntry)
                }}
                >
                {
                  this.props.secureTextEntry?  
                    this.props.seePasswordEyeIcon
                  :
                    this.props.seePasswordEyeSlashIcon
                }
              </TouchableOpacity>
           
            }
        </View>
      
    
      );
  }
  
}

IconizedTextInput.proptypes = { 
    description: PropTypes.string,
    icon: PropTypes.object,
    phoneNumberPrefix: PropTypes.string,
    containerStyle: PropTypes.object,
    textStyle : PropTypes.object
};
const HEIGHT = 40;

const styles = StyleSheet.create({
  default: {
    height: HEIGHT,
    color: colors.white,
    fontSize: 17,
    fontFamily: fonts.primaryRegular,
    ...Platform.select({
      android: {
        paddingLeft: 5,
        opacity: 0.9,
      },
    }),
  },
  bordered: {
    borderWidth: 1,
    borderColor: 'white',
  },
  icon: {
    width: 25,
    height: 25,
    marginStart: 0,
  }, 
  dark: {
    color: colors.transparentWhite,
  },
  bold: {
    fontWeight: 'bold'
  },
  primary: {
    borderRadius: HEIGHT / 2,
    backgroundColor: 'transparent',
  },
});

export default IconizedTextInput;
