import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import {Header, Footer} from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { Tabs } from "antd";

import ActiveProposales from "./ActiveProposales";
import PastProposales from "./PastProposales";
import SubmittedPropales from "./SubmittedPropales";
import PendingContracts from "./PendingContracts";
import PastContracts from "./PastContracts";
const { TabPane } = Tabs;

class VendorDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.clickTab = this.clickTab.bind(this);
  }

  clickTab(key) {
    process.env.NODE_ENV === "development" && console.log(key);
  }

  render() {
    return (
      <div className="vendor-dashboard">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <Tabs defaultActiveKey="1" onChange={this.clickTab}>
                  <TabPane tab="PROPOSALS" key="1">
                    <div className="row">
                      <div className="col-12 mb-md-4 mb-3">
                        <ActiveProposales />
                      </div>
                      <div className="col-12 mb-md-4 mb-3">
                        <SubmittedPropales />
                      </div>
                      <div className="col-12 mb-md-4 mb-3">
                        <PastProposales />
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="CONTRACTS" key="2">
                    <div className="row">
                      <div className="col-12 mb-md-4 mb-3">
                        <PendingContracts />
                      </div>
                      <div className="col-12 mb-md-4 mb-3">
                        <PastContracts />
                      </div>
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(globalStyle, localStyle)(VendorDashboard);
