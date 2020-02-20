import React, { PureComponent } from 'react';
import { Image, StyleSheet, TextInput, TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native';
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import PropTypes from 'prop-types';
import { colors } from '../../../styles'
import * as MESSAGE_TYPE from './MessageTypes'

class ComposerContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      height: 40,
    };
  }

  onAdd = () => {

  }
  fireCreateMessage = () => {
    if(this.props.createMessage) {
      this.props.createMessage({ messageType: MESSAGE_TYPE.MESSAGE_TYPE_TEXT, messageContent : { message: this.state.text }}  )
    }
    this.setState({text: ''})
  }

  onRadio = () => {

  }

  handleEndEditing = (e) => {
    this.fireCreateMessage();
  }

  handleTextChange = (text) => {
    this.setState({text});
  }

  render = () => {
    const { height, borderRadius, text } = this.state;
    const { showComposer } = this.props;

    if (!showComposer) {
      return null;
    }

    return (
      <View style={styles.composerContainer}>
        <TouchableOpacity style={styles.addContainer} onPress={this.onAdd}>
          <Image style={styles.addImg} source={require('../../../../assets/images/plus.png')}/>
        </TouchableOpacity>
        <View style={styles.bar}/>
        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            style={[styles.input, { flex: 1 }]}
            placeholder='Aa'
            placeholderTextColor='rgba(255, 255, 255, 0.2)'
            underlineColorAndroid='transparent'
            autoFocus
            onEndEditing={this.handleEndEditing}
            onChangeText={this.handleTextChange}
            textAlignVertical='top'
          />
        </View>

        {/* SEND BUTTON */}
        <TouchableWithoutFeedback
          onPress={this.fireCreateMessage}
          hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}
        >
          <View style={styles.sendButtonContainer}>
            <Image style={styles.sendButtonIcon} 
                   source={require('../../../../assets/images/send.png')}/>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.bar}/>
        <TouchableOpacity
          onPress={this.onRadio}
          hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}
        >
          <View style={styles.sendButtonContainer}>
            <Image style={styles.sendButtonIcon}
                   source={require('../../../../assets/images/record.png')}   
                    />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  sendButtonContainer: {
    justifyContent: 'center',
  },
  sendButtonIcon: {
    width: 38,
    height: 38,
    padding: 4,
    alignSelf: 'center',
  },
  input: {
    padding: 8,
    fontSize: 14,
    color: '#FFF',
  },
  composerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray
  },
  inputContainer: {
    flex:1,
    height: 50
  },
  addContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addImg: {
    width: 50,
    height: 50
  },
  bar: {
    width: 1,
    height: 38,
    backgroundColor: colors.gray
  }
});


ComposerContainer.propTypes = {
  createMessage: PropTypes.func,
  showComposer: PropTypes.bool,
};

export default ComposerContainer;
