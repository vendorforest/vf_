import React from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";

import serialize from "serialize-javascript";

import { Provider as StyleContextProvider } from "isomorphic-style-loader/StyleContext";
require("source-map-support");

//const renderRoutes = require('react-router-config').renderRoutes;
//const PersistGate = require('redux-persist/integration/react').PersistGate;

const App = require("@Shared/App");
const routes = require("@Shared/routes");

function renderer(props) {
  const context = {};
  const { store, history, initialLocation, user } = props;
  const state = store.getState();

  const css = new Set(); // CSS for all rendered React components

  let insertCss = (...styles) =>
    styles.forEach((style) => {
      css.add(style._getCss());
    });
  //env.MODE === "development" && console.log(store, history)

  //return
  const markup = ReactDOMServer.renderToString(app);

  env.MODE === "development" &&
    console.log(initialLocation.pathname, history.location.pathname);

  if (initialLocation.pathname !== history.location.pathname) {
    response.status(302).setHeader("Location", history.location.pathname);
    response.end();
    return;
  }

  return {
    jsx,
    reactHtml: markup,
  };
}

export default renderer;
