import * as ACTION_TYPES from '../actions/ActionTypes';

const INITIAL_STATE = {
  isLoading: false,
  success: false,
  error: null,
  newUsers: [],
  topUsers: [],
  users: [],
  searchUsers: [],
  searchon: false,
  locationon: false,
  eyeon: false,
  online: false,
  filteron: false,
  refreshUsers: false,
  filters: {},
  currentAction: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.GET_NEARBY_USERS:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.GET_NEARBY_USERS_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, users: action.data.data.users, currentAction: action.type };
    case ACTION_TYPES.GET_NEARBY_USERS_FAILURE:
      return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type };

    case ACTION_TYPES.GET_NEW_USERS:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.GET_NEW_USERS_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, newUsers: action.data.data.users, currentAction: action.type };
    case ACTION_TYPES.GET_NEW_USERS_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};

    case ACTION_TYPES.GET_TOP_USERS:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.GET_TOP_USERS_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, topUsers: action.data.data.users, currentAction: action.type };
    case ACTION_TYPES.GET_TOP_USERS_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};

    case ACTION_TYPES.CHANGE_LOCATION:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.CHANGE_LOCATION_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, currentAction: action.type};
    case ACTION_TYPES.CHANGE_LOCATION_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};

    case ACTION_TYPES.GET_WATCHLIST_USERS:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.GET_WATCHLIST_USERS_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, users: action.data.data.users, currentAction: action.type };
    case ACTION_TYPES.GET_WATCHLIST_USERS_FAILURE:
        return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};

    case ACTION_TYPES.GET_FILTER_USERS:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.GET_FILTER_USERS_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, users: action.data.data.users, currentAction: action.type  };
    case ACTION_TYPES.GET_FILTER_USERS_FAILURE:
      return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};
    
    case ACTION_TYPES.SEARCH_USERS:
      return { ...state, isLoading: true, success: false, error: null, currentAction: action.type };
    case ACTION_TYPES.SEARCH_USERS_SUCCESS:
      return { ...state, isLoading: false, success: true, error: null, searchUsers: action.data.data.users, currentAction: action.type  };
    case ACTION_TYPES.SEARCH_USERS_FAILURE:
      return { ...state, isLoading: false, error: 'An error occured', success: false, currentAction: action.type};

    case ACTION_TYPES.USERS_SET_FLAG:
      return {...state, ...action.data, currentAction: action.type}

    case ACTION_TYPES.EMPTY_SEARCH: 
      return {...state, searchUsers: [], currentAction: action.type}
    case ACTION_TYPES.ENABLE_FILTER:
        return {...state, eyeon: false, filteron: action.filteron, locationon: false, refreshUsers: true, currentAction: action.type}
    case ACTION_TYPES.ENABLE_EYE:
        return {...state, eyeon: action.eyeon, filteron: false, locationon: false, refreshUsers: true, currentAction: action.type}
    case ACTION_TYPES.ENABLE_LOCATION:
      return {...state, locationon: action.locationon, eyeon: false, filteron: false, currentAction: action.type}
    case ACTION_TYPES.UPDATE_FILTER:
      let filter = { ...state.filters, ...action.filters  }
      return {...state, filters: filter, currentAction: action.type}
    case ACTION_TYPES.RESET_FILTER:
      return {...state, filters: {}, currentAction: action.type}
    case ACTION_TYPES.ENABLE_ONLINE:
      return {...state, online: action.online, searchon: false, refreshUsers: true, currentAction: action.type}
    case ACTION_TYPES.REFRESH_USERS:
      return {...state, refreshUsers: action.refreshUsers , currentAction: action.type}

    default:
      return state;
  }
};
