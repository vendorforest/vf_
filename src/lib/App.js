import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import withStyles from "isomorphic-style-loader/withStyles";

import styles from "@Sass/index.scss";
import Routes from "./routes";

export function withRouterWorkaround(Inner) {
  const Wrapped = (props) => <Inner {...props} />;
  Wrapped.displayName = `WithRouterWorkaround(${Inner.displayName || Inner.name || "?"})`;
  return withRouter(Wrapped);
}

const App = (props) => (
  <Switch>
    {Routes.map((route, i) => (
      <Route
        key={route.path}
        path={route.path}
        {...props}
        // component={route.component}
        exact={route.exact !== false}
        strict
      >
        {withRouterWorkaround(route.component)}
      </Route>
    ))}
  </Switch>
);

const AppWithStyles = withStyles(styles)(App);

export default withRouter(AppWithStyles);
