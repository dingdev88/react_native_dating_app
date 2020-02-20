import { applyMiddleware, createStore, compose } from 'redux';
import { persistStore } from 'redux-persist';

import middlewares from '../middlewares';
import { createLogger } from 'redux-logger';
import reducer from './reducer';

const enhancers = [
  applyMiddleware(
    ...middlewares,
    createLogger({
      collapsed: true,
      // eslint-disable-next-line no-undef
      predicate: () => __DEV__,
    }),
  ),
];

/* eslint-disable no-undef */
const composeEnhancers =
  (__DEV__ &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
/* eslint-enable no-undef */

const enhancer = composeEnhancers(...enhancers);

export const store = createStore(reducer, {}, enhancer);
export const persistor = persistStore(store);
