import * as ACTION_TYPES from '../actions/ActionTypes';

const INITIAL_STATE = {
    locked: false,
    lockCode: ''
  };

  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ACTION_TYPES.ENABLE_LOCK:
            return {lockCode: action.lockCode, locked: true}
        case ACTION_TYPES.DISABLE_LOCK:
            return {lockCode: '', locked: false}
        default:
            return state;
    }
  };
  