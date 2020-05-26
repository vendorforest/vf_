// @ts-nocheck
import React from "react";
import { connect } from "react-redux";
import { Input, Form, Card, message, Icon } from "antd";
import { fetchResetPass, verifyLink } from "./essential";
import { Footer, Header } from "@Components/inc";
import { withRouter } from "react-router";
import withStyles from "isomorphic-style-loader/withStyles";

import styles from "./index.scss";

class PasswordReset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      verify: false,
      oldPass: "",
      newPass: "",
      repeatPass: "",
    };
  }
  resetPass = async (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // if (!err && !this.props.pending && this.state.verify) {
        this.props.fetchResetPass(values);
      }
    });
  };

  async componentDidMount() {
    const { token } = this.props.match.params;
    await this.props.verifyLink(token);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.error) {
      process.env.NODE_ENV === "development" && console.log(("error: ", props.error));
      setImmediate(() => {
        message.error(props.error);
      }, 36000);
      props.history.push("/404");
      return {
        ...state,
        verify: true,
        error: props.error,
        success: props.success,
        pending: false,
      };
    }
    if (props.success && !state.verify) {
      return {
        ...state,
        verify: true,
        error: props.error,
        success: props.success,
        pending: false,
      };
    }
    return {
      //...state,
      error: props.error,
      success: props.success,
      pending: false,
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="resetpass-section">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-xl-6 col-lg-8 col-md-10 col-12 offset-xl-3 offset-lg-3 offset-md-1  offset-0">
                <div className="shadow form-content">
                  <Card
                    title="Password & security"
                    style={{
                      boxShadow: "0 1px 6px rgba(57,73,76,.35)",
                    }}
                  >
                    <Form layout="vertical" onSubmit={this.resetPass}>
                      <div className="row">
                        <div className="col-md-12 col-sm-12">
                          <Form.Item label="Old Password">
                            {getFieldDecorator("oldPass", {
                              initialValue: this.state.oldPass, //solution
                              rules: [{ required: true, message: "Please input Old Password" }],
                            })(
                              <Input.Password
                                placeholder="Old Password"
                                name="oldPass"
                                size={"large"}
                              />,
                            )}
                          </Form.Item>
                        </div>
                        <div className="col-md-6"></div>
                        <div className="col-md-12 col-sm-12">
                          <Form.Item label="New Password">
                            {getFieldDecorator("newPass", {
                              initialValue: this.state.newPass, //solution
                              rules: [{ required: true, message: "Please input New Password" }],
                            })(
                              <Input.Password
                                placeholder="New Password"
                                name="newPass"
                                size={"large"}
                              />,
                            )}
                          </Form.Item>
                        </div>
                        <div className="col-md-6"></div>
                        <div className="col-md-12">
                          <Form.Item label="Repeat Password">
                            {getFieldDecorator("repeatPass", {
                              initialValue: this.state.repeatPass, //solution
                              rules: [
                                { required: true, message: "Please input Repeat Password" },
                              ],
                            })(
                              <Input.Password
                                placeholder="Repeat Passwords"
                                name="repeatPass"
                                size={"large"}
                              />,
                            )}
                          </Form.Item>
                        </div>
                        <div className="col-12 d-flex justify-content-start">
                          <button
                            className={`button-primary ${
                              this.state.pending && !this.state.verify ? "disable" : ""
                            }`}
                            type="submit"
                          >
                            Save &nbsp;
                            {this.state.pending && !this.state.verify && (
                              <Icon type="sync" spin />
                            )}
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }
}

const PasswordResetForm = Form.create({ name: "client_setting_security" })(PasswordReset);

const mapStateToProps = ({ ForgotPasswordReducer }) => {
  const { error, success, pending } = ForgotPasswordReducer;
  return {
    error,
    success,
    pending,
  };
};

export const ForgotPassword = connect(mapStateToProps, {
  fetchResetPass,
  verifyLink,
})(withStyles(styles)(withRouter(PasswordResetForm)));
