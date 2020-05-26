import React from "react";
import { Input, Form, Upload, Icon, message, Card } from "antd";

class VendorSecurity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oldPass: "",
      newPass: "",
      repeatPass: "",
    };
  }

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    const oldPassError = isFieldTouched("oldPass") && getFieldError("oldPass");
    const newPassError = isFieldTouched("newPass") && getFieldError("newPass");
    const repeatPassError = isFieldTouched("repeatPass") && getFieldError("repeatPass");

    return (
      <div className="provendor-security">
        <Card
          title="Password & security"
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)", marginBottom: "50px" }}
        >
          <Form layout="vertical">
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <Form.Item
                  label="Old Password"
                  validateStatus={oldPassError ? "error" : ""}
                  help={oldPassError || ""}
                >
                  {getFieldDecorator("oldPass", {
                    initialValue: this.state.oldPass, //solution
                    rules: [{ required: true, message: "Please input Old Password" }],
                  })(
                    <Input
                      placeholder="Old Password"
                      name="oldPass"
                      onChange={(value) => {
                        this.setState({
                          oldPass: value.target.value,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6"></div>
              <div className="col-md-6 col-sm-12">
                <Form.Item
                  label="New Password"
                  validateStatus={newPassError ? "error" : ""}
                  help={newPassError || ""}
                >
                  {getFieldDecorator("newPass", {
                    initialValue: this.state.newPass, //solution
                    rules: [{ required: true, message: "Please input New Password" }],
                  })(
                    <Input
                      placeholder="New Password"
                      name="newPass"
                      onChange={(value) => {
                        this.setState({
                          newPass: value.target.value,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6"></div>
              <div className="col-md-6">
                <Form.Item
                  label="Repeat Password"
                  validateStatus={repeatPassError ? "error" : ""}
                  help={repeatPassError || ""}
                >
                  {getFieldDecorator("repeatPass", {
                    initialValue: this.state.repeatPass, //solution
                    rules: [{ required: true, message: "Please input Repeat Password" }],
                  })(
                    <Input
                      placeholder="Repeat Passwords"
                      name="repeatPass"
                      onChange={(value) => {
                        this.setState({
                          repeatPass: value.target.value,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-12 d-flex justify-content-start">
                <button className="button-primary">Save</button>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    );
  }
}

const VendorSecurityForm = Form.create({ name: "vendor_setting_security" })(VendorSecurity);

export default VendorSecurityForm;
