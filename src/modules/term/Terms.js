import React from 'react';
import {
  StyleSheet,
  View,
  WebView,
  ScrollView
} from 'react-native';

import { fonts, colors } from '../../styles';
import { Button, BackgroundView } from '../../components'; 
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { terms } from '../../config'
import HTML from 'react-native-render-html';

export default class Terms extends React.Component {

  componentDidMount() {
  }

  render() {
    return (
      <View style={styles.background}>
          <View style={styles.container}>
          <WebView style={{backgroundColor:'transparent'}} source={{html: `<!DOCTYPE html><html lang="en"><body style="background-color: black;color: white;font-size: 48px;"><p style="font-size:48px; color:'white';">${terms}</p></body></html>`}} />
          </View>
         
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: getBottomSpace(),
  },
  background: {
    flex: 1,
    backgroundColor: 'black'
  },
  text:{
    fontSize: 14,
    color: '#fff',
    margin: 16,
  },

});
