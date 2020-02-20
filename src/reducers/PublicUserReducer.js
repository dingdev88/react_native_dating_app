import * as ACTION_TYPES from '../actions/ActionTypes';

const INITIAL_STATE = {
  isLoading: false,
  success: false,
  error: null,
  user: null,
  userToUser: null,
  gallery:[],
  ratedValue: 0,
  comments: []
};

export default (state = INITIAL_STATE, action) => {
    var userToUser = {}
    switch (action.type) {
        case ACTION_TYPES.LOAD_PUBLIC_PROFILE:
        return { ...INITIAL_STATE, isLoading: true, success: false, error: null, currentAction: action.type };
        case ACTION_TYPES.LOAD_PUBLIC_PROFILE_SUCCESS:
        return { ...state, isLoading: false, success: true, error: null, 
                user: action.data.data.user, userToUser: action.data.data.userToUser, 
                ratedValue: action.data.data.ratedValue, currentAction: action.type };
        case ACTION_TYPES.LOAD_PUBLIC_PROFILE_FAILURE:
            return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type };
        

        case ACTION_TYPES.BONE_USER:
            return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
        case ACTION_TYPES.BONE_USER_SUCCESS:
            userToUser ={...(state.userToUser || {}), isBoning: true}
            return { ...state, isLoading: false, success: true, error: null, userToUser, currentAction: action.type};
        case ACTION_TYPES.BONE_USER_FAILURE:
            return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};
            
        case ACTION_TYPES.RATE_USER:
            return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
        case ACTION_TYPES.RATE_USER_SUCCESS:
            let user = state.user;
            if(user) 
                user.rating = action.data.data.newRating;
            return { ...state, isLoading: false, success: true, error: null, currentAction: action.type, ratedValue: action.rating, user };
        case ACTION_TYPES.RATE_USER_FAILURE:
            return { ...state, isLoading: false, error: action.message ? action.message : null, success: false, currentAction: action.type};
        
        case ACTION_TYPES.REPORT_USER:
            return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
        case ACTION_TYPES.REPORT_USER_SUCCESS:
            return { ...state, isLoading: false, success: true, error: null, currentAction: action.type};
        case ACTION_TYPES.REPORT_USER_FAILURE:
            return { ...state, isLoading: false, error: action.message ? action.message : null, success: false, currentAction: action.type};
                
        

        case ACTION_TYPES.UNBONE_USER:
            return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
        case ACTION_TYPES.UNBONE_USER:
            userToUser ={...(state.userToUser || {}), isBoning: false}
            return { ...state, isLoading: false, success: true, error: null, userToUser, currentAction: action.type};
        case ACTION_TYPES.UNBONE_USER_FAILURE:
            return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};
                                
        case ACTION_TYPES.BLOCK_USER:
            return { ...state, isLoading: true, success: false, error: null , currentAction: action.type};
        case ACTION_TYPES.BLOCK_USER_SUCCESS:
            userToUser ={...(state.userToUser || {}), isBlocking: true}
            return { ...state, isLoading: false, success: true, error: null, userToUser, currentAction: action.type};
        case ACTION_TYPES.BLOCK_USER_FAILURE:
            return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};
                
        case ACTION_TYPES.UNBLOCK_USER:
            return { ...state, isLoading: true, success: false, error: null , currentAction: action.type};
        case ACTION_TYPES.UNBLOCK_USER_SUCCESS:
            return { ...state, isLoading: false, success: true, error: null, currentAction: action.type};
        case ACTION_TYPES.UNBLOCK_USER_FAILURE:
            return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};

        case ACTION_TYPES.WATCH_USER:
            return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
        case ACTION_TYPES.WATCH_USER_SUCCESS:
            userToUser ={...(state.userToUser || {}), isWatching: true}
            return { ...state, isLoading: false, success: true, error: null, userToUser, currentAction: action.type};
        case ACTION_TYPES.WATCH_USER_FAILURE:
            return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};

        case ACTION_TYPES.UNWATCH_USER:
            return { ...state, isLoading: true, success: false, error: null , currentAction: action.type};
        case ACTION_TYPES.UNWATCH_USER_SUCCESS:
            userToUser ={...(state.userToUser || {}), isWatching: false}
            return { ...state, isLoading: false, success: true, error: null, userToUser, currentAction: action.type};
        case ACTION_TYPES.UNWATCH_USER_FAILURE:
            return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};         
      
        case ACTION_TYPES.POST_COMMENT:
            return { ...state, isLoading: true, success: false, error: null , currentAction: action.type};
        case ACTION_TYPES.POST_COMMENT_SUCCESS:
            return { ...state, isLoading: false, success: true, error: null, currentAction: action.type};
        case ACTION_TYPES.POST_COMMENT_FAILURE:
            return { ...state, isLoading: false, error: 'You have already commented on this profile.', success: false, currentAction: action.type};         
              
        case ACTION_TYPES.GET_ACCEPTED_COMMENTS:
            return { ...state, isLoading: true, success: false, error: null , currentAction: action.type};
        case ACTION_TYPES.GET_ACCEPTED_COMMENTS_SUCCESS:
            return { ...state, isLoading: false, success: true, error: null, currentAction: action.type, comments: action.data.data.reviews};
        case ACTION_TYPES.GET_ACCEPTED_COMMENTS_FAILURE:
            return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};         
                
            default:
        return state;
    }
  };
  