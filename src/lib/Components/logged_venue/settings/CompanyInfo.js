import React from "react";
import { Input, InputNumber, Form, Card } from "antd";

class VenueCompanyInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      businessName: "",
      firstName: "",
      lastName: "",
      phonePrefix: 0,
      phoneNumber: "000-000-000",
      email: "",
    };
  }

  render() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      isSelectOptGroup,
    } = this.props.form;

    const businessNameError = isFieldTouched("businessName") && getFieldError("businessName");
    const firstNameError = isFieldTouched("firstName") && getFieldError("firstName");
    const lastNameError = isFieldTouched("lastName") && getFieldError("lastName");
    const emailError = isFieldTouched("email") && getFieldError("email");

    return (
      <div className="venue-companyinfo">
        <Card
          title="Company Details"
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)", marginBottom: "50px" }}
        >
          <Form layout="vertical">
            <div className="row">
              <div className="col-md-6">
                <Form.Item
                  label="Business Name"
                  validateStatus={businessNameError ? "error" : ""}
                  help={businessNameError || ""}
                >
                  {getFieldDecorator("businessName", {
                    initialValue: this.state.businessName,
                    rules: [{ required: true, message: "Please input your business name!" }],
                  })(
                    <Input
                      placeholder="Business Name"
                      name="businessName"
                      onChange={(value) => {
                        this.setState({
                          businessName: value.target.value,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6"></div>
              <div className="col-md-6">
                <Form.Item
                  label="First Name"
                  validateStatus={firstNameError ? "error" : ""}
                  help={firstNameError || ""}
                >
                  {getFieldDecorator("firstName", {
                    initialValue: this.state.firstName,
                    rules: [{ required: true, message: "Please input first name" }],
                  })(
                    <Input
                      placeholder="First Name"
                      name="firstName"
                      onChange={(value) => {
                        this.setState({
                          firstName: value.target.value,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Last Name"
                  validateStatus={lastNameError ? "error" : ""}
                  help={lastNameError || ""}
                >
                  {getFieldDecorator("lastName", {
                    initialValue: this.state.lastName,
                    rules: [{ required: true, message: "Please input last name" }],
                  })(
                    <Input
                      placeholder="Last Name"
                      name="lastName"
                      onChange={(value) => {
                        this.setState({
                          lastName: value.target.value,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 mb-2">
                <Form.Item label="Phone Number" required>
                  <div className="d-flex w-100">
                    <InputNumber
                      defaultValue={1}
                      formatter={(value) => `+ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\+\s?|(,*)/g, "")}
                      className="mr-2"
                      onChange={(value) => {
                        this.setState({
                          phonePrefix: value,
                        });
                      }}
                    />
                    <Input
                      placeholder="000-000-000"
                      name="phoneNumber"
                      onChange={(value) => {
                        this.setState({
                          phoneNumber: value.target.value,
                        });
                      }}
                    />
                  </div>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="email"
                  validateStatus={emailError ? "error" : ""}
                  help={emailError || ""}
                >
                  {getFieldDecorator("email", {
                    initialValue: this.state.email,
                    rules: [{ required: true, message: "Please input Email Address" }],
                  })(
                    <Input
                      placeholder="Email Address"
                      name="email"
                      onChange={(value) => {
                        this.setState({
                          email: value.target.value,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-12">
                <button className="button-primary">Save</button>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    );
  }
}

const VenueCompanyInfoForm = Form.create({ name: "venue_setting_companyinfo" })(
  VenueCompanyInfo,
);

export default VenueCompanyInfoForm;
