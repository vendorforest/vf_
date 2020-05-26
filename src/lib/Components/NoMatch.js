import React from "react";
import { Alert } from "antd";
// @ts-ignore
import withStyles from "isomorphic-style-loader/withStyles";

import { Footer, Header } from "@Components/inc";

//eslin-ignore-next-line
import * as style from "./sass/index.scss";

class NoMatch extends React.Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="container-wrap">
          <Alert
            message="The page that you are looking for may have moved or is no longer available."
            description="Please try finding what you need from our homepage"
            type="error"
            showIcon
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(style)(NoMatch);
