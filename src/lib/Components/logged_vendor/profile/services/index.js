import React from "react";
import { Card, Icon, Tag } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import style from "./index.scss";
import { connect } from "react-redux";

import { fetchServiceData, fetchUpdateData } from "../essential";

const icons = ["icons_Home", "icons_Events", "icons_Weddings", "icons_Wellness", "icons_Venue"];

class VendorServices extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      selectedService: undefined,
      selectedCategory: undefined,
      selectedSubCategories: [],
      isEdit: false,
      user: {},
    };
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    let vendor =
      this.props.user && this.props.user.vendor && this.props.user.accountType === 1
        ? this.props.user.vendor
        : this.props.selectedVendor && this.props.selectedVendor.user.vendor;
    this.setState({
      selectedService: vendor.service,
      selectedCategory: vendor.category,
      selectedSubCategories: vendor.subCategories,
    });
    this.props.fetchServiceData();
  }

  static getDerivedStateFromProps(props, state) {
    let vendor =
      props.user && props.user.vendor && props.user.accountType === 1
        ? props.user.vendor
        : props.selectedVendor && props.selectedVendor.user.vendor;
    if (
      JSON.stringify(vendor.subCategories) !==
      JSON.stringify(state.user.vendor && state.user.vendor.subCategories)
    ) {
      return {
        user: { ...props.user },
        isEdit: false,
      };
    }
    return null;
  }

  save() {
    if (
      this.props.pending ||
      !this.state.selectedService ||
      !this.state.selectedCategory ||
      this.state.selectedSubCategories.length === 0
    ) {
      return;
    }
    const params = {
      service: this.state.selectedService,
      category: this.state.selectedCategory,
      subCategories: this.state.selectedSubCategories,
    };
    this.props.fetchUpdateData(params);
  }

  selectService(service) {
    this.setState({
      selectedService: service,
      selectedCategory: undefined,
      selectedSubCategories: [],
    });
  }

  selectCategory(category) {
    this.setState({
      selectedCategory: category,
      selectedSubCategories: [],
    });
  }

  selectSubCategory(subCategory) {
    const subCategories = [...this.state.selectedSubCategories];
    const index = subCategories.findIndex((sc) => sc === subCategory);
    if (index > -1) {
      subCategories.splice(index, 1);
    } else {
      subCategories.push(subCategory);
    }
    this.setState({
      selectedSubCategories: subCategories,
    });
  }

  getCategoryList() {
    for (let service of this.props.services) {
      if (this.state.selectedService === service._id) {
        return service.categories;
      }
    }
    return [];
  }

  getSubCategoryList() {
    for (let service of this.props.services) {
      if (this.state.selectedService === service._id) {
        for (let category of service.categories) {
          if (this.state.selectedCategory === category._id) {
            return category.subCategories;
          }
        }
      }
    }
    return [];
  }

  render() {
    let user =
      this.props.user && this.props.user.accountType === 1
        ? this.props.user
        : this.props.selectedVendor && this.props.selectedVendor.user;
    const isPublic = this.props.user ? false : true;

    const generateMyServices = () => {
      if (user.vendor.subCategories.length === 0) {
        return <h6 className="p-3 w-100 text-center text-danger">No Service</h6>;
      }
      return user.vendor.subCategories.map((subCategory, index) => {
        return (
          <Tag color="#07b107" className="mb-2 p-2 text-white" key={index}>
            {subCategory}
          </Tag>
        );
      });
    };

    const generateMyTempServices = () => {
      if (this.state.selectedSubCategories.length === 0) {
        return <h6 className="p-3 w-100 text-center text-danger">No Service</h6>;
      }
      return this.state.selectedSubCategories.map((subCategory, index) => {
        return (
          <Tag color="#07b107" className="mb-2 p-2 text-white" key={index}>
            {subCategory}
          </Tag>
        );
      });
    };

    const generateServiceList = () => {
      return this.props.services.map((service, index) => {
        return (
          <div key={index} className="col-md-2 col-sm-12 mb-2">
            <div
              className="shadow px-2 py-2 py-md-3 text-center text-grey service-type pointer"
              onClick={() => {
                this.selectService(service._id);
              }}
            >
              <span
                className={`inline-block ${
                  this.state.selectedService === service._id ? "text-color" : ""
                }`}
              >
                <img
                  src={require(`../../../images/NewIcons/${icons[index]}.png`)}
                  style={{ height: "30px" }}
                  className="h3 mr-2"
                  alt=""
                />
                {service.name}
              </span>
            </div>
          </div>
        );
      });
    };

    const generateCategoryList = () => {
      return this.getCategoryList().map((category, index) => {
        return (
          <Tag
            color={this.state.selectedCategory === category._id ? "#07b107" : "#eee"}
            className={`mb-2 p-2 ${
              this.state.selectedCategory === category._id ? "text-white" : "text-dark"
            }`}
            key={index}
            onClick={() => {
              this.selectCategory(category._id);
            }}
          >
            {category.name}
          </Tag>
        );
      });
    };

    const generateSubCategoryList = () => {
      return this.getSubCategoryList().map((subCategory, index) => {
        return (
          <Tag
            color={
              this.state.selectedSubCategories.indexOf(subCategory) > -1 ? "#07b107" : "#eee"
            }
            className={`mb-2 p-2 ${
              this.state.selectedSubCategories.indexOf(subCategory) > -1
                ? "text-white"
                : "text-dark"
            }`}
            key={index}
            onClick={() => {
              this.selectSubCategory(subCategory);
            }}
          >
            {subCategory}
          </Tag>
        );
      });
    };

    return (
      <div className="vendor-services">
        <Card
          title={<span className="h5 font-weight-bold">Service</span>}
          className="shadow"
          style={{ marginBottom: "50px" }}
          extra={
            !this.state.isEdit &&
            !isPublic && (
              <div
                onClick={() => {
                  this.setState({
                    isEdit: !this.state.isEdit,
                  });
                }}
                className="text-color editable h5"
                style={{
                  cursor: "pointer",
                  height: "35px",
                  width: "35px",
                  borderRadius: "100%",
                  paddingTop: "5px",
                  paddingLeft: "7px",
                }}
              >
                <Icon type="edit" />
              </div>
            )
          }
        >
          {!this.props.services && this.props.pending && (
            <div className="w-100 p-5 text-center loading-small">
              <Icon type="sync" spin />
            </div>
          )}
          {this.props.services && (
            <div className="row">
              {!this.state.isEdit && (
                <div className="col-md-12 mb-5">
                  <h6 className="mb-4 font-weight-bold">My Services</h6>
                  {generateMyServices()}
                </div>
              )}
              {this.state.isEdit && !isPublic && (
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12 mb-5">
                      <h6 className="mb-4 font-weight-bold">My Services</h6>
                      {generateMyTempServices()}
                    </div>
                    <div className="col-md-12 mb-5">
                      <h6 className="mb-4 font-weight-bold">Services</h6>
                      <div className="row justify-content-center">{generateServiceList()}</div>
                    </div>
                    <div className="col-md-12 mb-5">
                      <h6 className="mb-4 font-weight-bold">Categories</h6>
                      {generateCategoryList()}
                    </div>
                    <div className="col-md-12 mb-5">
                      <h6 className="mb-4 font-weight-bold">Subcategories</h6>
                      {generateSubCategoryList()}
                    </div>
                    <div className="col-12 controls d-flex justify-content-end">
                      <button
                        className="button-white mr-2"
                        onClick={() => {
                          this.setState({
                            isEdit: false,
                            selectedService: user.vendor.service,
                            selectedCategory: user.vendor.category,
                            selectedSubCategories: user.vendor.subCategories,
                          });
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className={`button-primary ${
                          this.props.pending ||
                          !this.state.selectedService ||
                          !this.state.selectedCategory ||
                          this.state.selectedSubCategories.length === 0
                            ? "disable"
                            : ""
                        }`}
                        onClick={this.save}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = ({ vendorProfileReducer }) => {
  const { error, user, services, pending } = vendorProfileReducer;
  return {
    error,
    user,
    services,
    pending,
  };
};

export default connect(mapStateToProps, {
  fetchServiceData,
  fetchUpdateData,
})(withStyles(style)(VendorServices));
