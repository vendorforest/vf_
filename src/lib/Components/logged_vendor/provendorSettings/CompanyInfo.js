import React from "react";
import {
  Input,
  InputNumber,
  Form,
  Upload,
  Icon,
  message,
  Card,
  Radio,
  Slider,
  Select,
  Checkbox,
} from "antd";
import GeoRangeMap from "./GeoRangeMap";

const { TextArea } = Input;

const timeZoneList = [
  "Midway Islands Time",
  "Hawaii Standard Time",
  "Alaska Standard Time",
  "Alaska Daylight Savings Time",
];

const countryList = ["Afghanistan", "Albania", "Belarus", "United State", "China"];

const stateList = ["Alabama", "Alaska", "California", "Colorado"];

class VendorCompanyInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      businessName: "",
      yearFounded: "",
      employeeCount: 0,
      overview: "",
      canTravel: 0,
      geoRange: 50,
      firstName: "",
      lastName: "",
      phonePrefix: 0,
      phoneNumber: "000-000-000",
      website: "",
      vatId: "",
      timeZone: 0,
      country: 0,
      state: 0,
      address: "",
      displayAddress: false,
      logoUrl: undefined,
      loading: false,
    };
    this.changeRange = this.changeRange.bind(this);
    this.afterChangeRange = this.afterChangeRange.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.changeLogo = this.changeLogo.bind(this);
  }

  changeRange(value) {
    this.setState({
      geoRange: value,
    });
  }

  afterChangeRange(value) {
    this.setState({
      geoRange: value,
    });
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
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "upload"} className="h4" />
        <div className="ant-upload-text">Business Logo or Your photo</div>
      </div>
    );

    const businessNameError = isFieldTouched("businessName") && getFieldError("businessName");
    const yearFoundedError = isFieldTouched("yearFounded") && getFieldError("yearFounded");
    const employeeCountError =
      isFieldTouched("employeeCount") && getFieldError("employeeCount");
    const overviewError = isFieldTouched("overview") && getFieldError("overview");
    const firstNameError = isFieldTouched("firstName") && getFieldError("firstName");
    const lastNameError = isFieldTouched("lastName") && getFieldError("lastName");
    const websiteError = isFieldTouched("website") && getFieldError("website");
    const vatIdError = isFieldTouched("vatId") && getFieldError("vatId");
    const addressError = isFieldTouched("address") && getFieldError("address");

    const generateTimeZoneOptions = () => {
      return timeZoneList.map((timeZone, index) => {
        return (
          <Select.Option value={String(index)} key={index}>
            {timeZone}
          </Select.Option>
        );
      });
    };

    const generateCountryOptions = () => {
      return countryList.map((country, index) => {
        return (
          <Select.Option value={String(index)} key={index}>
            {country}
          </Select.Option>
        );
      });
    };

    const generateStateOptions = () => {
      return stateList.map((state, index) => {
        return (
          <Select.Option value={String(index)} key={index}>
            {state}
          </Select.Option>
        );
      });
    };

    return (
      <div className="provendor-companyinfo">
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
              <div className="col-md-8 mb-3">
                <h6 className="text-grey mb-md-5 mb-3">Where do you want to work?</h6>
                <Slider
                  value={this.state.geoRange}
                  onChange={this.changeRange}
                  onAfterChange={this.afterChangeRange}
                />
                <p className="w-100 text-center">
                  Promote yourself for jobs within {this.state.geoRange} miles.
                </p>
              </div>
              <div className="col-12 mb-5">
                <div
                  className="map-content w-100"
                  style={{ height: "300px", position: "relative" }}
                >
                  <GeoRangeMap radius={this.state.geoRange} />
                </div>
              </div>
              <div className="col-12">
                <button className="button-primary">Save</button>
              </div>
            </div>
          </Form>
        </Card>
        <Card
          title="Company Contact"
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)", marginBottom: "50px" }}
        >
          <Form layout="vertical">
            <div className="row">
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
              <div className="col-md-8">
                <Form.Item
                  label="VAT ID"
                  validateStatus={vatIdError ? "error" : ""}
                  help={vatIdError || ""}
                >
                  {getFieldDecorator("vatId", {
                    initialValue: this.state.vatId,
                    rules: [{ required: true, message: "Please input VAT ID!" }],
                  })(
                    <Input
                      placeholder="VAT ID"
                      name="vatId"
                      onChange={(value) => {
                        this.setState({
                          vatId: value.target.value,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-8">
                <Form.Item label="Time Zone">
                  <Select
                    value={String(this.state.timeZone)}
                    onChange={(value) => {
                      this.setState({
                        timeZone: Number(value),
                      });
                    }}
                  >
                    {generateTimeZoneOptions()}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item label="Country">
                  <Select
                    value={String(this.state.country)}
                    onChange={(value) => {
                      this.setState({
                        country: Number(value),
                      });
                    }}
                  >
                    {generateCountryOptions()}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item label="State">
                  <Select
                    value={String(this.state.state)}
                    onChange={(value) => {
                      this.setState({
                        state: Number(value),
                      });
                    }}
                  >
                    {generateStateOptions()}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-8">
                <Form.Item
                  label="Address"
                  validateStatus={addressError ? "error" : ""}
                  help={addressError || ""}
                >
                  {getFieldDecorator("address", {
                    initialValue: this.state.address,
                    rules: [{ required: true, message: "Please input Address!" }],
                  })(
                    <Input
                      placeholder="Address"
                      name="address"
                      onChange={(value) => {
                        this.setState({
                          address: value.target.value,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-12 mb-3">
                <Checkbox
                  onChange={() => {
                    this.setState({
                      displayAddress: !this.state.displayAddress,
                    });
                  }}
                  className="d-block"
                  checked={this.state.displayAddress}
                >
                  {" "}
                  Display this company address to freelancers on invoices.
                </Checkbox>
              </div>
              <div className="col-md-6 mb-5">
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

const VendorCompanyInfoForm = Form.create({ name: "vendor_setting_companyinfo" })(
  VendorCompanyInfo,
);

export default VendorCompanyInfoForm;
