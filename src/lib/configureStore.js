import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
// import { createLogger } from "redux-logger";
import { persistStore } from "redux-persist";

import appReducer from "./rootReducer";

// const loggerMiddleware = createLogger();
const middleware = [thunk];
// const isSSR = typeof window === "undefined";

const composeEnhancers =
  // @ts-ignore
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));

// const INITIAL_STATE = {};

const rootReducer = (state, action) => {
  // const _state = () => {
  //   switch (action.type) {
  //     case PURGE:
  //       return INITIAL_STATE;
  //     case "USER_LOGOUT":
  //       return undefined;
  //     default:
  //       return state;
  //   }
  // };

  // state = _state();

  return appReducer(state, action);
};

export default (initalState) => {
  let store = createStore(rootReducer /* preloadstate */, undefined, enhancer);
  const persistor = persistStore(store, null, () => {
    store.getState(); //to get restoredState
  });

  return {
    store,
    persistor,
  };
};
