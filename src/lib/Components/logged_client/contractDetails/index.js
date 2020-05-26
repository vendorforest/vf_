import React from "react";
import {
  Avatar,
  Progress,
  Icon,
  Tabs,
  message,
  Modal,
  Radio,
  Form,
  Input,
  Divider,
  InputNumber,
  Button,
  Select,
  Checkbox,
} from "antd";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/withStyles";
import {Header, Footer} from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import Milestones from "./Milestones";
import AttachFiles from "./AttachFiles";
import Review from "./Review";
import moment from "moment";
import { constants, getTimeFromTimezone } from "@Shared/constants";
import {
  fetchUpdateContractData,
  fetchEndContractData,
  fetchGetContractData,
  fetchSavingDispute,
  fetchDispute,
  fetchRleaseMilestoneData,
} from "./essential";
import defaultProfileImage from "@Components/images/profileplace.png";
import value from "@Components/images/profileplace.png";
const { TabPane } = Tabs;
const { TextArea } = Input;
const firebase = require("firebase/app");
class ClientContractDetails extends React.Component {
  _button = -1;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      radioStatus: 0,
      show: false,
      btnPending: false,
      contractModal: false,
      selectedJob: -1,
    };
    this.clickTab = this.clickTab.bind(this);
    this.createNewMilestone = this.createNewMilestone.bind(this);
    this.endContract = this.endContract.bind(this);
    this.handleDispute = this.handleDispute.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handlSubmitDispute = this.handlSubmitDispute.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleContract = this.handleContract.bind(this);
  }

  clickTab(key) {
    process.env.NODE_ENV === "development" && console.log(key);
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.fetchGetContractData({
        _id: this.props.match.params.id,
      });
      fetchDispute({
        contractId: this.props.match.params.id,
      }).then((result) => {
        const count = result.value;
        if (count > 0) {
          this.setState({
            btnPending: true,
          });
        }
      });
    }
  }

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

  createNewMilestone() {
    window.location.href = `/client/hire/${this.props.contract.job._id}&${this.props.contract.vendor._id}`;
    // this._button = 0;
    // if (this.props.match.params.id) {
    //   this.props.fetchUpdateContractData({
    //     _id: this.props.match.params.id,
    //     completedPercent: 100,
    //   });
    // }
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
  toggle() {
    this.setState({
      contractModal: !this.state.contractModal,
    });
  }
  handleDispute() {
    this.setState({
      visible: true,
    });
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  handleContract() {
    if (this.state.selectedJob !== 0) {
      message.info('Please select "Job Completed" option to close the contract.');
      return;
    }
    if (this.props.match.params.id) {
      // const { contract } = this.props;
      // const docKey = [contract.client.email, contract.vendor.email].sort().join(":");
      // firebase
      //   .firestore()
      //   .collection("chats")
      //   .doc(docKey)
      //   .update({
      //     contract: 1,
      //   });
      const params = {
        _id: this.props.match.params.id,
      };
      this.EndContractData(params);
    }
  }
  handlSubmitDispute() {
    this.props.form.validateFields(["price", "description"], (errors, values) => {
      if (errors) {
        message.warning("Invalid Input. Description is required!");
      } else {
        if (values.price > this.props.contract.escrowPrice) {
          message.warning("Your inputed price is higher than the deposited price.");
        } else {
          const params = {
            ...values,
            contractId: this.props.contract._id,
            clientId: this.props.contract.client._id,
            vendorId: this.props.contract.vendor._id,
            title: this.props.contract.job.title,
          };
          this.saveDispute(params);
        }
      }
    });
    this.setState({
      visible: false,
    });
  }

  async saveDispute(params) {
    fetchSavingDispute(params)
      .then((result) => {
        const queue = result.queue;
        this.setState({
          btnPending: true,
        });
        this.info(queue);
      })
      .catch((error) => {
        message.warning(error.message);
      });
  }

  endContract() {
    const milestoneLength = this.props.milestones.length;
    if (milestoneLength > 0) {
      for (var i = 0; i < milestoneLength; i++) {
        if (this.props.milestones[i].status === constants.MILESTONE_STATUS.CREATED) {
          return message.warn('Please release all milestones')
        }
      }
    }
    this._button = 1;
    this.setState({
      contractModal: !this.state.contractModal,
    });
  }

  info = (queue) => {
    Modal.info({
      title: "Dispute infomation has been deliverd successfully.",
      content: (
        <div>
          <p style={{ paddingBottom: "20px" }}>
            Thank you for filling this dispute form, we will also send a copy of this message to
            the vendor concerned.{" "}
          </p>
          <p style={{ fontWeight: "bolder" }}>Waiting # {queue}</p>
          <p style={{ paddingTop: "20px" }}>
            Someone in our team will get back to you as soon as they can.
          </p>
        </div>
      ),
      width: "50%",
      onOk() {},
    });
  };

  async EndContractData(params) {
    fetchEndContractData(params).then((data) => {
      console.log(data)
        message.success(data.message);
        this.setState({
          contractModal: !this.state.contractModal,
        });
        window.location.href = `/client/givefeedback/${data.contract._id}`;
      })
      .catch((error) => {
        message.warning(error.message);
      });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    console.log("contract detail === ", this.props.contract);
    const generateMilestone = () => {
      return this.props.milestones.map((milestone, index) => {
        // if (milestone.status !== constants.MILESTONE_STATUS.RELEASED) {
        return (
          <div key={index} className="row">
            <div className="col-sm-6">
              {index + 1}. {milestone.description}
            </div>
            <div className="col-sm-6" style={{ textAlign: "right" }}>
              {this.props.pending && <Icon type="sync" spin className="mr-2 text-success" />}${" "}
              {milestone.price}
              {milestone.status === constants.MILESTONE_STATUS.RELEASED && (
                <span>
                  <p>{moment(milestone.createdAt).format("YYYY-MM-DD HH:mm A")}</p>
                  <p>Payment Completed</p>
                </span>
              )}
            </div>
          </div>
        );
        // }
      });
    };
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
                            src={this.props.contract.vendor.profileImage || defaultProfileImage}
                            className="photo"
                          />
                          <div className="info ml-2">
                            <h6>
                              <a href="#/" className="text-color font-weight-bold">
                                {this.props.contract.vendor.username}
                              </a>
                            </h6>
                            {this.props.contract.proposal.bidType !== 0 && (
                              <p style={{ color: "red" }}>Team</p>
                            )}
                            <p className="text-grey">
                              {this.props.contract.vendor.bsLocation
                                ? `${this.props.contract.vendor.bsLocation.city} / ${this.props.contract.vendor.bsLocation.country}`
                                : "NONE"}
                            </p>
                            <p className="text-grey">
                              {this.props.contract.vendor.timeZone
                                ? getTimeFromTimezone(this.props.contract.vendor.timeZone)
                                : "NONE"}
                            </p>
                            {this.props.contract.status !== constants.CONTRACT_STATUS.END && (
                              <div
                                className="text-color pointer h5"
                                onClick={() => {
                                  window.location.href = "/messages/c";
                                }}
                              >
                                <Icon type="message" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-center mb-3 mb-md-0">
                          <h6 className="mb-2">{this.props.contract.job.title}</h6>
                          <Progress
                            percent={this.props.contract.completedPercent}
                            size="small"
                            status="active"
                            className="job-progress"
                          />
                          <p className="mt-2">
                            <a
                              href={`/client/job/${this.props.contract.job._id}`}
                              className="text-color"
                            >
                              Job Details
                            </a>
                          </p>
                        </div>
                        <div className="status">
                          {this.props.contract.status !== constants.CONTRACT_STATUS.END &&
                            !this.isLeftFeedBack() && (
                              <div>
                                <button
                                  className={`button-primary`}
                                  style={{ width: "200px" }}
                                  onClick={this.createNewMilestone}
                                >
                                  Create New Milestone
                                </button>
                              </div>
                            )}
                          {this.props.contract.status !== constants.CONTRACT_STATUS.END &&
                            !this.isLeftFeedBack() && (
                              <div>
                                <button
                                  className={
                                    this.state.btnPending === true
                                      ? `button-primary disable`
                                      : "button-primary"
                                  }
                                  style={{ width: "200px" }}
                                  onClick={
                                    this.state.btnPending !== true
                                      ? this.handleDispute
                                      : undefined
                                  }
                                >
                                  Dispute
                                </button>
                              </div>
                            )}
                          {this.props.contract.status === constants.CONTRACT_STATUS.CREATED && (
                            <div>
                              <button
                                className={`button-white ${
                                  this._button === 1 && this.props.pending ? "disable" : ""
                                }`}
                                style={{ width: "200px" }}
                                onClick={this.endContract}
                              >
                                End Contract
                              </button>
                            </div>
                          )}
                        </div>
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
        <Modal
          title="Dispute"
          visible={this.state.visible}
          onOk={this.handlSubmitDispute}
          onCancel={this.handleCancel}
          width={"90%"}
          okText="Submit"
        >
          {this.props.contract && (
            <div className="container">
              <div className="row">
                <div className="col-md-8">
                  <div className="row modalRow">
                    <div className="col-md-12">
                      <h5>Job Title</h5>
                    </div>

                    <div className="col-md-12">
                      <p>{this.props.contract.job.title}</p>
                    </div>
                  </div>
                  <div className="row modalRow">
                    <div className="col-md-12">
                      <h5>Refund requested</h5>
                    </div>

                    <div className="col-md-12">
                      <Radio.Group
                        onChange={(e) => {
                          this.setState({
                            radioStatus: e.target.value,
                          });
                        }}
                        value={this.state.radioStatus}
                        style={{ paddingTop: "10px" }}
                      >
                        <Radio
                          value={0}
                          className="d-block mb-3"
                          defaultChecked
                          onChange={() => {
                            this.setState({ show: false });
                          }}
                        >
                          Deposit for the whole project (${this.props.contract.escrowPrice})
                        </Radio>
                        <Radio
                          value={1}
                          className="d-block mb-3"
                          onClick={() => {
                            this.setState({ show: true });
                          }}
                        >
                          Deposit a lesser amount to cover the first milestone
                        </Radio>
                      </Radio.Group>
                    </div>
                    <div
                      className={
                        this.state.show !== false
                          ? "col-md-s show-amount"
                          : "col-md-s hide-amount"
                      }
                    >
                      <Form>
                        <Form.Item label="Price">
                          {getFieldDecorator("price", {
                            initialValue: this.props.contract.escrowPrice,
                            rules: [{ required: true, message: "Price of a milestone" }],
                          })(
                            <InputNumber
                              placeholder="Price of a milestone"
                              size={"large"}
                              min={1}
                              // max={this.props.contract.escrowPrice}
                              formatter={(value) =>
                                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                              className="w-100"
                            />,
                          )}
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                  <div className="row modalRow">
                    <div className="col-md-12">
                      <h5>Message</h5>
                    </div>

                    <div className="col-md-12">
                      <Form.Item label="description">
                        {getFieldDecorator("description", {
                          initialValue: undefined,
                          rules: [
                            { required: true, message: "Please input the Message of Dispute!" },
                          ],
                        })(<TextArea type="textarea" rows={5} />)}
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="col-md-4" style={{ borderLeft: "1px solid rgba(0,0,0,0.65)" }}>
                  <h5>Requesting an escrow refund?</h5>
                  <p style={{ paddingTop: "20px" }}>
                    If your funds have been released from escrow, use this form to request a
                    refund from your vendor.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>
        <Modal
          title="End the contract"
          visible={this.state.contractModal}
          // onOk={this.toggle}
          onCancel={this.toggle}
          width={"50%"}
          footer={
            <Button
              key="next"
              type="primary"
              onClick={this.handleContract}
              style={{ width: "120px" }}
            >
              End Contract
            </Button>
          }
        >
          <div className="send-invite">
            <div className="row">
              <div className="col-md-12">
                <h5 style={{ margin: "15px 0" }}>Why are you ending the contract?</h5>
                <div className="mb-6">
                  <Select
                    value={String(this.state.selectedJob)}
                    onChange={(value) => {
                      this.setState({
                        selectedJob: Number(value),
                      });
                    }}
                  >
                    <option value="-1"> -----Select----- </option>
                    <option value="0"> Job Completed </option>
                  </Select>
                </div>
                <div className="mb-6" style={{ margin: "25px 0px 15px" }}>
                  Before you end the contract you still have some payment that need to be
                  realeased. By ending the contract the payments will be released automatically.
                </div>
                <h5 style={{ margin: "15px 0" }}>Milestones</h5>
              </div>
            </div>
            {this.props.milestones && generateMilestone()}
          </div>
        </Modal>
      </div>
    );
  }
}
const ClientContractDetailsForm = Form.create({ name: "dispute form" })(ClientContractDetails);

const mapStateToProps = ({ clientContractDetailsReducer, loginReducer }) => {
  const { error, contract, milestones, success, pending } = clientContractDetailsReducer;

  const { user } = loginReducer;

  return {
    error,
    contract,
    milestones,
    success,
    pending,
    user,
  };
};

export default connect(mapStateToProps, {
  fetchGetContractData,
  fetchEndContractData,
  fetchUpdateContractData,
  fetchSavingDispute,
  fetchDispute,
  fetchRleaseMilestoneData,
})(withStyles(globalStyle, localStyle)(ClientContractDetailsForm));
