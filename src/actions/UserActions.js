import { api } from '../config';
import * as ACTION_TYPES from './ActionTypes';
import { AsyncStorage } from 'react-native';

export function refreshUsers(flag) {
  return {
    type: ACTION_TYPES.REFRESH_USERS,
    refreshUsers: flag
  }
}

export function updateFilter(filters) {
  return {
    type: ACTION_TYPES.UPDATE_FILTER,
    filters: filters
  }
}

export function resetFilter(){
  return {
    type: ACTION_TYPES.RESET_FILTER,
  }
}

export function enableFilter(enabled) {
  return {
    type: ACTION_TYPES.ENABLE_FILTER,
    filteron: enabled
  }
}

export function enableOnline(enabled){
  return{
    type: ACTION_TYPES.ENABLE_ONLINE,
    online: enabled
  }
}

export function enableEye(enabled) {
  return{
    type: ACTION_TYPES.ENABLE_EYE,
    eyeon: enabled
  }
}


export function enableLocation(enabled) {
  return{
    type: ACTION_TYPES.ENABLE_LOCATION,
    locationon: enabled
  }
}

export function search(data) {

  let params = {
    id : data.id,
    limit : data.limit,
    query: data.query,
    offset : data.offset
  }
  
  return {
    type: ACTION_TYPES.SEARCH_USERS,
    request: {
      url: `${api.baseURL}/api/user/${params.id}/search?username=${params.query}&limit=${params.limit}&offset=${params.offset}`,
    }
    
  }
} 
export function emptySearch() {
  return {
    type: ACTION_TYPES.EMPTY_SEARCH
  }
}

export function  getNearByUsers(data) {

    let params = {
        id : data.id,
        limit : data.limit,
        offset : data.offset,
        online: data.online
    }
    return {
      type: ACTION_TYPES.GET_NEARBY_USERS,
      request: {
        url: `${api.baseURL}/api/user/${params.id}/nearbyUsers/limit/${params.limit}/offset/${params.offset}/online/${params.online}`,
      },
    }
}


export function getTopUsers(data) {
  console.log("Action-getTopUsers");
  let params = {
      id : data.id,
      limit : data.limit,
      offset : data.offset
  }
  return {
      type: ACTION_TYPES.GET_TOP_USERS,
      request: {
        url: `${api.baseURL}/api/user/${params.id}/top/limit/${params.limit}/offset/${params.offset}`,
      },
    }
} 

export function getNewUsers(data) {
    console.log("Action-getNewUsers");
    let params = {
        id : data.id,
        limit : data.limit,
        offset : data.offset
    }
    return {
        type: ACTION_TYPES.GET_NEW_USERS,
        request: {
          url: `${api.baseURL}/api/user/${params.id}/newUsers/limit/${params.limit}/offset/${params.offset}`,
        },
      }
} 
  

export function getWatchList(data) {
    console.log("Action-getWatchList");
    let params = {
        id : data.id,
        limit : data.limit, 
        offset : data.offset,
        online: data.online
    }
    return {
        type: ACTION_TYPES.GET_WATCHLIST_USERS,
        request: {
          url: `${api.baseURL}/api/user/${params.id}/watchlist/limit/${params.limit}/offset/${params.offset}/online/${params.online}`,
        },
      }
}


export function getFilterUsers(data, filterSettings) {
    console.log("Action-getFilterUsers");
    let params = {
        id : data.id,
        limit : data.limit, 
        offset : data.offset,
        online: data.online
    }
    return {
        type: ACTION_TYPES.GET_FILTER_USERS,
        request: {
          url: `${api.baseURL}/api/user/${params.id}/filter/limit/${params.limit}/offset/${params.offset}/online/${params.online}`,
          method: 'post',
          body: JSON.stringify(filterSettings)
        },
      }
}

export function setFlag(name, value) {
  switch(name) {
    case 'searchon':
      return { type: ACTION_TYPES.USERS_SET_FLAG, data: {searchon: value}}
    case  'locationon':
      return { type: ACTION_TYPES.USERS_SET_FLAG, data: {locationon: value}}
    case  'eyeon':
      return { type: ACTION_TYPES.USERS_SET_FLAG, data: {eyeon: value}}
    case  'filteron':
          return { type: ACTION_TYPES.USERS_SET_FLAG, data: {filteron: value}}
    default: 
          return { type: ACTION_TYPES.USERS_SET_FLAG, data: {}}
  }

}


export function changeLocation(data) {
  let params = {
      id : data.id,
      locationX : data.longitude, 
      locationY : data.latitude,
  }
  console.log("change Location", params);
  return {
      type: ACTION_TYPES.CHANGE_LOCATION,
      request: {
        url: `${api.baseURL}/api/user/${params.id}/location`,
        method: 'post',
        body: JSON.stringify(params)
      },
    }
}



