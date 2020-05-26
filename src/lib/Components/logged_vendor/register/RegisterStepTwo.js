import React from "react";
import { Input, Form, Radio } from "antd";

const { TextArea } = Input;

class RegisterVendorStepTwo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      overview: "",
      canTravel: 0,
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

    const overviewError = isFieldTouched("overview") && getFieldError("overview");

    return (
      <div className="register-vendor-steptwo">
        <Form layout="vertical">
          <div className="row">
            <div className="col-md-8">
              <Form.Item
                label="Why should people hire you?"
                validateStatus={overviewError ? "error" : ""}
                help={overviewError || ""}
              >
                {getFieldDecorator("overview", {
                  initialValue: this.state.overview,
                  rules: [{ required: true, message: "Please input overview" }],
                })(
                  <TextArea
                    placeholder=""
                    name="overview"
                    onChange={(value) => {
                      this.setState({
                        overview: value.target.value,
                      });
                    }}
                    rows={5}
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-md-12">
              <Form.Item label="Travel Preferences">
                <Radio.Group
                  onChange={(e) => {
                    this.setState({
                      canTravel: e.target.value,
                    });
                  }}
                  value={this.state.canTravel}
                >
                  <Radio value={0} className="d-block mb-3">
                    I can travel to my customers
                  </Radio>
                  <Radio value={1} className="d-block mb-3">
                    My customers travel to me
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const RegisterVendorStepTwoForm = Form.create({ name: "vendor_registration_steptwo" })(
  RegisterVendorStepTwo,
);

export default RegisterVendorStepTwoForm;
