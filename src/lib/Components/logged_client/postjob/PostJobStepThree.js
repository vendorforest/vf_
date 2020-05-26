import React from "react";
import { connect } from "react-redux";
import { InputNumber, Radio, Input, List, Icon, Select, message } from "antd";
import VendorItem from "./VendorItem";
import moment from "moment";
import {
  updateJob,
  updateStep,
  fetchMatchVendorData,
  fetchPostJob,
  sendEmail,
  fetchUpdateJob,
} from "./essential";
import { constants } from "@Shared/constants";
import { withRouter } from "react-router-dom";
const Search = Input.Search;

class PostJobStepThree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pending: false,
      avbHrsPerWeek: 0,
      budgetType: 0,
      budget: 1.0,
      invitedVendors: this.props.job.invitedVendors || [],
      searchVendors: this.props.vendors,
      minBudget: 5,
    };
    this.post = this.post.bind(this);
    this.selectBudgetType = this.selectBudgetType.bind(this);
    this.updateInvtedVendor = this.updateInvtedVendor.bind(this);
  }

  selectBudgetType(e) {
    this.setState({
      budgetType: e.target.value,
    });
  }

  updateInvtedVendor(vendors) {
    this.setState({
      invitedVendors: vendors,
    });
  }

  getSuggetionBudget() {
    if (!this.props.vendors || this.props.vendors.length === 0) {
      return;
    }
    const duration = moment.duration(
      moment(this.props.job.endDateTime).diff(moment(this.props.job.stDateTime)),
    );
    const days = duration.asDays();
    let minVendor = this.props.vendors[0];
    let maxVendor = this.props.vendors[0];
    this.props.vendors.forEach((vendor) => {
      if (vendor.vendor.hourlyRate < minVendor.vendor.hourlyRate) {
        minVendor = vendor;
      }
      if (vendor.vendor.hourlyRate > maxVendor.vendor.hourlyRate) {
        maxVendor = vendor;
      }
    });
    let hrsPerDay = 8;
    if (this.state.avbHrsPerWeek === 0) {
      hrsPerDay = 2;
    } else if (this.state.avbHrsPerWeek === 1) {
      hrsPerDay = 4;
    }
    if (this.state.budgetType === 0) {
      const minBudget = days * hrsPerDay * minVendor.vendor.hourlyRate;
      if (this.state.minBudget === 5) {
        this.setState({
          minBudget: minBudget,
        });
      }
      return `Suggestion Budget: $${(days * hrsPerDay * minVendor.vendor.hourlyRate).toFixed(
        2,
      )} ~ $${(days * hrsPerDay * maxVendor.vendor.hourlyRate).toFixed(2)}`;
    } else {
      return `Suggestion Budget: $${minVendor.vendor.hourlyRate}/hr ~ $${maxVendor.vendor.hourlyRate}/hr`;
    }
  }

  componentDidMount() {
    this.props.job &&
      this.setState({
        budgetType: this.props.job.budgetType,
        budget: this.props.job.budget || 5.0,
      });
    this.props.job &&
      this.props.job.location &&
      this.props.fetchMatchVendorData({
        radius: this.props.job.postRadius,
        lat: this.props.job.location.lat,
        lng: this.props.job.location.lng,
      });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.error) {
      message.error(props.error.message);
    } else if (props.success) {
      message.success(props.success.message);
      props.history.push("/client");
    }
    if (props.vendors) {
      return {
        searchVendors: props.vendors,
        pending: props.pending,
        success: props.success,
        error: props.error,
      };
    }
    return null;
  }

  post() {
    const data = {
      avbHrsPerWeek: this.state.avbHrsPerWeek,
      budgetType: this.state.budgetType,
      budget: this.state.budget,
      invitedVendors: this.state.invitedVendors,
    };
    const job = { ...this.props.job, ...data };
    const params = {
      _id: job._id,
      status: job.status,
      service: job.service,
      category: job.category,
      subCategories: job.subCategories,
      title: job.title,
      description: job.description,
      budgetType: job.budgetType,
      budget: job.budget,
      avbHrsPerWeek: job.avbHrsPerWeek,
      stDateTime: job.stDateTime,
      endDateTime: job.endDateTime,
      location: job.location,
      postRadius: job.postRadius,
      attachFiles: job.attachFiles,
      questions: job.questions,
      visibility: job.visibility,
      vendorType: job.vendorType,
      invitedVendors: job.invitedVendors,
    };
    if (params._id) {
      this.updatePostedJob(params);
    } else {
      params.status = constants.JOB_STATUS.POSTED;
      if (params.budget < this.state.minBudget) {
        message.warning("Your budget is lower than suggest budget");
      } else {
        this.createJob(params);
      }
      // sendEmail(params);
    }
  }

  async createJob(params) {
    if (!this.state.pending) {
      // await this.props.fetchPostJob(params)
      fetchPostJob(params)
        .then((data) => {
          this.setState({
            pending: false,
          });
          this.props.updateJob(data.data);
          message.success(data.message);
          this.props.history.push("/client");
        })
        .catch((error) => {
          this.setState({
            pending: false,
          });
          process.env.NODE_ENV === "development" && console.log(error);
          message.success(error.message);
        });
    }
  }

  updatePostedJob(params) {
    if (!this.state.pending) {
      // await this.props.fetchUpdateJob(params);
      fetchUpdateJob(params)
        .then((data) => {
          this.setState({
            pending: false,
          });
          this.props.updateJob(data.data);
          message.success(data.message);
          this.props.history.push("/client");
        })
        .catch((error) => {
          this.setState({
            pending: false,
          });
          process.env.NODE_ENV === "development" && console.log(error);
          message.success(error.message);
        });
    }
  }

  render() {
    const generrateAvbHrsPerWeek = () => {
      return constants.AVB_HRSPERWEEKS.map((hrs, index) => {
        return (
          <Select.Option value={index} key={index}>
            {hrs}
          </Select.Option>
        );
      });
    };

    return (
      <div className="postjob-stepthree">
        <div className="row">
          <div className="col-md-8 mb-5">
            <p className=" font-weight-bold mb-3">Available Hours</p>
            <Select
              value={this.state.avbHrsPerWeek}
              onChange={(value) => {
                this.setState({
                  avbHrsPerWeek: Number(value),
                });
              }}
              size={"large"}
            >
              {generrateAvbHrsPerWeek()}
            </Select>
          </div>
          <div className="col-md-8 mb-4">
            <p className=" font-weight-bold mb-3">What's your budget</p>
            <Radio.Group onChange={this.selectBudgetType} value={this.state.budgetType}>
              <Radio value={0} className="mb-3">
                Fixed
              </Radio>
              {/* <Radio value={1} className="mb-3">
                Hourly
              </Radio> */}
            </Radio.Group>
            <InputNumber
              value={this.state.budget}
              min={1}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              step={0.1}
              onChange={(budget) => {
                this.setState({
                  budget: budget || 5.0,
                });
              }}
              size={"large"}
            />
            <span
              className={this.state.budgetType === constants.BUDGET_TYPE.HOURLY ? "" : "d-none"}
            >
              {" "}
              / hr
            </span>
            <span className="ml-3 text-color">{this.getSuggetionBudget()}</span>
          </div>
          <div className="col-md-12 position-relative">
            <h6 className="mb-3 font-weight-bold">Invite Vendors</h6>
            <div className="search-bar">
              <Search
                placeholder="Find Vendor"
                onSearch={(value) => {
                  this.setState({
                    searchVendors: this.props.vendors.filter(
                      (vendor) => vendor.username.toLowerCase().indexOf(value) > -1,
                    ),
                  });
                }}
                className="mb-2"
                size={"large"}
                enterButton
              />
            </div>
            {!this.props.vendors && this.props.pending && (
              <div className="text-center loading-small p-5 mb-5">
                <Icon type="sync" spin />
              </div>
            )}
            {this.props.vendors && (
              <List
                itemLayout="vertical"
                size="large"
                className="vendor-list border mb-5"
                pagination={{
                  onChange: (page) => {
                    process.env.NODE_ENV === "development" && console.log(page);
                  },
                  pageSize: 5,
                }}
                dataSource={this.state.searchVendors}
                footer={<div></div>}
                renderItem={(item, index) => (
                  <List.Item key={index} style={{ cursor: "pointer" }}>
                    <VendorItem
                      vendor={item}
                      invitedVendors={this.state.invitedVendors}
                      updateInvtedVendor={this.updateInvtedVendor}
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
          <div className="col-md-12 d-flex justify-content-between controls">
            <button
              className="button-white"
              onClick={() => this.props.updateStep(this.props.currentStep - 1)}
            >
              Back
            </button>
            <button
              className={`button-primary ${this.state.pending ? "disable" : ""}`}
              onClick={this.post}
            >
              {this.props.job._id ? "Update" : "Post"}
            </button>
          </div>
        </div>
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
  updateStep,
  fetchUpdateJob,
  fetchMatchVendorData,
  fetchPostJob,
})(withRouter(PostJobStepThree));
