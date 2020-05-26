import React from "react";
import { Icon, Tabs } from "antd";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import JobContent from "./JobContent";
import Proposals from "./Proposals";
import InvitedProposals from "./Invited";
import InvitedNotApplied from "./InvitedNotApplied";
import Hired from "./Hired";
import { fetchGetJobData, fetchGetProposalesData } from "./essential";
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
    this.props.fetchGetJobData({
      _id: this.props.match.params.id,
    });
    this.props.fetchGetProposalesData({
      job: this.props.match.params.id,
    });
  }

  getInvitedProposalCount() {
    if (this.props.job && this.props.proposales) {
      return this.props.proposales.filter((proposal) => {
        return (
          this.props.job.invitedVendors.findIndex((user) => user._id === proposal.vendor._id) >
          -1
        );
      }).length;
    }
    return 0;
  }

  render() {
    if (this.props.job) {
      process.env.NODE_ENV === "development" &&
        console.log("hirevendors", this.props.job.hiredVendors);
    }
    return (
      <div className="job-details">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="shadow p-md-5 p-2">
                  {(!this.props.job || !this.props.proposales) && this.props.pending && (
                    <div className="text-center loading-small">
                      <Icon type="sync" spin />
                    </div>
                  )}
                  {this.props.job && this.props.proposales && (
                    <Tabs defaultActiveKey="1" onChange={this.clickTab}>
                      <TabPane tab="VIEW JOB POST" key="1">
                        <JobContent />
                      </TabPane>
                      <TabPane
                        tab={`REVIEW PROPOSALS (${this.props.job.proposales.length})`}
                        key="2"
                      >
                        <Proposals />
                      </TabPane>
                      <TabPane
                        tab={`INIVTED VENDORS (${this.getInvitedProposalCount()})`}
                        key="3"
                      >
                        <InvitedProposals />
                      </TabPane>
                      <TabPane tab={`HIRE (${this.props.job.hiredVendors.length})`} key="4">
                        <Hired />
                      </TabPane>
                      <TabPane
                        tab={`INIVTED - NOT APPLIED (${this.props.job.invitedVendors.length -
                          this.getInvitedProposalCount()})`}
                        key="5"
                      >
                        <InvitedNotApplied />
                      </TabPane>
                    </Tabs>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ clientJobDetailsReducer, loginReducer }) => {
  const { error, job, proposales, success, pending } = clientJobDetailsReducer;

  const { user } = loginReducer;

  return { error, job, proposales, success, pending, user };
};

export default connect(mapStateToProps, {
  fetchGetJobData,
  fetchGetProposalesData,
})(withStyles(globalStyle, localStyle)(ClientJobDetails));
