import { api } from '../config';
import * as ACTION_TYPES from './ActionTypes';
import { AsyncStorage } from 'react-native';
import { showToast } from '../helpers';
import RNFetchBlob from 'rn-fetch-blob';

export function login(credential) {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.LOGIN });
        const body = credential;
        const request = {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            url: `${api.baseURL}/api/user/login`,
            method: 'post',
            body: JSON.stringify(body),
          };
        console.log("login- request", request);
        fetch(request.url, request)
          .then((res) => {
            console.log(res);
            if(res.ok) {
                res
                .json()
                .then((response)=> {
                    _persistAuth(response.data)
                    .then(() => dispatch({ type: ACTION_TYPES.LOGIN_SUCCESS, auth: response.data, credential: credential }))
                    .then(()=>{

                    })
                    .catch(console.error);
                })
            } else {
                dispatch({ type: ACTION_TYPES.LOGIN_FAILURE });
            }
          })   
    }
}

export function signup(credential) {
  return (dispatch, getState) => {
      dispatch({ type: ACTION_TYPES.SIGNUP });
      const body = credential;
      const request = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          url: `${api.baseURL}/api/user/signup`,
          method: 'post',
          body: JSON.stringify(body),
        };
      console.log("signup- request", request);
      fetch(request.url, request)
        .then((res) => {
          console.log(res);
          if(res.ok) {
              res
              .json()
              .then((response)=> {
                  _persistAuth(response.data)
                  .then(() => dispatch({ type: ACTION_TYPES.SIGNUP_SUCCESS, auth: response.data, credential: credential }))
                  .then(()=>{

                  })
                  .catch(console.error);
              })
          } else {
              res
              .json()
              .then((result => {
                if(result && result.message)
                showToast(result.message, 'short');
              }))
              .catch(console.error);
              dispatch({ type: ACTION_TYPES.SIGNUP_FAILURE });
          }
        })   
  }
}

export function forgotPassword(email){
  let body = {
    email
  }
  return {
    type: ACTION_TYPES.FORGOT_PASSWORD,
    request: {
      url: `${api.baseURL}/api/user/forgotPassword`,
      method: 'post',
      body: JSON.stringify(body)
    },
  }
}

export function _persistAuth(auth) {
    return AsyncStorage.setItem('auth', JSON.stringify(auth));
}

export function loadUserProfile(userId) {
  return {
    type: ACTION_TYPES.LOAD_PROFILE,
    request: {
      url: `${api.baseURL}/api/user/${userId}/profile/${userId}`,
    },
  }
}

export function loadMyGallery(userId) {
  return {
    type: ACTION_TYPES.GET_MY_GALLERY,
    request: {
      url: `${api.baseURL}/api/user/${userId}/gallery/${userId}`,
    },
  }
}

export function loadBlockUsers(userId) { 
  return {
    type: ACTION_TYPES.LOAD_MY_BLOCK,
    request: {
      url: `${api.baseURL}/api/interaction/${userId}/blocked`,
    }
  }
}

export function updateProfile(userId, body) {
  return {
    type: ACTION_TYPES.UPDATE_PROFILE,
    request: {
      url: `${api.baseURL}/api/user/${userId}/edit`,
      method: 'post',
      body: JSON.stringify(body)
    }
  }
}

export function updateEmail(userId, email) {
  let body = {
    newEmail: email
  }
  return {
    type: ACTION_TYPES.UPDATE_EMAIL,
    request: {
      url: `${api.baseURL}/api/user/${userId}/edit/email`,
      method: 'post',
      body: JSON.stringify(body)
    },
    email
  }
}

export function updatePassword(userId, password) {
  let body = {
    newPassword: password
  }
  return {
    type: ACTION_TYPES.UPDATE_PASSWORD,
    request: {
      url: `${api.baseURL}/api/user/${userId}/edit/password`,
      method: 'post',
      body: JSON.stringify(body)
    },
    password
  }
}

export function updateSettings(settings) {
  return { 
    type: ACTION_TYPES.UPDATE_SETTINGS,
    settings: settings
  }
}

export function saveCurrentLocation(location) {
  return {
    type: ACTION_TYPES.SAVE_CURRENT_LOCATION,
    location
  }
}

export function logout(){
  return (dispatch, getState) => {
    dispatch({
      type: ACTION_TYPES.LOGOUT
    });
    dispatch({
      type: ACTION_TYPES.DISABLE_LOCK
    });

  }
}

export function uploadProfileImage(userId, media) {
  const {uri: PATH , mime} = media;
  return (dispatch, getState) => {

      AsyncStorage.getItem('auth')
      .then((authString) => {
          const auth = JSON.parse(authString);

          dispatch({ type: ACTION_TYPES.UPDATE_PROFILE_IMAGE });
          const requrestURL = `${api.baseURL}/api/user/${userId}/profilePicture`;
          const body = [
              {
                name: 'profilePicture',
                filename: 'photo.jpg',
                data: RNFetchBlob.wrap(PATH.replace('file://', '')),
                type: mime,
              },
            ];
          
            console.log('updateProfileImage', body);
            const requestCONFIG = {
              'Content-Type': 'multipart/form-data',
              'token': auth ? `${auth.token}` : ''
            };

            RNFetchBlob.fetch('POST', requrestURL, requestCONFIG, body)
            .uploadProgress({ interval: 5000 }, (written, total) => {
              const LEVEL = Math.round((written / total) * 100);
              console.log('uploaded', LEVEL);
              dispatch({
                type: ACTION_TYPES.UPDATE_PROFILE_IMAGE_PROCESS,
                data: LEVEL.toString(),
              });
            })
            .then((res) => {
              let data = JSON.parse(res.data);
              dispatch({
                type: ACTION_TYPES.UPDATE_PROFILE_IMAGE_SUCCESS,
                data: data,
              });
            })
            .catch((err) => {
              console.error(err);
              dispatch({ type: ACTION_TYPES.UPDATE_PROFILE_IMAGE_FAILURE });
              showAlert('upload error', 'Please try again later, or contact your administrator.');
            });
      })      
      .catch((err) => {
          console.log('UNAUTHORIZED', err.message);
          dispatch({ type: ACTION_TYPES.UPDATE_PROFILE_IMAGE_FAILURE });
      });
  
  }
}

export function getMyAcceptedComments(userId) {
  return {
      type: ACTION_TYPES.GET_MY_ACCEPTED_COMMENTS,
      request: {
        url: `${api.baseURL}/api/review/${userId}/acceptedReviews`
      }
  } 
}

export function deleteComment(reviewId, userId) {
  let body = {
    reviewId: reviewId
  }
  return {
      type: ACTION_TYPES.DELETE_MY_COMMENT,
      request: {
        url: `${api.baseURL}/api/review/${reviewId}/user/${userId}/delete`,
        method: 'post',
        body: JSON.stringify(body)
      },
      reviewId
  }
}

export function reportUserComment(reporter, reported, reason, comment) {
  let body = {
      reasonReported: reason,
      reportComment: comment
  }
  return {
      type: ACTION_TYPES.REPORT_USER_COMMENT,
      request: {
          url: `${api.baseURL}/api/report/${reporter}/profile/${reported}`,
          method: 'post',
          body: JSON.stringify(body)
      }
  }
}

export function deactivateAccount(userId, password) {
  let body = {
    password: password
  }
  return {
      type: ACTION_TYPES.DEACTIVATE_ACCOUNT,
      request: {
        url: `${api.baseURL}/api/user/${userId}/deactivate`,
        method: 'post',
        body: JSON.stringify(body)
      }
  }
}

export function reactivateAccount(userId) {

  return {
      type: ACTION_TYPES.REACTIVATE_ACCOUNT,
      request: {
        url: `${api.baseURL}/api/user/${userId}/reactivate`,
        method: 'post'
      }
  }
}

export function deleteAccount(userId, password) {
  let body = {
    password: password
  }
  console.log("deleteaccount", body);
  return {
    type: ACTION_TYPES.DELETE_ACCOUNT,
    request: {
      url: `${api.baseURL}/api/user/${userId}/delete/`,
      method: 'post',
      body: JSON.stringify(body)
    }
  }
}