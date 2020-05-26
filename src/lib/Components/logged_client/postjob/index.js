import React from "react";
import { connect } from "react-redux";
import { Steps, Button, message, Icon, Tag } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import { Header, Footer } from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import PostJobStepOne from "./PostJobStepOne";
import PostJobStepTwo from "./PostJobStepTwo";
import PostJobStepThree from "./PostJobStepThree";
import { updateJob, fetchInitialData, fetchServiceData, fetchGetJob } from "./essential";
const Step = Steps.Step;

const steps = [
  {
    title: "Details",
    content: <PostJobStepOne />,
  },
  {
    title: "Visibility",
    content: <PostJobStepTwo />,
  },
  {
    title: "Invite & Budget",
    content: <PostJobStepThree />,
  },
];

const icons = ["icons_Home", "icons_Events", "icons_Weddings", "icons_Wellness", "icons_Venue"];

class PostJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchInitialData();
    this.props.fetchServiceData();
    process.env.NODE_ENV === "development" && console.log("id", this.props.match.params.id);
    if (this.props.match.params.id) {
      // this.props.updateJob({
      //     service: '',
      //     category: '',
      //     subCategories: [],
      //     budgetType: 0,
      //     isUseClientLocation: true,
      // })
      fetchGetJob({
        _id: this.props.match.params.id,
      }).then((data) => {
        this.props.updateJob({
          ...data.data,
          service: data.data.service._id,
          category: data.data.category._id,
          isUseClientLocation: false,
          hiredVendors: data.data.hiredVendors.map((vendor) => vendor._id),
          invitedVendors: data.data.invitedVendors.map((vendor) => vendor._id),
        });
      });
    } else {
      this.props.updateJob({
        service: "",
        category: "",
        subCategories: [],
        budgetType: 0,
        isUseClientLocation: true,
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.success && newProps.success) {
      message.success(newProps.success);
    }
    if (!this.props.error && newProps.error) {
      message.error(newProps.error);
    }
  }

  selectService(service) {
    this.props.updateJob({
      ...this.props.job,
      service: service,
      category: "",
      subCategories: [],
    });
  }

  selectCategory(category) {
    this.props.updateJob({
      ...this.props.job,
      category: category,
      subCategories: [],
    });
  }

  selectSubCategory(subCategory) {
    const subCategories = [...this.props.job.subCategories];
    const index = subCategories.indexOf(subCategory);
    if (index > -1) {
      subCategories.splice(index, 1);
    } else {
      subCategories.push(subCategory);
    }
    this.props.updateJob({
      ...this.props.job,
      subCategories: subCategories,
    });
  }

  getCategoryList() {
    for (let service of this.props.services) {
      if (this.props.job.service === service._id) {
        return service.categories;
      }
    }
    return [];
  }

  getSubCategoryList() {
    for (let service of this.props.services) {
      if (this.props.job.service === service._id) {
        for (let category of service.categories) {
          if (this.props.job.category === category._id) {
            return category.subCategories;
          }
        }
      }
    }
    return [];
  }

  render() {
    process.env.NODE_ENV === "development" && console.log(this.props.services);

    const generateServiceList = () => {
      if (!this.props.services) {
        return "";
      }
      return this.props.services.map((service, index) => {
        return (
          <div key={index} className="col-md-2 col-sm-12 mb-2">
            <div
              className="shadow px-2 py-2 py-md-3 text-center text-grey service-type"
              onClick={() => {
                this.selectService(service._id);
              }}
            >
              <span
                className={`inline-block ${
                  this.props.job.service === service._id ? "text-color" : ""
                }`}
              >
                <img
                  src={require(`../../images/NewIcons/${icons[index]}.png`)}
                  style={{ height: "40px" }}
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
            color={this.props.job.category === category._id ? "#07b107" : "#eee"}
            className={`mb-2 p-2 ${
              this.props.job.category === category._id ? "text-white" : "text-dark"
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
            color={this.props.job.subCategories.indexOf(subCategory) > -1 ? "#07b107" : "#eee"}
            className={`mb-2 p-2 ${
              this.props.job.subCategories.indexOf(subCategory) > -1
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
      <div className="client-postjob">
        <Header />
        <div className="content">
          <div className="container">
            {this.props.user && this.props.job ? (
              <div className="row">
                <div className="col-12 mb-md-5 mb-3">
                  <div className="services p-md-3 p-2 bg-white shadow">
                    <h5 className="text-grey mb-3 mb-md-4">Posting Job in:</h5>
                    <div className="row justify-content-center">{generateServiceList()}</div>
                  </div>
                </div>
                <div className="col-12 mb-md-5 mb-3">
                  <div className="services p-md-3 p-2 bg-white shadow">
                    <h5 className="text-grey mb-3 mb-md-4">What do you need help with?</h5>
                    {generateCategoryList()}
                  </div>
                </div>
                <div className="col-12 mb-md-5 mb-3">
                  <div className="services p-md-3 p-2 bg-white shadow">
                    <h5 className="text-grey mb-3 mb-md-4">What needs work?</h5>
                    {generateSubCategoryList()}
                  </div>
                </div>
                <div className="col-12 mb-md-4 mb-3">
                  <div className="steps-head">
                    <Steps size="small" current={this.props.currentStep}>
                      {steps.map((step, index) => (
                        <Step key={index} title={step.title} />
                      ))}
                    </Steps>
                  </div>
                </div>
                <div className="col-12 mb-3">
                  <div className="steps-content">{steps[this.props.currentStep].content}</div>
                </div>
              </div>
            ) : (
              <div className="text-center loading">
                <Icon type="sync" spin />
              </div>
            )}
          </div>
        </div>
        <Footer />
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

export default connect(mapStateToProps, {
  updateJob,
  fetchInitialData,
  fetchServiceData,
})(withStyles(globalStyle, localStyle)(PostJob));
