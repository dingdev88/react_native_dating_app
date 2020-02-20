import * as ACTION_TYPES from '../actions/ActionTypes';

const INITIAL_STATE = {
  isLoading: false,
  success: false,
  error: null,
  user: null,
  token: null,
  gallery: [],
  settings: {},
  currentAction: null,
  currentLocation: {},
  blocklist: [],
  comments: [],
  activated: true,
  credential: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.LOGIN:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.LOGIN_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, user: action.auth.user, 
                  token: action.auth.token, currentAction: action.type, 
                  activated: !(action.auth.user.isDeactivated), credential: action.credential };
    case ACTION_TYPES.LOGIN_FAILURE:
      return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type };
    case ACTION_TYPES.SIGNUP:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type, credential: action.credential };
    case ACTION_TYPES.SIGNUP_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, 
              user: action.auth.user, token: action.auth.token, 
              currentAction: action.type, credential: action.credential };
    case ACTION_TYPES.SIGNUP_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type };
    
    case ACTION_TYPES.FORGOT_PASSWORD:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.FORGOT_PASSWORD_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, currentAction: action.type };
    case ACTION_TYPES.FORGOT_PASSWORD_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type };

    
    
    case ACTION_TYPES.LOAD_PROFILE:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.LOAD_PROFILE_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, user: action.data.data.user, currentAction: action.type, activated: !(action.data.data.user.isDeactivated) };
    case ACTION_TYPES.LOAD_PROFILE_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type };

    case ACTION_TYPES.LOAD_MY_BLOCK:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.LOAD_MY_BLOCK_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, blocklist: action.data.data.blocklist, currentAction: action.type };
    case ACTION_TYPES.LOAD_MY_BLOCK_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type };
      

    case ACTION_TYPES.GET_MY_GALLERY:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.GET_MY_GALLERY_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, gallery: action.data.data.gallery, currentAction: action.type };
    case ACTION_TYPES.GET_MY_GALLERY_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type };

    case ACTION_TYPES.UPDATE_PROFILE_IMAGE:
        return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.UPDATE_PROFILE_IMAGE_SUCCESS:
      let user = state.user;
      user.smallImageUrl = action.data.data.profilePicture.smallImageUrl;
      user.bigImageUrl = action.data.data.profilePicture.bigImageUrl;
      return { ...state, isLoading: false, success: true, error: null, user: user, currentAction: action.type };
    case ACTION_TYPES.UPDATE_PROFILE_IMAGE_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type };

    case ACTION_TYPES.UPDATE_PROFILE:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.UPDATE_PROFILE_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, user: action.data.data.user, currentAction: action.type };
    case ACTION_TYPES.UPDATE_PROFILE_FAILURE:
        return { ...state, isLoading: false, error: action.message, success: false, currentAction: action.type };

    case ACTION_TYPES.UPDATE_EMAIL:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.UPDATE_EMAIL_SUCCESS:
      let euser = state.user;
      euser.email = action.email;
      return { ...state, isLoading: false, success: true, error: null, currentAction: action.type,  user: euser};
    case ACTION_TYPES.UPDATE_EMAIL_FAILURE:
      return { ...state, isLoading: false, error: 'The email is already exist!', success: false, currentAction: action.type }
    
    case ACTION_TYPES.UPDATE_PASSWORD:
        return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.UPDATE_PASSWORD_SUCCESS:
        return { ...state, isLoading: false, success: true, error: null, currentAction: action.type};
    case ACTION_TYPES.UPDATE_PASSWORD_FAILURE:
      return { ...state, isLoading: false, error: 'The password is invalid!', success: false, currentAction: action.type }
  

    case ACTION_TYPES.GET_MY_ACCEPTED_COMMENTS:
        return { ...state, isLoading: true, success: false, error: null , currentAction: action.type};
    case ACTION_TYPES.GET_MY_ACCEPTED_COMMENTS_SUCCESS:
        return { ...state, isLoading: false, success: true, error: null, currentAction: action.type, comments: action.data.data.reviews, userId: action.userId};
    case ACTION_TYPES.GET_MY_ACCEPTED_COMMENTS_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};         
    
    case ACTION_TYPES.DELETE_MY_COMMENT:
        return { ...state, isLoading: true, success: false, error: null , currentAction: action.type};
    case ACTION_TYPES.DELETE_MY_COMMENT_SUCCESS:
        let newReviews = []
        state.comments.map(review => {
          if(review.id != action.reviewId)
            newReviews.push(review) ;
        })
        return { ...state, isLoading: false, success: true, error: null, currentAction: action.type, comments: newReviews, userId: action.userId};
    case ACTION_TYPES.DELETE_MY_COMMENT_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};         
    
    case ACTION_TYPES.REPORT_USER_COMMENT:
        return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.REPORT_USER_COMMENT_SUCCESS:
        return { ...state, isLoading: false, success: true, error: null, currentAction: action.type};
    case ACTION_TYPES.REPORT_USER_COMMENT_FAILURE:
        return { ...state, isLoading: false, error: action.message ? action.message : null, success: false, currentAction: action.type};
            
    case ACTION_TYPES.DEACTIVATE_ACCOUNT:
        return { ...state, isLoading: false, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.DEACTIVATE_ACCOUNT_SUCCESS:
        return { ...state, isLoading: false, success: true, error: null, currentAction: action.type, activated: false};
    case ACTION_TYPES.DEACTIVATE_ACCOUNT_FAILURE:
        return { ...state, isLoading: false, error: 'Invalid password.', success: false, currentAction: action.type};

    case ACTION_TYPES.REACTIVATE_ACCOUNT:
        return { ...state, isLoading: false, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.REACTIVATE_ACCOUNT_SUCCESS:
        return { ...state, isLoading: false, success: true, error: null, currentAction: action.type, activated: true};
    case ACTION_TYPES.REACTIVATE_ACCOUNT_FAILURE:
        return { ...state, isLoading: false, error: action.message ? action.message : null, success: false, currentAction: action.type};

    case ACTION_TYPES.DELETE_ACCOUNT:
        return { ...state, isLoading: false, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.DELETE_ACCOUNT_SUCCESS:
        return INITIAL_STATE;
    case ACTION_TYPES.DELETE_ACCOUNT_FAILURE:
        return { ...state, isLoading: false, error: 'No such account exist.', success: false, currentAction: action.type};
  

    case ACTION_TYPES.UPDATE_SETTINGS:
      return { ...state, settings: action.settings, currentAction: action.type}

    case ACTION_TYPES.SAVE_CURRENT_LOCATION:
      return {...state, currentLocation: action.location}
    case ACTION_TYPES.LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};
