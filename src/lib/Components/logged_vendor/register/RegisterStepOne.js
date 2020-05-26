import React from "react";
import { Input, message, Form, InputNumber, Upload, Icon } from "antd";

import VendorServices from "../profile/services";

class RegisterVendorStepOne extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      businessName: "",
      yearFounded: "",
      employeeCount: 0,
      firstName: "",
      lastName: "",
      phonePrefix: 0,
      phoneNumber: "000-000-000",
      website: "",
      logoUrl: undefined,
      loading: false,
    };
    this.beforeUpload = this.beforeUpload.bind(this);
    this.changeLogo = this.changeLogo.bind(this);
  }

  componentDidMount() {}

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload(file) {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJPG) {
      message.error("You can only upload JPG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJPG && isLt2M;
  }

  changeLogo(info) {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (logoUrl) =>
        this.setState({
          logoUrl,
          loading: false,
        }),
      );
    }
  }

  render() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      isSelectOptGroup,
    } = this.props.form;

    const businessNameError = isFieldTouched("businessName") && getFieldError("businessName");
    const yearFoundedError = isFieldTouched("yearFounded") && getFieldError("yearFounded");
    const employeeCountError =
      isFieldTouched("employeeCount") && getFieldError("employeeCount");
    const firstNameError = isFieldTouched("firstName") && getFieldError("firstName");
    const lastNameError = isFieldTouched("lastName") && getFieldError("lastName");
    const websiteError = isFieldTouched("website") && getFieldError("website");

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "upload"} className="h4" />
        <div className="ant-upload-text">Business Logo or Your photo</div>
      </div>
    );

    return (
      <div className="register-vendor-stepone">
        <Form layout="vertical">
          <div className="row">
            <div className="col-md-8">
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
                    label="Year Founded"
                    validateStatus={yearFoundedError ? "error" : ""}
                    help={yearFoundedError || ""}
                  >
                    {getFieldDecorator("yearFounded", {
                      initialValue: this.state.yearFounded,
                      rules: [{ required: true, message: "Please input year founded!" }],
                    })(
                      <Input
                        placeholder="Year Founded"
                        name="yearFounded"
                        onChange={(value) => {
                          this.setState({
                            yearFounded: value.target.value,
                          });
                        }}
                      />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <Form.Item
                    label="Number of Employee"
                    validateStatus={employeeCountError ? "error" : ""}
                    help={employeeCountError || ""}
                  >
                    {getFieldDecorator("employeeCount", {
                      initialValue: this.state.employeeCount,
                      rules: [{ required: true, message: "Please input number of employee!" }],
                    })(
                      <Input
                        placeholder="Number of Employee"
                        name="employeeCount"
                        onChange={(value) => {
                          this.setState({
                            employeeCount: value.target.value,
                          });
                        }}
                      />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-6"></div>
                <div className="col-12 mb-4">
                  <VendorServices />
                </div>
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
                <div className="col-md-6">
                  <Form.Item label="Phone Number" required>
                    <div className="d-flex w-100">
                      <InputNumber
                        defaultValue={1}
                        formatter={(value) =>
                          `+ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
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
                    label="Website"
                    validateStatus={websiteError ? "error" : ""}
                    help={websiteError || ""}
                  >
                    {getFieldDecorator("Website", {
                      initialValue: this.state.website,
                      rules: [{ required: true, message: "Please input Website link" }],
                    })(
                      <Input
                        placeholder="website"
                        name="website"
                        onChange={(value) => {
                          this.setState({
                            website: value.target.value,
                          });
                        }}
                      />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={this.beforeUpload}
                    onChange={this.changeLogo}
                  >
                    {this.state.logoUrl ? (
                      <img src={this.state.logoUrl} alt="avatar" />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const RegisterVendorStepOneForm = Form.create({ name: "vendor_registration_stepone" })(
  RegisterVendorStepOne,
);

export default RegisterVendorStepOneForm;
