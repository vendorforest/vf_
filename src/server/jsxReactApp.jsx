import React from "react";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom";
import StyleContext from "isomorphic-style-loader/StyleContext";
// import { persistStore } from "redux-persist";
// import { PersistGate } from "redux-persist/integration/react";

import App from "@Shared/App";

const SSR = (url, store, context, insertCss) => {
  // const persistor = persistStore(store);
  return (
    <Provider store={store}>
      <StyleContext.Provider value={{ insertCss }}>
        <StaticRouter location={url} context={context}>
          <App />
        </StaticRouter>
      </StyleContext.Provider>
    </Provider>
  );
};

export default SSR;
