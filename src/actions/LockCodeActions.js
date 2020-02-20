import { api } from '../config';
import * as ACTION_TYPES from './ActionTypes';

export function enableLock(lockCode) {

    return {
      type: ACTION_TYPES.ENABLE_LOCK,
      lockCode
    }
}
export function disableLock() {
    return {
       type: ACTION_TYPES.DISABLE_LOCK 
    }
}