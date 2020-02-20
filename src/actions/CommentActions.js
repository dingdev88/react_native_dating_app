import { api } from '../config';
import * as ACTION_TYPES from './ActionTypes';

export function postComment(fromUserId, toUserId, comment) {
    let body = {
        review: comment
    }
    return {
        type: ACTION_TYPES.POST_COMMENT,
        request: {
          url: `${api.baseURL}/api/review/${fromUserId}/submit/${toUserId}`,
          method: 'post',
          body: JSON.stringify(body)
        }, 
      } 
}

export function confirmComment(fromUserId, toUserId, approved) {
    let body = {
        isAccepted: approved? "true" : "false"
    }
    return {
        type: ACTION_TYPES.CONFIRM_COMMENT,
        request: {
          url: `${api.baseURL}/api/review/${fromUserId}/confirm/${toUserId}`,
          method: 'post',
          body: JSON.stringify(body)
        },
    
    } 
}

export function getAcceptedComments(userId) {
    return {
        type: ACTION_TYPES.GET_ACCEPTED_COMMENTS,
        request: {
          url: `${api.baseURL}/api/review/${userId}/acceptedReviews`

        },
        userId
        
    } 
}