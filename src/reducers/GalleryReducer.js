import * as ACTION_TYPES from '../actions/ActionTypes';


const INITIAL_STATE = {
  isLoading: false,
  success: false,
  error: null,
  gallery: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.GET_GALLERY:
      return { ...state, isLoading: true, success: false, error: null };
    case ACTION_TYPES.GET_GALLERY_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, gallery: action.data.data.gallery};
    case ACTION_TYPES.GET_GALLERY_FAILURE:
      return { ...state, isLoading: false, error: 'An error occured', success: false };

    case ACTION_TYPES.ADD_IMAGE_GALLERY:
      return { ...state, isLoading: true, success: false, error: null };
    case ACTION_TYPES.ADD_IMAGE_GALLERY_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, gallery: action.data.gallery };
    case ACTION_TYPES.ADD_IMAGE_GALLERY_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false };

    case ACTION_TYPES.DELETE_IMAGE_GALLERY:
        return { ...state, isLoading: true, success: false, error: null };
    case ACTION_TYPES.DELETE_IMAGE_GALLERY_SUCCESS:
        return { ...state, isLoading: false, success: true, error: null, gallery: action.data.data.gallery };
    case ACTION_TYPES.DELETE_IMAGE_GALLERY_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false };
    default:
      return state;
  }
};
