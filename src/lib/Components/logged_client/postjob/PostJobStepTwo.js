import React from "react";
import { Input, Form, Radio, Checkbox, InputNumber, Select } from "antd";
import { connect } from "react-redux";
import { updateJob, updateStep } from "./essential";
import { constants } from "@Shared/constants";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import countryData from "../../../country_state.json";

class PostJobStepTwo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visibility: 0,
      search: "",
      country: "",
      city: "",
      fullAddress: "",
      lat: undefined,
      lng: undefined,
      placeId: undefined,
      postRadius: 100,
      vendorType: 0,
      isUseClientLocation: true,
      countryList: countryData.countries.map((item) => item.country),
      stateLists: [],
    };
    this.selectJobVisibility = this.selectJobVisibility.bind(this);
    this.checkUseClientLocation = this.checkUseClientLocation.bind(this);
    this.next = this.next.bind(this);
  }

  componentDidMount() {
    this.setState({
      visibility: this.props.job.visibility || 0,
      postRadius: this.props.job.postRadius || 100.0,
      vendorType: this.props.job.vendorType || 0,
      country: this.props.job.location
        ? this.props.job.location.country
        : this.props.user.bsLocation
        ? this.props.user.bsLocation.country
        : undefined,
      state: this.props.job.location
        ? this.props.job.location.state
        : this.props.user.bsLocation
        ? this.props.user.bsLocation.state
        : undefined,
      city: this.props.job.location
        ? this.props.job.location.city
        : this.props.user.bsLocation
        ? this.props.user.bsLocation.city
        : "",
      fullAddress: this.props.job.location
        ? this.props.job.location.fullAddress
        : this.props.user.bsLocation
        ? this.props.user.bsLocation.fullAddress
        : "",
      lat: this.props.job.location
        ? this.props.job.location.lat
        : this.props.user.bsLocation
        ? this.props.user.bsLocation.lat
        : undefined,
      lng: this.props.job.location
        ? this.props.job.location.lng
        : this.props.user.bsLocation
        ? this.props.user.bsLocation.lng
        : undefined,
      isUseClientLocation:
        this.props.user.bsLocation && this.props.job.isUseClientLocation
          ? this.props.job.isUseClientLocation
          : false,
    });
  }

  checkUseClientLocation() {
    if (this.state.isUseClientLocation) {
      this.setState({
        isUseClientLocation: false,
      });
    } else {
      this.setState({
        search: "",
        country: this.props.user.bsLocation.country,
        state: this.props.user.bsLocation.state,
        city: this.props.user.bsLocation.city,
        fullAddress: this.props.user.bsLocation.fullAddress,
        lat: this.props.user.bsLocation.lat,
        lng: this.props.user.bsLocation.lng,
        isUseClientLocation: true,
      });
      this.props.form.setFieldsValue({
        country: this.props.user.bsLocation.country,
        state: this.props.user.bsLocation.state,
        city: this.props.user.bsLocation.city,
        fullAddress: this.props.user.bsLocation.fullAddress,
      });
    }
  }

  selectJobVisibility(e) {
    this.setState({
      visibility: e.target.value,
    });
  }

  handleInputChange = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  handleSelectSuggest = (geocodedPrediction, originalPrediction) => {
    this.props.form.setFieldsValue({
      fullAddress: geocodedPrediction.formatted_address,
    });
    this.setState({
      search: "",
      lat: geocodedPrediction.geometry.location.lat(),
      lng: geocodedPrediction.geometry.location.lng(),
      placeId: geocodedPrediction.place_id,
    });
  };

  handleNoResult = () => {
    process.env.NODE_ENV === "development" && console.log("No results for ", this.state.search);
  };

  handleStatusUpdate = (status) => {
    process.env.NODE_ENV === "development" && console.log("handleStatusUpdate", status);
  };

  next = async (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && this.state.lat) {
        const data = {};
        data.visibility = this.state.visibility;
        data.location = {
          country: values.country,
          state: values.state,
          city: values.city,
          fullAddress: values.fullAddress,
          lat: this.state.lat,
          lng: this.state.lng,
          placeId: this.state.placeId,
        };
        data.vendorType = this.state.vendorType;
        data.postRadius = values.postRadius;
        data.isUseClientLocation = this.state.isUseClientLocation;
        this.props.updateJob({ ...this.props.job, ...data });
        this.props.updateStep(this.props.currentStep + 1);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

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
      <div className="postjob-steptwo">
        <Form layout="vertical" onSubmit={this.next}>
          <div className="row">
            <div className="col-md-8 offset-md-2 col-sm-12 offset-sm-0">
              <div className="row">
                <div className="col-md-12 mb-4">
                  <p className=" font-weight-bold mb-3">Who can see your job</p>
                  <Radio.Group
                    onChange={this.selectJobVisibility}
                    value={this.state.visibility}
                  >
                    <Radio value={0} className="d-block mb-3">
                      Anyone
                    </Radio>
                    <Radio value={1} className="d-block mb-3">
                      Only vendors in vendorforest
                    </Radio>
                    <Radio value={2} className="d-block mb-3">
                      Invite only
                    </Radio>
                  </Radio.Group>
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
                          // @ts-ignore
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        size={"large"}
                        disabled={this.state.isUseClientLocation}
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
                          // @ts-ignore
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        size={"large"}
                        disabled={this.state.isUseClientLocation}
                      >
                        {generateStateOptions()}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item label="City">
                    {getFieldDecorator("city", {
                      initialValue: this.state.city, //solution
                      rules: [{ required: true, message: "Please input country" }],
                    })(
                      <Input
                        placeholder="City"
                        size={"large"}
                        disabled={this.state.isUseClientLocation}
                      />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-7">
                  <ReactGoogleMapLoader
                    params={{
                      key: constants.GOOGLEMAP_API,
                      libraries: "places, geocode",
                    }}
                    render={(googleMaps) =>
                      googleMaps && (
                        <ReactGooglePlacesSuggest
                          googleMaps={googleMaps}
                          autocompletionRequest={{
                            input: this.state.search,
                            // Optional options
                            // https://developers.google.com/maps/documentation/javascript/reference?hl=fr#AutocompletionRequest
                          }}
                          // Optional props
                          onNoResult={this.handleNoResult}
                          onSelectSuggest={this.handleSelectSuggest}
                          onStatusUpdate={this.handleStatusUpdate}
                          textNoResults="No Result" // null or "" if you want to disable the no results item
                          customRender={(prediction) => (
                            <div className="p-1">
                              {prediction ? prediction.description : "No Result"}
                            </div>
                          )}
                        >
                          <Form.Item label="Vendor Location">
                            {getFieldDecorator("fullAddress", {
                              initialValue: this.state.fullAddress, //solution
                              rules: [
                                { required: true, message: "Please input vendor location" },
                              ],
                            })(
                              <Input
                                placeholder="Vendor Location"
                                size={"large"}
                                disabled={this.state.isUseClientLocation}
                                onChange={this.handleInputChange}
                              />,
                            )}
                          </Form.Item>
                        </ReactGooglePlacesSuggest>
                      )
                    }
                  />
                </div>
                {this.props.user.bsLocation && (
                  <div className="col-md-5 pt-md-4 pt-2 mb-5 mt-md-2 mt-0">
                    <Checkbox
                      onChange={this.checkUseClientLocation}
                      className="mb-3 d-block"
                      checked={this.state.isUseClientLocation}
                    >
                      Use Client Location
                    </Checkbox>
                  </div>
                )}
                <div className="col-md-6">
                  <Form.Item label="Post Radius">
                    {getFieldDecorator("postRadius", {
                      initialValue: this.state.postRadius, //solution
                      rules: [{ required: true, message: "Please input radius" }],
                    })(
                      <InputNumber
                        className="w-100"
                        formatter={(value) =>
                          `${value}mile`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/mile\s?|(,*)/g, "")}
                        step={0.1}
                        size={"large"}
                      />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-12 mb-5">
                  <p className=" font-weight-bold mb-3">Vendor Type</p>
                  <Radio.Group
                    onChange={(e) => {
                      this.setState({
                        vendorType: e.target.value,
                      });
                    }}
                    value={this.state.vendorType}
                  >
                    <Radio value={0} className="d-block mb-3">
                      All Type
                    </Radio>
                    <Radio value={1} className="d-block mb-3">
                      Vendor
                    </Radio>
                    {/* <Radio value={2} className="d-block mb-3">
                      Pro Vendor
                    </Radio> */}
                  </Radio.Group>
                </div>
              </div>
            </div>
            <div className="col-md-12 d-flex justify-content-between controls">
              <button
                className="button-white"
                onClick={() => {
                  process.env.NODE_ENV === "development" && console.log("prev");
                  this.props.updateStep(this.props.currentStep - 1);
                }}
              >
                Back
              </button>
              <button className="button-primary" type="submit">
                Next
              </button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ clientPostjobReducer }) => {
  const {
    error,
    success,
    currentStep,
    user,
    services,
    vendors,
    job,
    pending,
  } = clientPostjobReducer;
  return {
    error,
    success,
    currentStep,
    user,
    services,
    vendors,
    job,
    pending,
  };
};

const ClientPostJobStepTwoForm = Form.create({ name: "client_postjob_steptwo" })(
  PostJobStepTwo,
);

export default connect(mapStateToProps, {
  updateJob,
  updateStep,
})(ClientPostJobStepTwoForm);
