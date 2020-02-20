import React, { Component } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text,Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ImageView from './ImageView';

export default class PhotoPickerView extends Component {
  constructor(props) {
      super(props);
  }

  onPickFromGallery = () => {
    ImagePicker.openPicker({
      width: 1024,
      height: 1024,
      cropping: true
    }).then(image => {
      this.updateImage({uri: image.path, width: image.width, height: image.height, mime: image.mime});
   });
  }
  onPickFromCamera = () => {
    ImagePicker.openCamera({
      width: 1024,
      height: 1024,
      cropping: true,
    }).then(image => {
      this.updateImage({uri: image.path, width: image.width, height: image.height, mime: image.mime});
    });
  }

  onPhotoPick = () => {
    let title = this.props.selectPhotoLabel ? this.props.selectPhotoLabel : 'Upload photo';
    Alert.alert(
      title,
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

  updateImage(response) {
    const source = { uri: response.uri };
    if(this.props.updateImage) {
        this.props.updateImage(source);
    }
  }

  render = () => {
    const { imageUrl } = this.props;
    console.log("photopickerview", imageUrl);
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
              <ImageView style={styles.image} 
                         resizeMode='center' 
                         shortUrl={this.props.imageUrl}
                         defaultImage={require('../../assets/images/defaultImage.png')}
                         />

            </View>
            <TouchableOpacity
                  style={styles.cameraBtn}
                  onPress={() => {
                    this.onPhotoPick();
                  }}  
              >
                <Image style={{ width: 40, height: 40}} 
                        source={require('../../assets/images/camera.png')} 
                        resizeMode={'contain'} />
              </TouchableOpacity>
            
        </View>

    );
  };
}

const styles = StyleSheet.create({
  container: {
    alignSelf:'stretch',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#19181a'
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignItems:'center',
    justifyContent:'center'
  },
  image: {
    width:200,
    height:200
  },
  cameraBtn: {
    position: 'absolute',
    width: 40,
    height: 40,
    right: 16,
    bottom: 16,
    justifyContent:'center',
    alignItems:'center'
  }
});

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
};


