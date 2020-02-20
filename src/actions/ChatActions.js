import { api } from '../config';
import * as ACTION_TYPES from './ActionTypes';

/**
 * 
 * @param {object} chatroom   ex: {created_by: 1, name: 'ding, isGroup: false, group_user: ['2', '3]} 
 */
export function createChatroom(chatroom) {

    return {
      type: ACTION_TYPES.CREATE_CHATROOM,
      request: {
        url: `${api.baseURL}/api/chatroom/create/${chatroom.created_by}/${chatroom.name}`,
        method: 'post',
        body: JSON.stringify(chatroom)
      },
    }
}

export function removeChatroom(chatroomId) {
    return {
        type: ACTION_TYPES.REMOVE_CHATROOM,
        request: {
          url: `${api.baseURL}/api/chatroom/remove/${chatroomId}`,
          method: 'post'
        },
      }
}

export function getChatroomList(userId) {
    return {
        type: ACTION_TYPES.GET_CHATROOM_LIST,
        request: {
          url: `${api.baseURL}/api/chatroom/get/${userId}`,
          method: 'post'
        },
    }
}
/**
 * 
 * @param {object} data  ex: {roomId: 1, limit: 20, offset: 20}
 */
export function getMessages(data) {
    return {
        type: ACTION_TYPES.GET_MESSAGES,
        request: {
          url: `${api.baseURL}/api/chatroom/getmessage/${data.roomId}/limit/${data.limit}/offset/${data.offset}`,
          method: 'post'
        },
    }
}

/**
 * 
 * @param {integer} chatroomId 
 * @param {array} users  ex: ['1', '3']
 */
export function addUserToChatroom(chatroomId, users) {
    let body = {
        group_user: users
    }
    return {
        type: ACTION_TYPES.ADD_USER_TO_CHATROOM,
        request: {
            url: `${api.baseURL}/api/adduser/${chatroomId}`,
            method: 'post',
            body: JSON.stringify(body)
        },
    }
}

export function uploadChatImage(fromUserId, chatroomId, media) {
  const {uri: PATH , mime} = media;
  return (dispatch, getState) => {

      AsyncStorage.getItem('auth')
      .then((authString) => {
          const auth = JSON.parse(authString);

          dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE_CHAT });
          const requrestURL = `${api.baseURL}/api/chat/group/photo/from/${fromUserId}/to/${chatroomId}`;
          const body = [
              {
                name: 'chatPhoto',
                filename: 'photo.jpg',
                data: RNFetchBlob.wrap(PATH.replace('file://', '')),
                type: mime,
              },
            ];
          
            console.log('uploadChatImage', body);
            const requestCONFIG = {
              'Content-Type': 'multipart/form-data',
              'token': auth ? `${auth.token}` : ''
            };

            RNFetchBlob.fetch('POST', requrestURL, requestCONFIG, body)
            .uploadProgress({ interval: 5000 }, (written, total) => {
              const LEVEL = Math.round((written / total) * 100);
              console.log('uploaded', LEVEL);
              dispatch({
                type: ACTION_TYPES.UPLOAD_IMAGE_CHAT_PROCESS,
                data: LEVEL.toString(),
              });
            })
            .then((res) => {
              let data = JSON.parse(res.data);
              dispatch({
                type: ACTION_TYPES.UPLOAD_IMAGE_CHAT_SUCCESS,
                data: data,
              });
            })
            .catch((err) => {
              console.error(err);
              dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE_CHAT_FAILURE });
              showAlert('upload error', 'Please try again later, or contact your administrator.');
            });
      })      
      .catch((err) => {
          console.log('UNAUTHORIZED', err.message);
          dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE_CHAT_FAILURE });
      });
  
  }
}

export function uploadChatAudio(fromUserId, chatroomId, media) {
  const {uri: PATH , mime} = media;
  return (dispatch, getState) => {

      AsyncStorage.getItem('auth')
      .then((authString) => {
          const auth = JSON.parse(authString);

          dispatch({ type: ACTION_TYPES.UPLOAD_AUDIO_CHAT });
          const requrestURL = `${api.baseURL}/api/chat/group/photo/from/${fromUserId}/to/${chatroomId}`;
          const body = [
              {
                name: 'audiochat',
                filename: 'audio.m4a',
                data: RNFetchBlob.wrap(PATH.replace('file://', '')),
                type: 'audio/*',
              },
            ];
          
            console.log('uploadChatImage', body);
            const requestCONFIG = {
              'Content-Type': 'multipart/form-data',
              'token': auth ? `${auth.token}` : ''
            };

            RNFetchBlob.fetch('POST', requrestURL, requestCONFIG, body)
            .uploadProgress({ interval: 5000 }, (written, total) => {
              const LEVEL = Math.round((written / total) * 100);
              console.log('uploaded', LEVEL);
              dispatch({
                type: ACTION_TYPES.UPLOAD_AUDIO_CHAT_PROCESS,
                data: LEVEL.toString(),
              });
            })
            .then((res) => {
              let data = JSON.parse(res.data);
              dispatch({
                type: ACTION_TYPES.UPLOAD_AUDIO_CHAT_SUCCESS,
                data: data,
              });
            })
            .catch((err) => {
              console.error(err);
              dispatch({ type: ACTION_TYPES.UPLOAD_AUDIO_CHAT_FAILURE });
              showAlert('upload error', 'Please try again later, or contact your administrator.');
            });
      })      
      .catch((err) => {
          console.log('UNAUTHORIZED', err.message);
          dispatch({ type: ACTION_TYPES.UPLOAD_AUDIO_CHAT_FAILURE });
      });
  
  }
}

export function appearOffline(fromUserId, toUserId) {
  return {
    type: ACTION_TYPES.APPEAR_OFFLINE,
    request: {
      url: `${api.baseURL}/api/interaction/${fromUserId}/appearOffline/${toUserId}`,
      method: 'post'
    },
  } 
}

export function appearOnline(fromUserId, toUserId) {
  return {
    type: ACTION_TYPES.APPEAR_ONLINE,
    request: {
      url: `${api.baseURL}/api/interaction/${fromUserId}/appearOnline/${toUserId}`,
      method: 'post'
    },
  } 
}

export function unlockAlbum(fromUserId, toUserId) {
  return {
    type: ACTION_TYPES.UNLOCK_ALBUM,
    request: {
      url: `${api.baseURL}/api/interaction/${fromUserId}/unlockAlbum/${toUserId}`,
      method: 'post'
    },
  } 
}
export function lockAlbum(fromUserId, toUserId) {
  return {
    type: ACTION_TYPES.UNLOCK_ALBUM,
    request: {
      url: `${api.baseURL}/api/interaction/${fromUserId}/lockAlbum/${toUserId}`,
      method: 'post'
    },
  } 
}

/**
 * 
 * @param {object} data  ex: {roomId, limit, offset}
 */
export function getMediaHistory(data) {
  return {
      type: ACTION_TYPES.GET_MESSAGES,
      request: {
        url: `${api.baseURL}/api/chat/group/photo/${data.roomId}/limit/${data.limit}/offset/${data.offset}`,
      },
  }
}