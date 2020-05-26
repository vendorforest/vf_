import React from "react";
import { Avatar, Slider, Icon, Tabs, message, Button } from "antd";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/withStyles";
import {Header, Footer} from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import Milestones from "./Milestones";
import AttachFiles from "./AttachFiles";
import Review from "./Review";
import { constants, getTimeFromTimezone } from "@Shared/constants";
import {
  fetchGetContractData,
  fetchUpdateContractData,
  updateContract,
  jobComplete,
} from "./essential";
import defaultProfileImage from "@Components/images/profileplace.png";

const { TabPane } = Tabs;
// const { persistor } = configureStore();
class VendorContractDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.clickTab = this.clickTab.bind(this);
    this.handlejobComplete = this.handlejobComplete.bind(this);
  }

  clickTab(key) {
    process.env.NODE_ENV === "development" && console.log(key);
  }

  handlejobComplete() {
    const params = {
      contractId: this.props.contract._id,
      title: this.props.contract.job.title,
    };
    this.fetchJobComplete(params);
  }
  async fetchJobComplete(params) {
    jobComplete(params)
      .then((data) => {
        message.success(data.message);
        window.location.href = `/vendor/givefeedback/${this.props.contract._id}`;
      })
      .catch((error) => {
        process.env.NODE_ENV === "development" && console.log(error);
        message.warning(error.message);
      });
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.fetchGetContractData({
        _id: this.props.match.params.id,
      });
    }
  }

  // UNSAFE__componentWillReceiveProps(newProps) {
  static getDerivedStateFromProps(props, state) {
    if (!state.success && props.success) {
      message.success(props.success);
    }
    if (!state.error && props.error) {
      message.error(props.error);
    }
    return {
      success: props.success,
      error: props.error,
    };
  }

  isLeftFeedBack() {
    if (this.props.contract.reviews.length === 0) {
      return false;
    }
    for (const review of this.props.contract.reviews) {
      if (review.from._id === this.props.user.userObj._id) {
        return true;
      }
    }
    return false;
  }

  render() {
    return (
      <div className="contract-details">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="content-details shadow">
                  {!this.props.contract && this.props.pending && (
                    <div className="text-center loading-small py-5">
                      <Icon type="sync" spin />
                    </div>
                  )}
                  {this.props.contract && (
                    <div>
                      <div className="head d-md-flex d-block justify-content-between align-items-center">
                        <div className="user mb-3 mb-md-0">
                          <Avatar
                            src={this.props.contract.client.profileImage || defaultProfileImage}
                            className="photo"
                          />
                          <div className="info ml-2">
                            <h6>
                              <a href="" className="text-color font-weight-bold">
                                {this.props.contract.client.username}
                              </a>
                            </h6>
                            {this.props.contract.client.bsLocation && (
                              <p className="text-grey">
                                {this.props.contract.client.bsLocation.city}/
                                {this.props.contract.client.bsLocation.country}
                              </p>
                            )}
                            {this.props.contract.client.timeZone && (
                              <p className="text-grey">
                                {getTimeFromTimezone(this.props.contract.client.timeZone)}
                              </p>
                            )}
                            {this.props.contract.status !== constants.CONTRACT_STATUS.END && (
                              <div
                                className="text-color pointer h5"
                                onClick={() => {
                                  window.location.href = "/messages/v";
                                }}
                              >
                                <Icon type="message" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-center mb-3 mb-md-0">
                          <h6 className="mb-2">{this.props.contract.job.title}</h6>
                          <Slider
                            value={this.props.contract.completedPercent}
                            className="job-progress"
                            onChange={(value) => {
                              const newContract = { ...this.props.contract };
                              newContract.completedPercent = value;
                              this.props.updateContract(newContract);
                            }}
                            onAfterChange={(value) => {
                              this.props.fetchUpdateContractData({
                                _id: this.props.contract._id,
                                completedPercent: value,
                              });
                            }}
                            disabled={
                              this.props.pending ||
                              this.props.contract.status === constants.CONTRACT_STATUS.END
                            }
                          />
                          <p className="mt-2">
                            <a
                              href={`/vendor/job/${this.props.contract.job._id}`}
                              className="text-color"
                            >
                              Job Details
                            </a>
                          </p>
                        </div>
                        <div className="text-center mb-3 mb-md-0">
                          {this.props.contract.status !== constants.CONTRACT_STATUS.END && (
                            <Button
                              style={{
                                backgroundColor: "#07b107",
                                color: "white",
                                fontWeight: "bolder",
                                height: "40px",
                              }}
                              onClick={this.handlejobComplete}
                            >
                              Job Completed
                            </Button>
                          )}
                        </div>
                        {/* <div className="status">
                          {this.props.contract.status === constants.CONTRACT_STATUS.END &&
                            !this.isLeftFeedBack() && (
                              <div>
                                <button
                                  className="button-primary"
                                  onClick={() => {
                                    this.props.history.push(
                                      `/vendor/givefeedback/${this.props.contract._id}`,
                                    );
                                  }}
                                >
                                  Leave Feedback
                                </button>
                              </div>
                            )}
                        </div> */}
                      </div>
                      <div className="main-content">
                        <Tabs defaultActiveKey="1" onChange={this.clickTab}>
                          <TabPane tab="MILESTONES & PAYMENTS" key="1">
                            <Milestones />
                          </TabPane>
                          <TabPane tab="ATTACHED FILES" key="2">
                            <AttachFiles />
                          </TabPane>
                          <TabPane tab="REVIEWS" key="3">
                            <Review />
                          </TabPane>
                        </Tabs>
                      </div>
                    </div>
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

const mapStateToProps = ({ vendorContractDetailsReducer, loginReducer, persistorReducer }) => {
  const { error, contract, success, pending } = vendorContractDetailsReducer;

  const { user } = loginReducer;

  return { error, contract, success, pending, user };
};

export default connect(mapStateToProps, {
  fetchGetContractData,
  fetchUpdateContractData,
  updateContract,
  jobComplete,
})(withStyles(globalStyle, localStyle)(VendorContractDetails));
