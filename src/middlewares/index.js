import request from './requestMiddleware';
import requestFormUrlEncode from './requestFormUrlEncodeMiddleware';
import thunk from 'redux-thunk';

export default [ request, requestFormUrlEncode, thunk ];