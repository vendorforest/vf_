import React from "react";
import { Icon, Button, Tabs } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import { connect } from "react-redux";

import { Header, Footer } from "@Components/inc";
import VendorHow from "./HowItWorksVendors";
import ClientHow from "./HowItWorksClients";
import styles from "./index.scss";

const { TabPane } = Tabs;
class HowItWorks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Header />
        <div className="container" style={{ padding: "20px 0px" }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="I want to hire" key="1">
              <ClientHow />
            </TabPane>
            <TabPane tab="I want to find jobs" key="2">
              <VendorHow />
            </TabPane>
          </Tabs>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ homeReducer, loginReducer }) => {
  const { error, homedata, success, pending } = homeReducer;

  const { user } = loginReducer;

  return { error, homedata, success, pending, user };
};

export default connect(mapStateToProps, {})(withStyles(styles)(HowItWorks));
