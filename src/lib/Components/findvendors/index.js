import React from "react";
import { Input, Radio, Icon, List, Checkbox, Select } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import VendorItem from "./VendorItem";

import { connect } from "react-redux";
import { fetchInitData, fetchFindVendorsData } from "./essential";

import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const Search = Input.Search;

const filterServicesList = ["Home", "Events", "Weddings", "Wellness", "Venue"];
const filterCategoryList = [
  "All Category",
  "Category1",
  "Category2",
  "Category3",
  "Category4",
  "Category5",
];
const filterSubcategoryList = [
  "All Subcategory",
  "Subcategory1",
  "Subcategory2",
  "Subcategory3",
  "Subcategory4",
];

class FindVendors extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      vendors: [],
      // showFilter: true,
      // filterCity: "",
      // filterServices: [],
      // filterCategory: 0,
      // filterSubcategory: 0,
      filterTravel: 0,
      filterUserType: 0,

      // jobs: [],
      filterServices: [],
      filterService: -1,
      filterCategories: [],
      filterCategory: -1,
      filterBudgetType: -1,
      filterAnyLocation: true,
      filterCountry: 0,
      filterCity: undefined,
      filterVendorType: 0,
      showFilter: true,
    };
  }

  componentDidMount() {
    this.props.fetchInitData();
    this.props.fetchFindVendorsData({ status: 0 });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.homedata) {
      return {
        // vendors: props.homedata.vendors,
        filterServices: props.homedata.services,
        filterCategories:
          state.filterService === -1
            ? []
            : props.homedata.services[state.filterService].categories,
      };
    }
    return null;
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
      // budgetType: this.state.filterBudgetType === -1 ? undefined : this.state.filterBudgetType,
      city: this.state.filterCity,
      // vendorType: this.state.filterVendorType === 0 ? undefined : this.state.filterVendorType,
      // status: [0, 1],
      ...searchParams,
    };
    this.props.fetchFindVendorsData(params);
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

    const generateFilterSubcategoryOptions = () => {
      return filterSubcategoryList.map((subcategory, index) => {
        return (
          <Option key={index} value={String(index)}>
            {subcategory}
          </Option>
        );
      });
    };

    return (
      <div className="find-vendor">
        <Header />
        <div className="content">
          <div className="container">
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
                  <div className="city mb-4">
                    <Input
                      placeholder="Zip Code or City"
                      onChange={(e) => {
                        this.setState({
                          filterCity: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="service mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Service offers</h6>
                    <Select
                      showSearch
                      optionFilterProp="children"
                      onChange={(value) => {
                        this.setState({
                          filterService: Number(value),
                          filterCategories:
                            Number(value) === -1
                              ? []
                              : this.props.homedata.services[Number(value)].categories,
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
                    <h6 className="pb-3 border-bottom mb-2">Travel Preference</h6>
                    <Radio.Group
                      onChange={(e) => {
                        this.setState({
                          filterTravel: e.target.value,
                        });
                      }}
                      value={this.state.filterTravel}
                    >
                      <Radio value={0} className="d-block mb-2">
                        Can travel to customers
                      </Radio>
                      <Radio value={1} className="d-block mb-2">
                        Customers travel to me
                      </Radio>
                    </Radio.Group>
                  </div>
                  <div className="budget-type mb-4">
                    <h6 className="pb-3 border-bottom mb-2">User Type</h6>
                    <Radio.Group
                      onChange={(e) => {
                        this.setState({
                          filterUserType: e.target.value,
                        });
                      }}
                      value={this.state.filterUserType}
                    >
                      {/* <Radio value={0} className="d-block mb-2">
                        Pro Vendor
                      </Radio> */}
                      <Radio value={1} className="d-block mb-2">
                        Vendor
                      </Radio>
                    </Radio.Group>
                  </div>
                </div>
              </div>
              <div className="col-md-9">
                <div className="search-bar">
                  <Search
                    placeholder="Find Vendor"
                    onSearch={(value) =>
                      this.search({
                        title: value === "" ? undefined : value,
                      })
                    }
                    className="mb-4"
                    enterButton
                  />
                </div>
                {this.props.vendors && (
                  <List
                    itemLayout="vertical"
                    size="large"
                    className="vendor-list"
                    pagination={{
                      onChange: (page) => {
                        process.env.NODE_ENV === "development" && console.log(page);
                      },
                      pageSize: 20,
                    }}
                    dataSource={this.props.vendors}
                    footer={<div></div>}
                    renderItem={(item, index) => (
                      <List.Item key={index} style={{ cursor: "pointer" }}>
                        <VendorItem vendor={item} />
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

const mapStateToProps = ({ homeReducer, loginReducer, clientFindVendorReducer }) => {
  const { error, homedata, success, pending } = homeReducer;
  const { vendors } = clientFindVendorReducer;
  const { user } = loginReducer;

  return { error, homedata, success, pending, user, vendors };
};

export default connect(mapStateToProps, {
  fetchInitData,
  fetchFindVendorsData,
})(withStyles(globalStyle, localStyle)(FindVendors));
