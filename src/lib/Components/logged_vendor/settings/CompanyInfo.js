// @ts-nocheck
import React from "react";
import { connect } from "react-redux";
import { Input, Form, message, Card, Radio, Slider, Select, Checkbox, InputNumber } from "antd";
import GeoRangeMap from "./GeoRangeMap";

import { fetchUpdateCompany } from "./essential";

import timeZoneData from "@Shared/timezone.json";
import countryData from "@Shared/country_state.json";
const { TextArea } = Input;
const { Option } = Select;

class VendorCompanyInfo extends React.Component {
  _sectionType = 0;

  countryList = [];
  stateLists = [];

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      foundedYear: "1986",
      employeeCount: 1,
      overview: "",
      canTravel: 0,
      geoRange: 50,
      vatId: "",
      timeZone: timeZoneData.timeZone[0],
      country: undefined,
      state: undefined,
      address: "",
      isPubAddress: false,
      countryList: countryData.countries.map((item) => item.country),
      stateLists: [],
    };
    this.changeRange = this.changeRange.bind(this);
    this.afterChangeRange = this.afterChangeRange.bind(this);
  }

  componentDidMount() {
    if (this.props.user && this.props.user.vendor && this.props.user.vendor.company) {
      this.setState({
        name: this.props.user.vendor.company.name,
        foundedYear: this.props.user.vendor.company.foundedYear,
        employeeCount: this.props.user.vendor.company.employeeCount,
        overview: this.props.user.vendor.company.overview,
        canTravel: this.props.user.vendor.company.canTravel,
        geoRange: this.props.user.vendor.company.geoRange,
        vatId: this.props.user.vendor.company.vatId,
        timeZone: this.props.user.vendor.company.timeZone,
        country: this.props.user.vendor.company.country,
        state: this.props.user.vendor.company.state,
        address: this.props.user.vendor.company.address,
        isPubAddress: this.props.user.vendor.company.isPubAddress,
      });
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (!state.success && props.success) {
      message.success(props.success);
    }
    if (!state.error && props.error) {
      message.error(props.error);
    }
    return {
      success: props.success,
      error: props.error,
    };
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

  update(index) {
    this._sectionType = index;
    if (index === 0) {
      this.props.form.validateFields(["name", "employeeCount", "overview"], (error, values) => {
        if (!error && !this.props.pending) {
          let data = values;
          data.foundedYear = this.state.foundedYear;
          data.canTravel = this.state.canTravel;
          data.geoRange = this.state.geoRange;
          this.props.fetchUpdateCompany(data);
        }
      });
    } else {
      this.props.form.validateFields(
        ["vatId", "country", "state", "timeZone", "address"],
        (error, values) => {
          if (!error && !this.props.pending) {
            let data = values;
            data.isPubAddress = this.state.isPubAddress;
            this.props.fetchUpdateCompany(data);
          }
        },
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

    const generateFoundedYear = () => {
      return new Array(150).fill(1900).map((value, index) => {
        return (
          <Select.Option value={String(value + index)} key={index}>
            {value + index}
          </Select.Option>
        );
      });
    };

    const generateTimeZoneOptions = () => {
      return timeZoneData.timeZone.map((timeZone, index) => {
        return (
          <Select.Option value={timeZone} key={index}>
            {timeZone}
          </Select.Option>
        );
      });
    };

    const generateCountryOptions = () => {
      return this.state.countryList.map((country, index) => {
        return (
          <Select.Option value={country} key={index}>
            {country}
          </Select.Option>
        );
      });
    };

    const generateStateOptions = () => {
      return this.state.stateLists.map((state, index) => {
        return (
          <Select.Option value={state} key={index}>
            {state}
          </Select.Option>
        );
      });
    };

    return (
      <div className="vendor-companyinfo">
        <Card
          title={<span className="h5 font-weight-bold">Company Details</span>}
          style={{ marginBottom: "50px" }}
          className="shadow"
        >
          <Form layout="vertical">
            <div className="row">
              <div className="col-md-6">
                <Form.Item label="Business Name">
                  {getFieldDecorator("name", {
                    initialValue: this.state.name,
                    rules: [{ required: true, message: "Please input your business name!" }],
                  })(<Input placeholder="Business Name" name="businessName" size={"large"} />)}
                </Form.Item>
              </div>
              <div className="col-md-6"></div>
              <div className="col-md-6">
                <Form.Item label="Year Founded">
                  {
                    <Select
                      value={this.state.foundedYear}
                      onChange={(value) => {
                        this.setState({
                          foundedYear: value,
                        });
                      }}
                      size={"large"}
                    >
                      {generateFoundedYear()}
                    </Select>
                  }
                </Form.Item>
              </div>
              <div className="col-md-6"></div>
              <div className="col-md-6">
                <Form.Item label="Number of Employee">
                  {getFieldDecorator("employeeCount", {
                    initialValue: this.state.employeeCount,
                    rules: [{ required: true, message: "Please input number of employee!" }],
                  })(
                    <InputNumber
                      min={1}
                      placeholder="Number of Employee"
                      name="employeeCount"
                      size={"large"}
                      className="w-100"
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6"></div>
              <div className="col-md-8">
                <Form.Item label="Why should people hire you?">
                  {getFieldDecorator("overview", {
                    initialValue: this.state.overview,
                    rules: [{ required: true, message: "Please input overview" }],
                  })(<TextArea placeholder="" name="overview" rows={5} />)}
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
                  Promote yourself for jobs within {this.state.geoRange} km.
                </p>
              </div>
              <div className="col-12 mb-5">
                <div
                  className="map-content w-100"
                  style={{ height: "300px", position: "relative" }}
                >
                  <GeoRangeMap
                    radius={this.state.geoRange * 1000}
                    center={{
                      lat: this.props.user.bsLocation
                        ? this.props.user.bsLocation.lat
                        : -34.397,
                      lng: this.props.user.bsLocation
                        ? this.props.user.bsLocation.lng
                        : 150.644,
                    }}
                  />
                </div>
              </div>
              <div className="col-12">
                <button
                  className={`button-primary ${
                    this.props.pending && this._sectionType === 0 ? "disable" : ""
                  }`}
                  onClick={() => {
                    this.update(0);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </Form>
        </Card>
        <Card
          title={<span className="h5 font-weight-bold">Company Contact</span>}
          style={{ marginBottom: "50px" }}
          className="shadow"
        >
          <Form layout="vertical">
            <div className="row">
              <div className="col-md-8">
                <Form.Item label="VAT ID">
                  {getFieldDecorator("vatId", {
                    initialValue: this.state.vatId,
                    rules: [{ required: true, message: "Please input VAT ID!" }],
                  })(<Input placeholder="VAT ID" name="vatId" size={"large"} />)}
                </Form.Item>
              </div>
              <div className="col-md-8">
                <Form.Item label="Time Zone">
                  {getFieldDecorator("timeZone", {
                    initialValue: this.state.timeZone,
                    rules: [{ required: true, message: "Please select timezone." }],
                  })(
                    <Select
                      showSearch
                      placeholder="Select timezone"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      size={"large"}
                    >
                      {generateTimeZoneOptions()}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item label="Country">
                  {getFieldDecorator("country", {
                    initialValue: this.state.country,
                    rules: [{ required: true, message: "Please select country." }],
                  })(
                    <Select
                      showSearch
                      placeholder="Select Country"
                      optionFilterProp="children"
                      onChange={(value) => {
                        this.setState({
                          stateLists: countryData.countries
                            .filter((item) => item.country === value)
                            .map((item) => item.states)[0],
                        });
                        this.props.form.setFieldsValue({
                          state: undefined,
                        });
                      }}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      size={"large"}
                    >
                      {generateCountryOptions()}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item label="State">
                  {getFieldDecorator("state", {
                    initialValue: this.state.state,
                    rules: [{ required: true, message: "Please select state." }],
                  })(
                    <Select
                      showSearch
                      placeholder="Select state"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      size={"large"}
                    >
                      {generateStateOptions()}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-8">
                <Form.Item label="Address">
                  {getFieldDecorator("address", {
                    initialValue: this.state.address,
                    rules: [{ required: true, message: "Please input Address!" }],
                  })(<Input placeholder="Address" name="address" size={"large"} />)}
                </Form.Item>
              </div>
              <div className="col-md-12 mb-5">
                <Checkbox
                  onChange={() => {
                    this.setState({
                      isPubAddress: !this.state.isPubAddress,
                    });
                  }}
                  className="d-block"
                  checked={this.state.isPubAddress}
                >
                  {" "}
                  Display this company address to freelancers on invoices.
                </Checkbox>
              </div>
              <div className="col-12">
                <button
                  className={`button-primary ${
                    this.props.pending && this._sectionType === 1 ? "disable" : ""
                  }`}
                  onClick={() => {
                    this.update(1);
                  }}
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
const mapStateToProps = ({ vendorSettingsReducer }) => {
  const { error, user,success, pending } = vendorSettingsReducer;
  return {
    error,
    user,
    success,
    pending,
  };
};

const VendorCompanyInfoForm = Form.create({ name: "vendor_companyinfo" })(VendorCompanyInfo);

export default connect(mapStateToProps, {
  fetchUpdateCompany,
})(VendorCompanyInfoForm);
