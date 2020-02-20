import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Platform,
  TouchableOpacity
} from 'react-native';


import { connect } from 'react-redux';

import { calculatePortraitDimension } from '../../helpers';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { TopNavigatorView, LoadingOverlay } from '../../components';
import PhotosPanel from './components/PhotosPanel';
import { colors } from '../../styles';
import { deleteGallery } from '../../actions/GalleryActions';
import ImagePicker from 'react-native-image-crop-picker';
import { loadMyGallery } from '../../actions/AuthActions';

const { height : deviceHeight, width: deviceWidth } = calculatePortraitDimension();

class GalleryEdit extends React.Component {
    constructor(props) {
      super(props);
      this.state={
        isEdit : false,
        selectedItems: []
      }
    }

    componentWillReceiveProps(nextProps) {
      const { user } = this.props.auth;
      if(this.props.gallery.success == false && nextProps.gallery.success) {
          //upload successed, reload user profile.
          this.props.dispatch(loadMyGallery(user.id))
      }
    } 
    onPickFromGallery = () => {
      ImagePicker.openPicker({
        width: 1024,
        height: 1024,
        cropping: true
      }).then(image => {
        this.choosePrivate({uri: image.path, width: image.width, height: image.height, mime: image.mime});
      });
    }
    onPickFromCamera = () => {
      ImagePicker.openCamera({
        width: 1024,
        height: 1024,
        cropping: true,
      }).then(image => {
        this.choosePrivate({uri: image.path, width: image.width, height: image.height, mime: image.mime});
      });
    }
    choosePrivate = (image) => {
      this.props.navigation.navigate("UploadPhoto", {
        image: image
      })
    }

    onImagePick = () => {

      Alert.alert(
        'Upload photo',
        'Whould you like to upload a photo from the camera or your gallary?',
        [
          {text: 'Camera', onPress: () => {
            this.onPickFromCamera();
          }},
          {
            text: 'Gallery',
            onPress: () => {
              this.onPickFromGallery();
            },
 
          },
          {text: 'Cancel', style: 'cancel'},
        ],
        {cancelable: false},
      );
    
    }
    deleteImages() {
      let items = this.state.selectedItems;
      let photoIds = items.map((item) => {
        return item.id;
      })
      this.props.dispatch(deleteGallery(this.props.auth.user.id, photoIds));
    }
    getDeleteButton() {
      return <TouchableOpacity 
      onPress={()=>{
        this.deleteImages();
      }}>
        <View style={{paddingRight: 16, height: 50, justifyContent:'center', alignItems:'center'}} >
           <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>Delete</Text>
        </View>
     
      </TouchableOpacity>
    }
    getTopNavigator() {
      return <TopNavigatorView
        title={'Gallery'}
        onBackPressed = {() => {
          this.props.navigation.goBack();
        }}

        rightComponent = { this.state.isEdit && this.getDeleteButton()}
      />
    }

    getPhotoSection = ( items ) => {
      if(items.length == 0 ||  (items.length >0 && !(items[0].isAddButton))) {
        items.unshift({isAddButton:true})
      }

      return <PhotosPanel
        items={items}
        onAddPressed={(item)=>{

          this.onImagePick()
        }}
        onImagePressed={(item)=>{

        }}
        showType={'grid'}
      />
    }


    getGallery(items){
      if(items.length == 0 ||  (items.length >0 && !(items[0].isAddButton))) {
        items.unshift({isAddButton:true})
      }
      return <View style={{flex:1, marginTop: 50}}>
        <PhotosPanel
          items={items}
          onAddPressed={()=>{
            this.onImagePick();
          }}
          itemContainerStyle={styles.itemContainerStyle}
          onImagePressed={(item)=>{

          }}
          selectable={this.state.isEdit}
          navigation={this.props.navigation}
          onSelectionChanged={(items)=>{
            this.setState({selectedItems: items})
          }}
        />
      </View>
    }

    getBottomButton(){
      return <View style={{ alignSelf:'stretch',justifyContent:'center', alignItems:'center'}}>
        <TouchableOpacity
          style={{ height: 40, margin: 16, alignSelf:'stretch',backgroundColor: colors.red, justifyContent:'center', alignItems:'center' }}
          onPress={()=>{
            this.setState({isEdit: !this.state.isEdit})
          }}
        > 
           <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>EDIT</Text>
        </TouchableOpacity>
      </View>
    }

    render() {
        const { gallery } = this.props.auth;
        return (
            <View style={styles.background}>
              <LoadingOverlay visible={this.props.gallery.isLoading}/>
              <View style={styles.container}>
                { this.getTopNavigator() }
                { this.getGallery(gallery)}
                { this.getBottomButton()}
              </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex:1,
        backgroundColor: 'black'
    },
    container: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? getStatusBarHeight(true) : 0,
        marginBottom: getBottomSpace()
    },

    itemContainerStyle: {
      width : deviceWidth / 3 - 16,
      height : deviceWidth / 3 - 16,
      backgroundColor: colors.darkGray
    },


});

const mapStateToProps = (state) => ({ app: state.app, auth: state.auth, gallery: state.gallery });

export default connect(mapStateToProps)(GalleryEdit);