// @ts-nocheck
import React from "react";
import { connect } from "react-redux";
import { Input, Radio, Icon, List, Select } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import {Header, Footer} from "@Components/inc";
import JobItem from "./JobItem";
import Warning from "./warning";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { constants } from "@Shared/constants";
import countryData from "@Shared/country_state.json";
import store from "store";

import { fetchFindJobsData, fetchServiceData, fetchUserInfo } from "./essential";
const { Option } = Select;

const Search = Input.Search;

class VendorFindJob extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: [],
      filterServices: [],
      filterService: -1,
      filterCategories: [],
      filterCategory: -1,
      filterBudgetType: -1,
      filterAnyLocation: true,
      filterCountries: ["All", ...countryData.countries.map((item) => item.country)],
      filterCountry: 0,
      filterCity: "",
      filterVendorType: 0,
      showFilter: true,
      // account: undefined,
      // company: undefined,
      // bill: undefined,
      // service: undefined,
    };
  }

  // static async fetchInitialData(store) {}

  componentDidMount() {
    this.props.fetchFindJobsData({
      status: [constants.JOB_STATUS.POSTED, constants.JOB_STATUS.HIRED],
    });
    this.props.fetchServiceData();
    this.props.fetchUserInfo();
    // if (this.props.userInfo) {
    //   const account = this.props.userInfo.bsLocation ? true : undefined;
    //   const billingMethod = this.props.userInfo.connectedAccountId ? true : undefined;
    //   const company = this.props.userInfo.vendor.company ? true : undefined;
    //   const service = this.props.userInfo.vendor.service ? true : undefined;
    //   this.setState({
    //     account: account,
    //     company: company,
    //     bill: billingMethod,
    //     service: service,
    //   });
    // }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.services) {
      return {
        success: props.success,
        error: props.error,
        filterServices: props.services,
        filterCategories:
          state.filterService === -1 ? [] : props.services[state.filterService].categories,
      };
    }
    if (!state.error && props.error) {
      if (props.error.status === 302) {
        store.clearAll();
        window.location.href = "/login";
      }
    }
    return {
      success: props.success,
      error: props.error,
      ...state,
    };
  }

  search(searchParams) {
    const params = {
      // @ts-ignore
      service:
        this.state.filterService === -1
          ? undefined
          : this.state.filterServices[this.state.filterService]._id,
      // @ts-ignore
      category:
        this.state.filterCategory === -1
          ? undefined
          : this.state.filterCategories[this.state.filterCategory]._id,
      budgetType: this.state.filterBudgetType === -1 ? undefined : this.state.filterBudgetType,
      location: this.state.filterAnyLocation
        ? undefined
        : {
            country: this.state.filterCountries[this.state.filterCountry],
            city: this.state.filterCity === "" ? undefined : this.state.filterCity,
          },
      vendorType: this.state.filterVendorType === 0 ? undefined : this.state.filterVendorType,
      status: [0, 1],
      ...searchParams,
    };
    this.props.fetchFindJobsData(params);
  }

  render() {
    const generateFilterServiceOptions = () => {
      // @ts-ignore
      return this.state.filterServices.map((service, index) => {
        return (
          <Option key={index} value={index}>
            {service.name}
          </Option>
        );
      });
    };

    const generateFilterCategoryOptions = () => {
      // @ts-ignore
      return this.state.filterCategories.map((category, index) => {
        return (
          <Option key={index} value={index}>
            {category.name}
          </Option>
        );
      });
    };

    const generateFilterCountryOptions = () => {
      return this.state.filterCountries.map((country, index) => {
        return (
          <Option key={index} value={index}>
            {country}
          </Option>
        );
      });
    };

    return (
      <div className="vendor-find-job">
        <Header />
        <div className="content">
          <div className="container">
            {this.props.userInfo !== undefined ? <Warning data={this.props.userInfo} /> : null}
            <div className="row">
              <div className="col-md-3 mb-4">
                <div
                  className="d-flex justify-content-between shadow bg-white d-block d-md-none mb-1 pointer text-color"
                  style={{ padding: "12px" }}
                  onClick={() => {
                    this.setState({
                      showFilter: !this.state.showFilter,
                    });
                  }}
                >
                  <div>Search Filter Setting</div>
                  <div>{this.state.showFilter ? <Icon type="up" /> : <Icon type="down" />}</div>
                </div>
                <div
                  className={`filter ${
                    this.state.showFilter ? "d-block" : "d-none d-md-block"
                  }`}
                >
                  <div className="service mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Service</h6>
                    <Select
                      showSearch
                      optionFilterProp="children"
                      onChange={(value) => {
                        this.setState({
                          filterService: Number(value),
                          filterCategories:
                            Number(value) === -1
                              ? []
                              : this.props.services[Number(value)].categories,
                          filterCategory: -1,
                        });
                        this.search({
                          service:
                            Number(value) === -1
                              ? undefined
                              : this.state.filterServices[Number(value)]._id,
                          category: undefined,
                        });
                      }}
                      onFocus={() => {}}
                      onBlur={() => {}}
                      onSearch={() => {}}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      value={this.state.filterService}
                      size={"large"}
                    >
                      <Option key={-1} value={-1}>
                        All
                      </Option>
                      {generateFilterServiceOptions()}
                    </Select>
                  </div>
                  <div className="category mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Category</h6>
                    <Select
                      showSearch
                      optionFilterProp="children"
                      onChange={(value) => {
                        this.setState({
                          filterCategory: Number(value),
                        });
                        this.search({
                          category:
                            Number(value) === -1
                              ? undefined
                              : this.state.filterCategories[Number(value)]._id,
                        });
                      }}
                      onFocus={() => {}}
                      onBlur={() => {}}
                      onSearch={() => {}}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      value={this.state.filterCategory}
                      size={"large"}
                    >
                      <Option key={-1} value={-1}>
                        All
                      </Option>
                      {generateFilterCategoryOptions()}
                    </Select>
                  </div>
                  <div className="budget-type mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Budget Type</h6>
                    <Radio.Group
                      onChange={(e) => {
                        this.setState({
                          filterBudgetType: e.target.value,
                        });
                        this.search({
                          budgetType: e.target.value === -1 ? undefined : e.target.value,
                        });
                      }}
                      value={this.state.filterBudgetType}
                    >
                      <Radio value={-1} className="d-block mb-2">
                        All Jobs
                      </Radio>
                      <Radio value={0} className="d-block mb-2">
                        Fixed Price
                      </Radio>
                      <Radio value={1} className="d-block mb-2">
                        Hourly
                      </Radio>
                    </Radio.Group>
                  </div>
                  <div className="location mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Location</h6>
                    <p
                      onClick={() => {
                        this.setState({
                          filterAnyLocation: true,
                          filterCountry: 0,
                          filterCity: "",
                        });
                      }}
                      className={`pointer mb-2 ${
                        this.state.filterAnyLocation ? "text-color" : ""
                      }`}
                    >
                      Any Location
                    </p>
                    <p>Country</p>
                    <Select
                      showSearch
                      optionFilterProp="children"
                      onChange={(value) => {
                        this.setState({
                          filterCountry: Number(value),
                          filterAnyLocation: Number(value) === 0 ? true : false,
                          filterCity: "",
                        });
                        this.search({
                          location:
                            Number(value) === 0
                              ? undefined
                              : {
                                  country: this.state.filterCountries[Number(value)],
                                  city: undefined,
                                },
                        });
                      }}
                      onFocus={() => {}}
                      onBlur={() => {}}
                      onSearch={() => {}}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      value={this.state.filterCountry}
                      className="mb-2"
                      size={"large"}
                    >
                      {generateFilterCountryOptions()}
                    </Select>
                    {this.state.filterCountry !== 0 && (
                      <div>
                        <p>City</p>
                        <Input
                          value={this.state.filterCity}
                          onChange={(e) => {
                            this.setState({
                              filterCity: e.target.value,
                            });
                          }}
                          onBlur={(e) => {
                            this.search({
                              location: {
                                country: this.state.filterCountries[this.state.filterCountry],
                                city: e.target.value === "" ? undefined : e.target.value,
                              },
                            });
                          }}
                          size={"large"}
                        />
                      </div>
                    )}
                  </div>
                  <div className="budget-type mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Vendor Type</h6>
                    <Radio.Group
                      onChange={(e) => {
                        this.setState({
                          filterVendorType: e.target.value,
                        });
                        this.search({
                          vendorType: e.target.value === 0 ? undefined : e.target.value,
                        });
                      }}
                      value={this.state.filterVendorType}
                    >
                      <Radio value={0} className="d-block mb-2">
                        All Type
                      </Radio>
                      <Radio value={1} className="d-block mb-2">
                        Vendor
                      </Radio>
                      {/* <Radio value={2} className="d-block mb-2">
                        Pro Vendor
                      </Radio> */}
                    </Radio.Group>
                  </div>
                </div>
              </div>
              <div className="col-md-9">
                <Search
                  placeholder="Find Job"
                  onSearch={(value) =>
                    this.search({
                      title: value === "" ? undefined : value,
                    })
                  }
                  className="mb-4 searchbar"
                  enterButton
                />
                {(this.props.pending || !this.props.jobs) && (
                  <div
                    className="w-100 p-5 text-center loading-small bg-white"
                    style={{ boxShadow: "0 1px 3px rgba(57, 73, 76, 0.35)" }}
                  >
                    <Icon type="sync" spin />
                  </div>
                )}
                {this.props.jobs && (
                  <List
                    itemLayout="vertical"
                    size="large"
                    className="job-list"
                    pagination={{
                      onChange: (page) => {
                        process.env.NODE_ENV === "development" && console.log(page);
                      },
                      pageSize: 20,
                    }}
                    dataSource={this.props.jobs}
                    footer={<div></div>}
                    renderItem={(item, index) => (
                      <List.Item
                        key={index}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          this.props.history.push(`/vendor/job/${item._id}`);
                        }}
                      >
                        <JobItem job={item} history={this.props.history} />
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ vendorFindJobReducer, loginReducer }) => {
  const { error, success, jobs, services, pending, userInfo } = vendorFindJobReducer;
  const { user } = loginReducer;
  return {
    error,
    success,
    jobs,
    services,
    pending,
    user,
    userInfo,
  };
};

export default connect(mapStateToProps, {
  fetchFindJobsData,
  fetchServiceData,
  fetchUserInfo,
})(withStyles(globalStyle, localStyle)(VendorFindJob));
