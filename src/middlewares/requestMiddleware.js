import { AsyncStorage } from 'react-native';

export default function requestMiddleware() {
  return (next) => (action) => {
    const { request, type, retryAction, ...rest } = action;

    if (!request) return next(action);

    const REQUEST = type;
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;

    const UNAUTHORIZED = 'AUTH_UNAUTHORIZED';
    const TERMINATED = 'AUTH_TERMINATED';

    next({ ...rest, type: REQUEST, isLoading: true });

    AsyncStorage.getItem('auth')
      .then((authString) => {
        const auth = JSON.parse(authString);

        const defaults = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'token': auth ? `${auth.token}` : '',
          },
        };

        return fetch(request.url, { ...defaults, ...request })
          .then((res) => {
            console.log('Reponse', res);
            if (res.status === 204) {
              next({ ...rest, type: SUCCESS, isLoading: false });
            } else if (res.ok) {
              return res.json().then((data) => {
                if(data.success) {
                  next({ ...rest, data, type: SUCCESS, isLoading: false })
                }else {
                  next({ ...rest, type: FAILURE, lastAction: action, isLoading: false, message: data.message });
                }
              });
            } else if (res.status === 401) {
              next({ ...rest, type: FAILURE, lastAction: action, isLoading: false });
              next({ ...rest, type: UNAUTHORIZED, lastAction: action });
            } else if (res.status === 430) {
              next({ ...rest, type: FAILURE, lastAction: action, isLoading: false });
              next({ ...rest, type: TERMINATED, lastAction: action });
            } else {
           
              next({ ...rest, type: FAILURE, lastAction: action, isLoading: false });
            }
          })
          .catch((error) => {
            next({ ...rest, error, type: FAILURE });
            console.log('MIDDLE WARE REQUEST ERROR', error);

            return false;
          });
      })
      .catch((err) => {
        console.log('UNAUTHORIZED', err.message);
      });
  };
}
