import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity
} from 'react-native';

import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { ImageView } from '../../components';
import { colors } from '../../styles';
import { calculatePortraitDimension } from '../../helpers'

import Icon from 'react-native-vector-icons/FontAwesome';

const {width: deviceWidth, height: deviceHeight} = calculatePortraitDimension();
export default class PhotoModal extends React.Component {
    constructor(props) {
      super(props); 
      this.state={
          source: this.props.navigation.getParam('source'),
          shortUrl: this.props.navigation.getParam('shortUrl')
      }
      console.log("photoModal", this.props.navigation.getParam('shortUrl'));
    }

    getCloseButton = () => {
        return <TouchableOpacity 
        style={{width: 40, height: 40, top:16, left: 16, zIndex:1, position:'absolute',
                justifyContent:'center', alignItems:'center'}}
        onPress={()=>{
            this.props.navigation.goBack()
        }}>
            <Icon name={'close'} color={'white'} size={40}/>
        </TouchableOpacity>
    }
    render() {
        return (
            <View style={styles.background}>

                <View style={styles.container}>
                  {this.getCloseButton()}
                  <ImageView
                    style={{height: deviceHeight, width: deviceWidth}}
                    source={this.state.source}
                    defaultImage={require('../../../assets/images/defaultImage.png')}
                    shortUrl={this.state.shortUrl}
                  />
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    container: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? getStatusBarHeight(true) : 0,
        marginBottom: getBottomSpace(),
        justifyContent:'center',
        alignItems:'center'
    },



});

