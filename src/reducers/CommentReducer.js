import * as ACTION_TYPES from '../actions/ActionTypes';

const INITIAL_STATE = {
  isLoading: false,
  success: false,
  error: null,
  comments: [],
  userId: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ACTION_TYPES.POST_COMMENT:
            return { ...state, isLoading: true, success: false, error: null , currentAction: action.type};
        case ACTION_TYPES.POST_COMMENT_SUCCESS:
            return { ...state, isLoading: false, success: true, error: null, currentAction: action.type};
        case ACTION_TYPES.POST_COMMENT_FAILURE:
            return { ...state, isLoading: false, error: 'You have already commented on this profile.', success: false, currentAction: action.type};         
              
        case ACTION_TYPES.GET_ACCEPTED_COMMENTS:
            return { ...state, isLoading: true, success: false, error: null , currentAction: action.type};
        case ACTION_TYPES.GET_ACCEPTED_COMMENTS_SUCCESS:
            return { ...state, isLoading: false, success: true, error: null, currentAction: action.type, comments: action.data.data.reviews, userId: action.userId};
        case ACTION_TYPES.GET_ACCEPTED_COMMENTS_FAILURE:
            return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};         
                
            default:
        return state;
    }
  };
  