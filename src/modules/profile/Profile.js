import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  Platform,
  TouchableOpacity
} from 'react-native';


import { connect } from 'react-redux';

import { calculatePortraitDimension } from '../../helpers';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import BottomSheet from './components/BottomSheet';
import { ImageView } from '../../components';

const { height : deviceHeight } = calculatePortraitDimension();

class Profile extends React.Component {

  constructor(props) {
    super(props);
  }

  getSettingsButton = () => {
    const { settings , user} = this.props.auth;
    return <View style={{ position:'absolute', top: 24, right: 24, alignItems: 'center', justifyContent:'center'}}>
      <TouchableOpacity
        onPress={()=>{
          this.props.navigation.navigate('Settings', {settings, user});
        }}
      >
        <Image style={{width: 40, height: 40 }} source={require('../../../assets/images/settings.png')}>
          
        </Image>
      </TouchableOpacity>
    </View>
  }

  render() {
    const { user, gallery } = this.props.auth;
    return (
      <View style={styles.background}>
        <View style={styles.container}>
          <TouchableOpacity 
          activeOpacity={1}
          style={{position:'absolute', left:0, right:0, top:0, bottom:0}} 
          onPress = {()=>{
            this.props.navigation.navigate("PhotoModal", {shortUrl: user.bigImageUrl})
          }}>
          <ImageView shortUrl= {user.bigImageUrl} style={{position:'absolute', left:0, right:0, top:0, bottom:0}} resizeMode={'cover'}/>  
          </TouchableOpacity>
          
          {this.getSettingsButton()}
          <BottomSheet
            user={user}
            gallery={gallery}
            navigation={this.props.navigation}
          />
        
        </View>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? getStatusBarHeight(true) : 0,
  },
  background:{
    flex: 1,
    backgroundColor:'black'
  },
  text: {
    fontSize: 14,
    color: 'white'
  },

  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  panelHeader: {
    height: 120,
    backgroundColor: '#b197fc',
    alignItems: 'center',
    justifyContent: 'center'
  },
  favoriteIcon: {
    position: 'absolute',
    top: -24,
    right: 24,
    backgroundColor: '#2b8a3e',
    width: 48,
    height: 48,
    padding: 8,
    borderRadius: 24,
    zIndex: 1
  },
  settingsButton: {
    width: 48,
    height: 48,

  }
});

const mapStateToProps = (state) => ({ app: state.app, auth: state.auth });

export default connect(mapStateToProps)(Profile);