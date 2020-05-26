import React from "react";
import { Icon, Select, Rate, Radio, Input, Form, message, Avatar } from "antd";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { fetchCreateReviewData } from "./essential";
import feedBackIconOnTime from "@Components/images/NewIcons/feedbackicon_1.png";
import feedBackIconSkillful from "@Components/images/NewIcons/feedbackicon_2.png";
import feedBackIconExcelent from "@Components/images/NewIcons/feedbackicon_3.png";
import feedBackIconBeyond from "@Components/images/NewIcons/feedbackicon_4.png";
import feedBackIconEntertaining from "@Components/images/NewIcons/feedbackicon_5.png";
import feedBackIconConversation from "@Components/images/NewIcons/feedbackicon_6.png";

const { Option } = Select;
const { TextArea } = Input;

const endReasons = ["Job Completed", "No Experienced Vendor", "Other Reason"];

class ClientGiveFeedBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endReason: 0,
      recommend: 8,
      rate: 5,
      vendorBadge: [],
    };
    this.giveFeedbck = this.giveFeedbck.bind(this);
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

  giveFeedbck() {
    // if (this.props.pending) {
    //   return;
    // }
    if (this.props.match.params.contract_id) {
      this.props.form.validateFields(["feedback"], (err, values) => {
        if (!err) {
          const params = {
            contract: this.props.match.params.contract_id,
            from: this.props.user.userObj._id,
            rate: this.state.rate,
            feedback: values.feedback,
            endReason: this.state.endReason,
            recommend: this.state.recommend,
            vendorBadge: this.state.vendorBadge,
          };
          this.props.fetchCreateReviewData(params);
          window.location.href = "/client";
        }
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const generateReasonOptions = () => {
      return endReasons.map((reason, index) => {
        return (
          <Option value={String(index)} key={index}>
            {reason}
          </Option>
        );
      });
    };

    const generateLevelOptions = () => {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level, index) => {
        return (
          <Radio value={level} key={index}>
            {level}
          </Radio>
        );
      });
    };

    return (
      <div className="givefeedback">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="feedback-details shadow">
                  <div className="d-flex mb-5">
                    <Icon type="notification" style={{ fontSize: "40px" }} />
                    <div className="ml-2">
                      <h5>Feedback to vendor</h5>
                      <p>
                        This feedback will be shared with your vendor and left on their profile.
                      </p>
                    </div>
                  </div>
                  <Form>
                    <div className="end-reason mb-4">
                      <div className="row">
                        <div className="col-md-5 col-sm-6 col-12">
                          <Select size="large"
                            value={String(this.state.endReason)}
                            onChange={(value) => {
                              this.setState({
                                endReason: Number(value),
                              });
                            }}
                          >
                            {generateReasonOptions()}
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="recommend-level mb-4">
                      <p className="mb-2">
                        How likely are you to recommend this vendor to your friends?
                      </p>
                      <Radio.Group
                        onChange={(e) => {
                          this.setState({
                            recommend: e.target.value,
                          });
                        }}
                        value={this.state.recommend}
                      >
                        {generateLevelOptions()}
                      </Radio.Group>
                    </div>
                    <div className="rate mb-4">
                      <p className="mb-2">Rate</p>
                      <Rate
                        value={this.state.rate}
                        allowHalf
                        onChange={(value) => {
                          this.setState({
                            rate: value,
                          });
                        }}
                      />{" "}
                      <span>{this.state.rate}</span>
                    </div>
                    <div className="enough-list mb-4">
                      <p className="mb-2">Give badges to the vendor</p>
                      <div className="row">
                        <div className="col-md-2 col-sm-4 col-6 mb-2">
                          <div
                            className={`enough-item ${
                              this.state.vendorBadge.indexOf(0) > -1 ? "active" : ""
                            }`}
                            onClick={() => {
                              let newBadge = [...this.state.vendorBadge];
                              const index = this.state.vendorBadge.indexOf(0);
                              if (index > -1) {
                                newBadge.splice(index, 1);
                              } else {
                                newBadge.push(0);
                              }
                              this.setState({
                                vendorBadge: newBadge,
                              });
                            }}
                          >
                            <Avatar size={50} src={feedBackIconOnTime} />
                            <p>On Time</p>
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-4 col-6 mb-2">
                          <div
                            className={`enough-item ${
                              this.state.vendorBadge.indexOf(1) > -1 ? "active" : ""
                            }`}
                            onClick={() => {
                              let newBadge = [...this.state.vendorBadge];
                              const index = this.state.vendorBadge.indexOf(1);
                              if (index > -1) {
                                newBadge.splice(index, 1);
                              } else {
                                newBadge.push(1);
                              }
                              this.setState({
                                vendorBadge: newBadge,
                              });
                            }}
                          >
                            <Avatar size={50} src={feedBackIconSkillful} />
                            <p>Skillful</p>
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-4 col-6 mb-2">
                          <div
                            className={`enough-item ${
                              this.state.vendorBadge.indexOf(2) > -1 ? "active" : ""
                            }`}
                            onClick={() => {
                              let newBadge = [...this.state.vendorBadge];
                              const index = this.state.vendorBadge.indexOf(2);
                              if (index > -1) {
                                newBadge.splice(index, 1);
                              } else {
                                newBadge.push(2);
                              }
                              this.setState({
                                vendorBadge: newBadge,
                              });
                            }}
                          >
                            <Avatar size={50} src={feedBackIconExcelent} />
                            <p>Excellent Service</p>
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-4 col-6 mb-2">
                          <div
                            className={`enough-item ${
                              this.state.vendorBadge.indexOf(3) > -1 ? "active" : ""
                            }`}
                            onClick={() => {
                              let newBadge = [...this.state.vendorBadge];
                              const index = this.state.vendorBadge.indexOf(3);
                              if (index > -1) {
                                newBadge.splice(index, 1);
                              } else {
                                newBadge.push(3);
                              }
                              this.setState({
                                vendorBadge: newBadge,
                              });
                            }}
                          >
                            <Avatar size={50} src={feedBackIconBeyond} />
                            <p>Above & Beyond</p>
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-4 col-6 mb-2">
                          <div
                            className={`enough-item ${
                              this.state.vendorBadge.indexOf(4) > -1 ? "active" : ""
                            }`}
                            onClick={() => {
                              let newBadge = [...this.state.vendorBadge];
                              const index = this.state.vendorBadge.indexOf(4);
                              if (index > -1) {
                                newBadge.splice(index, 1);
                              } else {
                                newBadge.push(4);
                              }
                              this.setState({
                                vendorBadge: newBadge,
                              });
                            }}
                          >
                            <Avatar size={50} src={feedBackIconEntertaining} />
                            <p>Entertaining</p>
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-4 col-6 mb-2">
                          <div
                            className={`enough-item ${
                              this.state.vendorBadge.indexOf(5) > -1 ? "active" : ""
                            }`}
                            onClick={() => {
                              let newBadge = [...this.state.vendorBadge];
                              const index = this.state.vendorBadge.indexOf(5);
                              if (index > -1) {
                                newBadge.splice(index, 1);
                              } else {
                                newBadge.push(5);
                              }
                              this.setState({
                                vendorBadge: newBadge,
                              });
                            }}
                          >
                            <Avatar size={50} src={feedBackIconConversation} />
                            <p>Great Conversation</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="feedback-content mb-4">
                      <p className="mb-2">
                        Share your experience with this vendor to the VendorForest.com community
                        :
                      </p>
                      <Form.Item label="">
                        {getFieldDecorator("feedback", {
                          initialValue: "", //solution
                          rules: [{ required: true, message: "Please input feedback" }],
                        })(<TextArea placeholder="Please input feedback" rows={5} />)}
                      </Form.Item>
                      <p className="mt-2">
                        Keep in mind that ending this contract will lock your vendor's dairy for
                        this work. We'll le your vendor know that the job is done and send you
                        the final statement with any remaining balance.
                      </p>
                    </div>
                    <button
                      className={`button-primary ${this.props.pending ? "" : ""}`}
                      onClick={this.giveFeedbck}
                    >
                      Send
                    </button>
                  </Form>
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

const ClientGiveFeedBackForm = Form.create({ name: "client_givefeedback_form" })(
  ClientGiveFeedBack,
);

const mapStateToProps = ({ clientReviewReducer, loginReducer }) => {
  const { error, success, pending } = clientReviewReducer;
  const { user } = loginReducer;
  return {
    error,
    success,
    pending,
    user,
  };
};

export default connect(mapStateToProps, {
  fetchCreateReviewData,
})(withStyles(globalStyle, localStyle)(ClientGiveFeedBackForm));
