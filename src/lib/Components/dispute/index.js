import React from "react";
import { Icon, Tabs } from "antd";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import PendingDispute from "./PendingDisputes";
import { getNotification } from "./essential";
import ClosedDispute from "./ClosedDisputes";
const { TabPane } = Tabs;

class ClientDispute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.clickTab = this.clickTab.bind(this);
  }

  clickTab(key) {
    process.env.NODE_ENV === "development" && console.log(key);
  }

  componentDidMount() {
    // this.props.getNotification();
  }

  render() {
    return (
      <div className="dispute">
        {!this.props.pendingDisputes && (
          <div className="text-center loading-small py-5">
            <Icon type="sync" spin />
          </div>
        )}
        {this.props.user && (
          <div>
            <Header/>
            <div className="content">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="shadow p-md-5 p-2">
                      <h3>Disputes</h3>
                      <hr />
                      {/* {(!this.props.job || !this.props.proposales) && this.props.pending && (
                    <div className="text-center loading-small">
                      <Icon type="sync" spin />
                    </div>
                  )} */}
                      {/* {this.props.notification && ( */}
                      <Tabs defaultActiveKey="1" onChange={this.clickTab}>
                        <TabPane tab="Pending Disputes" key="1">
                          <PendingDispute />
                        </TabPane>
                        <TabPane tab="Closed Disputes" key="2">
                          <ClosedDispute />
                        </TabPane>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ loginReducer, disputeReducer }) => {
  const { user } = loginReducer;
  const { pendingDisputes } = disputeReducer;
  return { user, pendingDisputes };
};

export default connect(
  mapStateToProps,
  {},
)(withStyles(globalStyle, localStyle)(ClientDispute));
