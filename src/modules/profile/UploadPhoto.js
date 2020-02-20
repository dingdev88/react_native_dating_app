import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux'; 
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { ImageView, SegmentedControl, LoadingOverlay } from '../../components';
import { colors } from '../../styles';
import { calculatePortraitDimension } from '../../helpers';
const { width : deviceWidth } = calculatePortraitDimension();
import {addGallery} from '../../actions/GalleryActions';

import Icon from 'react-native-vector-icons/FontAwesome';

class UploadPhoto extends React.Component {
    constructor(props) {
      super(props); 
      this.state={
        image: this.props.navigation.getParam('image'),
        selectedIndex: 0,

      }
    }

    componentWillReceiveProps(nextProps) {
        const { user } = this.props.auth;
        if(this.props.gallery.success == false && nextProps.gallery.success) {
            //upload successed, reload user profile.
            this.props.navigation.goBack();
        }
    }
    uploadImage(userId) {
        if(this.state.image) {
            console.log("upload image:", this.state.image);
            let media = {...this.state.image};
            media.isPrivate = this.state.selectedIndex == 1;
            this.props.dispatch(addGallery(userId, media))
        }
    }
    render() {
        const { user } = this.props.auth;
        const { gallery, auth } = this.props;
        return (
            <View style={styles.background}>
                <LoadingOverlay visible={auth.isLoading || gallery.isLoading}/>
                <View style={styles.container}>
                  <ImageView
                    source={ this.state.image }
                    style={{ width:  deviceWidth, height: deviceWidth }}
                  />
                  <View style={{alignSelf: 'stretch', height: 60, justifyContent:'center', alignItems:'center'}}>
                    <SegmentedControl
                        type={'default'}
                        values={['PUBLIC', 'PRIVATE']}
                        onChange={(index)=>{
                            this.setState({selectedIndex: index})
                        }}
                        selectedIndex = {this.state.selectedIndex}
                        style={{width: 250, height: 50}}
                    />  
                  </View>
                  <TouchableOpacity 
                        style={{position: 'absolute', right: 16,bottom:16, width:  50, height: 50, 
                                justifyContent:'center', alignItems:'center'}}
                        onPress={()=>{
                            this.uploadImage(user.id)
                        }}>
                      <ImageView style={{width: 40, height:40}} source={require('../../../assets/images/forward_white.png')}/>
                  </TouchableOpacity>
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: colors.black,
    },
    container: {
        flex: 1,
        marginBottom: getBottomSpace()
    },

});

const mapStateToProps = (state) => ({ app: state.app, auth: state.auth, gallery: state.gallery });

export default connect(mapStateToProps)(UploadPhoto);