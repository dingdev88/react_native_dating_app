import { api } from '../config';
import * as ACTION_TYPES from './ActionTypes';
import { AsyncStorage } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export function getModifiables(userId) {

    return {
      type: ACTION_TYPES.GET_MODIFIABLES,
      request: {
        url: `${api.baseURL}/api/user/modifiables/${userId}`,
      },
    }
}