import React from "react";
import { Icon, Tabs } from "antd";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import AllNotifications from "./AllNotifications";
import { getNotification } from "./essential";
import DeletedNotifications from "./DeletedNotifications";
const { TabPane } = Tabs;

class ClientJobDetails extends React.Component {
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
      <div className="job-details">
        {/* {!this.props.notification && (
          <div className="text-center loading-small py-5">
            <Icon type="sync" spin />
          </div>
        )} */}
        {this.props.user && (
          <div>
            <Header/>
            <div className="content">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="shadow p-md-5 p-2">
                      <h3>Notifications</h3>
                      <hr />
                      {/* {(!this.props.job || !this.props.proposales) && this.props.pending && (
                    <div className="text-center loading-small">
                      <Icon type="sync" spin />
                    </div>
                  )} */}
                      {/* {this.props.notification && ( */}
                      <Tabs defaultActiveKey="1" onChange={this.clickTab}>
                        <TabPane tab="All Notifications" key="1">
                          <AllNotifications />
                        </TabPane>
                        <TabPane tab="Deleted Notifications" key="2">
                          <DeletedNotifications />
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

const mapStateToProps = ({ notificationReducer, loginReducer }) => {
  const { user } = loginReducer;
  const { notification, error, pending, success } = notificationReducer;
  return { error, notification, success, pending, user };
};

export default connect(
  mapStateToProps,
  {},
)(withStyles(globalStyle, localStyle)(ClientJobDetails));
