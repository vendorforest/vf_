import React from "react";
import { Input, Form, Radio, Select, InputNumber } from "antd";

class RegisterVenueStepFour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      askDeposit: false,
      depositValue: 0,
      paymentMethod: 0,
      cardNumber: "",
      firstName: "",
      lastName: "",
      expireMonth: "01",
      expireYear: "2019",
      securityCode: "",
    };
  }

  componentDidMount() {}

  render() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      isSelectOptGroup,
    } = this.props.form;

    const cardNumberError = isFieldTouched("cardNumber") && getFieldError("cardNumber");
    const firstNameError = isFieldTouched("firstName") && getFieldError("firstName");
    const lastNameError = isFieldTouched("lastName") && getFieldError("lastName");
    const securityCodeError = isFieldTouched("securityCode") && getFieldError("securityCode");

    const generateExpireMonthOptions = () => {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month, index) => {
        return (
          <Select.Option key={index} value={`0${month}`.slice(-2)}>
            {`0${month}`.slice(-2)}
          </Select.Option>
        );
      });
    };

    const generateExpireYearOptions = () => {
      const years = new Array(30).fill(0);
      return years.map((year, index) => {
        return (
          <Select.Option key={index} value={2019 + index}>
            {2019 + index}
          </Select.Option>
        );
      });
    };

    return (
      <div className="register-venue-stepfour">
        <Form layout="vertical">
          <div className="row">
            <div className="col-md-8 mb-5">
              <h5 className="text-grey mb-4">Deposit</h5>
              <Form.Item label="Do you ask for a down deposit to your client?">
                <Radio.Group
                  onChange={(e) => {
                    this.setState({
                      askDeposit: e.target.value,
                    });
                  }}
                  value={this.state.askDeposit}
                >
                  <Radio value={false} className="mr-3">
                    No
                  </Radio>
                  <Radio value={true} className="mr-3">
                    Yes
                  </Radio>
                </Radio.Group>
              </Form.Item>
              {this.state.askDeposit && (
                <InputNumber
                  value={this.state.depositValue}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(value) => {
                    this.setState({
                      depositValue: value,
                    });
                  }}
                />
              )}
            </div>
            <div className="col-md-8">
              <h5 className="text-grey mb-md-5 mb-4">Add a billing method</h5>
              <Radio.Group
                onChange={(e) => {
                  this.setState({
                    paymentMethod: e.target.value,
                  });
                }}
                value={this.state.paymentMethod}
              >
                <Radio value={0} className="d-block mb-3">
                  Add a Credit Card
                </Radio>
                <div className="row mt-4">
                  <div className="col-md-12">
                    <Form.Item
                      label="Card Number"
                      validateStatus={cardNumberError ? "error" : ""}
                      help={cardNumberError || ""}
                    >
                      {getFieldDecorator("cardNumber", {
                        initialValue: this.state.cardNumber,
                        rules: [{ required: true, message: "Please input your card number." }],
                      })(
                        <Input
                          placeholder="Card Number"
                          name="cardNumber"
                          onChange={(value) => {
                            this.setState({
                              cardNumber: value.target.value,
                            });
                          }}
                        />,
                      )}
                    </Form.Item>
                  </div>
                  <div className="col-md-6">
                    <Form.Item
                      label="First Name"
                      validateStatus={firstNameError ? "error" : ""}
                      help={firstNameError || ""}
                    >
                      {getFieldDecorator("firstName", {
                        initialValue: this.state.firstName,
                        rules: [{ required: true, message: "Please input your first name." }],
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
                        rules: [{ required: true, message: "Please input your last name." }],
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
                  <div className="col-md-4">
                    <Form.Item label="Expire Month" required>
                      <Select
                        value={String(this.state.expireMonth)}
                        onChange={(value) => {
                          this.setState({
                            expireMonth: Number(value),
                          });
                        }}
                      >
                        {generateExpireMonthOptions()}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item label="Expire Year" required>
                      <Select
                        value={String(this.state.expireYear)}
                        onChange={(value) => {
                          this.setState({
                            expireYear: Number(value),
                          });
                        }}
                      >
                        {generateExpireYearOptions()}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      label="Security Code"
                      validateStatus={securityCodeError ? "error" : ""}
                      help={securityCodeError || ""}
                    >
                      {getFieldDecorator("lastName", {
                        initialValue: this.state.securityCode,
                        rules: [
                          { required: true, message: "Please input your security code." },
                        ],
                      })(
                        <Input
                          placeholder="Security Code"
                          name="securityCode"
                          onChange={(value) => {
                            this.setState({
                              securityCode: value.target.value,
                            });
                          }}
                        />,
                      )}
                    </Form.Item>
                  </div>
                </div>
                <Radio value={1} className="d-block mb-3">
                  Paypal
                </Radio>
                <div className="row mt-4">
                  <div className="col-12 paypal-content">
                    <p className="text-grey mb-3">
                      You’ll be redirected to PayPal to link a verified account.
                    </p>
                    <button className="button-primary">Connect to your paypal</button>
                  </div>
                </div>
              </Radio.Group>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const RegisterVenueStepFourForm = Form.create({ name: "venue_registration_stepfour" })(
  RegisterVenueStepFour,
);

export default RegisterVenueStepFourForm;
