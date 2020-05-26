import React from "react";
import { connect } from "react-redux";
import { Input, Form, Card } from "antd";
import { fetchResetPass } from "./essential";

class VendorSecurity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oldPass: "",
      newPass: "",
      repeatPass: "",
    };
  }

  resetPass = async (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && !this.props.pending) {
        process.env.NODE_ENV === "development" && console.log(values);
        this.props.fetchResetPass(values);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    return (
      <div className="vendor-security">
        <Card
          title={<span className="h5 font-weight-bold">Password & security</span>}
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)", marginBottom: "50px" }}
        >
          <Form layout="vertical" onSubmit={this.resetPass}>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <Form.Item label="Old Password">
                  {getFieldDecorator("oldPass", {
                    initialValue: this.state.oldPass, //solution
                    rules: [{ required: true, message: "Please input Old Password" }],
                  })(
                    <Input.Password placeholder="Old Password" name="oldPass" size={"large"} />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6"></div>
              <div className="col-md-6 col-sm-12">
                <Form.Item label="New Password">
                  {getFieldDecorator("newPass", {
                    initialValue: this.state.newPass, //solution
                    rules: [{ required: true, message: "Please input New Password" }],
                  })(
                    <Input.Password placeholder="New Password" name="newPass" size={"large"} />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6"></div>
              <div className="col-md-6">
                <Form.Item label="Repeat Password">
                  {getFieldDecorator("repeatPass", {
                    initialValue: this.state.repeatPass, //solution
                    rules: [{ required: true, message: "Please input Repeat Password" }],
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
                  className={`button-primary ${this.props.pending ? "disable" : ""}`}
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    );
  }
}

const VendorSecurityForm = Form.create({ name: "vendor_setting_security" })(VendorSecurity);

const mapStateToProps = ({ vendorSettingsReducer }) => {
  const { error, user, success, pending } = vendorSettingsReducer;
  return {
    error,
    user,
    success,
    pending,
  };
};

export default connect(mapStateToProps, {
  fetchResetPass,
})(VendorSecurityForm);
