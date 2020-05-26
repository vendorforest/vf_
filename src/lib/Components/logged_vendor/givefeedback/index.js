import React from "react";
import { connect } from "react-redux";
import { Icon, Rate, Input, Form, message } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import {Header, Footer} from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { fetchCreateReviewData } from "./essential";
const { TextArea } = Input;

class VendorGiveFeedBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 5,
    };
    this.giveFeedbck = this.giveFeedbck.bind(this);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (!this.props.success && newProps.success) {
      message.success(newProps.success);
      this.props.history.push(`/vendor`);
    }
    if (!this.props.error && newProps.error) {
      message.error(newProps.error);
    }
  }

  giveFeedbck() {
    if (!this.props.pending) {
      return;
    }
    if (this.props.match.params.contract_id) {
      this.props.form.validateFields(["feedback"], (err, values) => {
        if (!err) {
          const params = {
            contract: this.props.match.params.contract_id,
            from: this.props.user.userObj._id,
            rate: this.state.rate,
            feedback: values.feedback,
          };
          this.props.fetchCreateReviewData(params);
        }
      });
    }
  }

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    return (
      <div className="givefeedback">
        <Header />
        <div className="content">
          <div className="container">
            <Form>
              <div className="row">
                <div className="col-12">
                  <div className="feedback-details shadow">
                    <div className="d-flex mb-5">
                      <Icon type="notification" style={{ fontSize: "40px" }} />
                      <div className="ml-2">
                        <h5>Feedback to client</h5>
                        <p>
                          This feedback will be shared with your vendor and left on their
                          profile.
                        </p>
                      </div>
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
                    </div>
                    <button
                      className={`button-primary ${!this.props.pending ? "disable" : ""}`}
                      onClick={this.giveFeedbck}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const VendorGiveFeedBackForm = Form.create({ name: "client_givefeedback_form" })(
  VendorGiveFeedBack,
);
const mapStateToProps = ({ vendorReviewReducer, loginReducer }) => {
  const { error, success, pending } = vendorReviewReducer;
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
})(withStyles(globalStyle, localStyle)(VendorGiveFeedBackForm));
