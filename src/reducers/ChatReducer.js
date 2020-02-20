import * as ACTION_TYPES from '../actions/ActionTypes';

const INITIAL_STATE = {
  isLoading: false,
  success: false,
  error: null,
  chatrooms: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.GET_CHATROOM_LIST:
        return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.GET_CHATROOM_LIST_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, chatrooms: action.data.data.chatroom, currentAction: action.type };
    case ACTION_TYPES.GET_CHATROOM_LIST_FAILURE:
      return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type };
    default:
      return state;
  }
};
