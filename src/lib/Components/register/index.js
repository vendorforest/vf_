// @ts-nocheck
import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import { connect } from "react-redux";
import { constants } from "@Shared/constants";
import { Form, Input, Select, Checkbox } from "antd";

import { Header, Footer } from "@Components/inc";

import { fetchRegister, restRegisterState } from "./essential";

import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { Redirect } from "react-router-dom";

const { Option } = Select;

class MainRegister extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false,
    };
  }

  async componentDidMount() {
    await this.props.restRegisterState();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && !this.props.pending && this.state.confirmDirty) {
        this.props.fetchRegister(values);
      }
    });
  };

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      return callback("Two passwords that you enter is inconsistent!");
    } else {
      return callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    return callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    if (this.props.user && this.props.user.id) {
      return <Redirect to={`/emailsent/${this.props.user.id}`} />;
      //return ( <div className="text-center text-grey">{this.props.user.msg}</div>);
    }
    return (
      <div className="register-section">
        <Header/>
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-12">
                <div className="shadow form-content">
                  <Form onSubmit={this.handleSubmit}>
                    <h2 className="text-center mb-5">Sign Up For Free</h2>
                    <Form.Item label="">
                      {getFieldDecorator("username", {
                        rules: [
                          {
                            required: true,
                            message: "Please input your nickname!",
                            whitespace: true,
                          },
                        ],
                      })(<Input placeholder="Username" size={"large"} />)}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator("email", {
                        rules: [
                          {
                            type: "email",
                            message: "The input is not valid E-mail!",
                          },
                          {
                            required: true,
                            message: "Please input your E-mail!",
                          },
                        ],
                      })(<Input placeholder="E-mail" size={"large"} />)}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator("password", {
                        rules: [
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                          {
                            validator: this.validateToNextPassword,
                          },
                        ],
                      })(<Input type="password" placeholder="Password" size={"large"} />)}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator("confirm", {
                        rules: [
                          {
                            required: true,
                            message: "Please confirm your password!",
                          },
                          {
                            validator: this.compareToFirstPassword,
                          },
                        ],
                      })(
                        <Input
                          placeholder="Confirm Password"
                          type="password"
                          onBlur={this.handleConfirmBlur}
                          size={"large"}
                        />,
                      )}
                    </Form.Item>
                    <Form.Item label="Create my account as:">
                      {getFieldDecorator("accountType", {
                        rules: [{ required: true, message: "Create your account as a?" }],
                      })(
                        <Select
                          style={{ width: "100%" }}
                          initialValue={constants.ACCOUNT_TYPE.CLIENT}
                          size={"large"}
                        >
                          <Option value={constants.ACCOUNT_TYPE.CLIENT}>Client</Option>
                          <Option value={constants.ACCOUNT_TYPE.VENDOR}>Vendor</Option>
                          {/* <Option value={constants.ACCOUNT_TYPE.PROVENDOR}>Pro Vendor</Option> */}
                        </Select>,
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator("agreement", {
                        valuePropName: "checked",
                        initialValue: true,
                        rules: [{ required: true, message: "Please check aggreement" }],
                      })(
                        <Checkbox>
                          I have read the{" "}
                          <a href="#/" className="text-color">
                            agreement
                          </a>
                        </Checkbox>,
                      )}
                    </Form.Item>
                    <div className="d-flex justify-content-center mb-3">
                      <button
                        className={`button-primary w-100 ${
                          this.props.pending ? "disable" : ""
                        }`}
                        type="submit"
                      >
                        Register
                      </button>
                    </div>
                  </Form>
                  <p className="mt-4 mb-3 text-center">
                    Do you have account?{" "}
                    <a href="/login" className="text-color">
                      Login now
                    </a>
                  </p>
                  <div className="text-center mt-2">
                    {this.props.error && (
                      <span className="text-danger text-center">{this.props.error}</span>
                    )}
                  </div>
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

const mapStateToProps = (state) => {
  const { error, user, pending } = state.registerReducer;
  return {
    error,
    user,
    pending,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRegister: (payload) => dispatch(fetchRegister(payload)),
    restRegisterState: () => dispatch(restRegisterState()),
  };
};

const WrappedRegistrationForm = Form.create({ name: "register" })(MainRegister);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(globalStyle, localStyle)(WrappedRegistrationForm));
