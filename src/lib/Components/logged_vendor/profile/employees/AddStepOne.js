import React from "react";
import { Input, Form, Upload, Icon, message, InputNumber } from "antd";

class AddStepOne extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      photoUrl: "",
      phonePrefix: 1,
      phoneNumber: "000-000-000",
      loading: false,
    };
    this.beforeUpload = this.beforeUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeNumberPrefix = this.changeNumberPrefix.bind(this);
  }

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

  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (photoUrl) =>
        this.setState({
          photoUrl,
          loading: false,
        }),
      );
    }
  };

  changeNumberPrefix(value) {}

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    const photoUrl = this.state.photoUrl;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const firstNameError = isFieldTouched("firstName") && getFieldError("firstName");
    const lastNameError = isFieldTouched("lastName") && getFieldError("lastName");
    const emailError = isFieldTouched("email") && getFieldError("email");

    return (
      <div className="addemployee-stepone">
        <Form layout="vertical">
          <div className="row">
            <div className="col-12 text-center mb-3">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
              >
                {photoUrl ? <img src={photoUrl} alt="avatar" /> : uploadButton}
              </Upload>
            </div>
            <div className="col-md-6 col-sm-12">
              <Form.Item
                label="First Name"
                validateStatus={firstNameError ? "error" : ""}
                help={firstNameError || ""}
              >
                {getFieldDecorator("firstName", {
                  initialValue: this.state.firstName, //solution
                  rules: [{ required: true, message: "Please input First Name" }],
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
            <div className="col-md-6 col-sm-12">
              <Form.Item
                label="Last Name"
                validateStatus={lastNameError ? "error" : ""}
                help={lastNameError || ""}
              >
                {getFieldDecorator("lastName", {
                  initialValue: this.state.lastName, //solution
                  rules: [{ required: true, message: "Please input Last Name" }],
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
            <div className="col-md-12">
              <Form.Item
                label="Email Address"
                validateStatus={emailError ? "error" : ""}
                help={emailError || ""}
              >
                {getFieldDecorator("email", {
                  initialValue: this.state.email, //solution
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
            <div className="col-md-3">
              <InputNumber
                defaultValue={1}
                formatter={(value) => `+ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\+\s?|(,*)/g, "")}
                onChange={this.changeNumberPrefix}
              />
            </div>
            <div className="col-md-9">
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
          </div>
        </Form>
      </div>
    );
  }
}

const AddEmployeeStepOneForm = Form.create({ name: "vendor_addemployee_stepone" })(AddStepOne);

export default AddEmployeeStepOneForm;
