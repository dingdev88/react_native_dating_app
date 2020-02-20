import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// ## Generator Reducer Imports
import app from '../reducers/AppReducer';
import auth from '../reducers/AuthReducer';
import users from '../reducers/UserReducer';
import publicUser from '../reducers/PublicUserReducer';
import gallery from '../reducers/GalleryReducer';
import comment from  '../reducers/CommentReducer';
import lockCode from '../reducers/LockCodeReducer';
import chat from '../reducers/ChatReducer';

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  blacklist: ['isLoading'],
};

const usersPersistConfig = {
  key: 'users',
  storage: storage,
  blacklist: ['isLoading', 'success', 'error', 'searchUsers'],
};

const lockCodePersistConfig = {
  key: 'lockCode',
  storage: storage,
  blacklist: []
}

export default combineReducers({
  // ## Generator Reducers
  app: persistReducer(getNormalConfig('app', []), app),
  auth: persistReducer(authPersistConfig, auth),
  users,
  publicUser,
  gallery,
  comment,
  lockCode: persistReducer(lockCodePersistConfig, lockCode),
  chat
});


function getNormalConfig(name, blackList) {
  return {
    key: name,
    storage: storage,
    blacklist: blackList,

  };
}