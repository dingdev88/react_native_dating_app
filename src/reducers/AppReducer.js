import * as ACTION_TYPES from '../actions/ActionTypes';

const INITIAL_STATE = {
  isLoading: false,
  success: false,
  error: null,
  modifiables: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case ACTION_TYPES.GET_MODIFIABLES:
        return { ...state, isLoading: true, success: false, error: null };
      case ACTION_TYPES.GET_MODIFIABLES_SUCCESS:
        return { ...state, isLoading: false, success: true, error: null, modifiables: action.data.data.modifiables };
      case ACTION_TYPES.GET_MODIFIABLES_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false };
     
      default:
        return state;
    }
  };
  