import { api } from '../config';
import * as ACTION_TYPES from './ActionTypes';
import { AsyncStorage } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export function  getGallery(viewerUserId, viewingUserId) {

    return {
      type: ACTION_TYPES.GET_GALLERY,
      request: {
        url: `${api.baseURL}/api/user/${viewerUserId}/gallery/${viewingUserId}`,
      },
    }
}
export function  addGallery(userId, media) {
    const {uri: PATH , isPrivate, mime} = media;
    return (dispatch, getState) => {

        AsyncStorage.getItem('auth')
        .then((authString) => {
            const auth = JSON.parse(authString);

            dispatch({ type: ACTION_TYPES.ADD_IMAGE_GALLERY });
            const requrestURL = `${api.baseURL}/api/user/${userId}/gallery/add`;
            const body = [
                {
                  name: 'isPrivate',
                  data:  isPrivate? 'true': 'false',
                },
                {
                  name: 'galleryPhoto',
                  filename: 'photo.jpg',
                  data: RNFetchBlob.wrap(PATH.replace('file://', '')),
                  type: mime,
                },
              ];
            
              console.log('addGallery', body);
              const requestCONFIG = {
                'Content-Type': 'multipart/form-data',
                'token': auth ? `${auth.token}` : ''
              };

              RNFetchBlob.fetch('POST', requrestURL, requestCONFIG, body)
              .uploadProgress({ interval: 5000 }, (written, total) => {
                const LEVEL = Math.round((written / total) * 100);
                console.log('uploaded', LEVEL);
                dispatch({
                  type: ACTION_TYPES.ADD_IMAGE_GALLERY_PROCESS,
                  data: LEVEL.toString(),
                });
              })
              .then((res) => {
                dispatch({
                  type: ACTION_TYPES.ADD_IMAGE_GALLERY_SUCCESS,
                  data: res,
                });
              })
              .catch((err) => {
                console.error(err);
                dispatch({ type: ACTION_TYPES.ADD_IMAGE_GALLERY_FAILURE });
                showAlert('upload error', 'Please try again later, or contact your administrator.');
              });
        })      
        .catch((err) => {
            console.log('UNAUTHORIZED', err.message);
            dispatch({ type: ACTION_TYPES.ADD_IMAGE_GALLERY_FAILURE });
        });
    
    }
}
export function  deleteGallery(userId, photoIds) {

    return {
      type: ACTION_TYPES.DELETE_IMAGE_GALLERY,
      request: {
        url: `${api.baseURL}/api/user/${userId}/gallery/delete`,
        method: 'post',
        body: JSON.stringify({photoId: photoIds})
      },
    }
}