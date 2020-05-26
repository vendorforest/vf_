import React from "react";
import { Icon, Avatar, Progress, Rate, InputNumber, Form, DatePicker, message } from "antd";
import { constants } from "@Shared/constants";
import moment from "moment";
import { connect } from "react-redux";
import { fetchCreateContract, updateJob, updateProposal } from "./essential";
import defaultProfileImage from "@Components/images/profileplace.png";

const firebase = require("firebase/app");
class CreateContract extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contractStDateTime:
        moment()
          .add(1, "hours")
          .toDate()
          .getTime() >
        moment(this.props.job.stDateTime)
          .toDate()
          .getTime()
          ? moment().add(1, "hours")
          : moment(this.props.job.stDateTime),
      contractEndDateTime:
        moment()
          .add(1, "days")
          .toDate()
          .getTime() >
        moment(this.props.job.endDateTime)
          .toDate()
          .getTime()
          ? moment().add(1, "days")
          : moment(this.props.job.endDateTime),
      contractBudget: this.props.job.budget,
      contractBudgetType: this.props.job.budgetType,
      limitTime: 1,
      estimatedPrice: this.props.job.budget * 1,
      pending: false,
    };
    this.create = this.create.bind(this);
  }

  async create() {
    const docKey = [this.props.user.userObj.email, this.props.proposal.vendor.email]
      .sort()
      .join(":");
    // await firebase
    //   .firestore()
    //   .collection("chats")
    //   .doc(docKey)
    //   .set({
    //     messages: [
    //       {
    //         message: "Hi.",
    //         sender: this.props.user.userObj.email,
    //         timeStamp: Date.now(),
    //       },
    //     ],
    //     users: [this.props.user.userObj.email, this.props.proposal.vendor.email],
    //     userNames: [this.props.user.userObj.username, this.props.proposal.vendor.username],
    //     receiverHadRead: false,
    //     jobTitle: this.props.job.title,
    //     service: this.props.job.service.name,
    //     category: this.props.job.category.name,
    //     contract: 0,
    //     createdAt: Date.now(),
    //   })
    //   .then((result) => {
    //     if (
    //       this.state.contractStDateTime.toDate().getTime() <
    //         moment()
    //           .toDate()
    //           .getTime() ||
    //       this.state.contractEndDateTime.toDate().getTime() <
    //         moment()
    //           .toDate()
    //           .getTime() ||
    //       this.state.contractEndDateTime.toDate().getTime() <
    //         this.state.contractStDateTime.toDate().getTime()
    //     ) {
    //       message.warning("Invalid contract time range");
    //       return;
    //     }
        const params = {
          job: this.props.job._id,
          vendor: this.props.proposal.vendor._id,
          proposal: this.props.proposal._id,
          budget: this.state.contractBudget,
          limitTime:
            this.props.job.budgetType === constants.BUDGET_TYPE.HOURLY
              ? this.state.limitTime
              : undefined,
          stDateTime: this.state.contractStDateTime.toDate(),
          endDateTime: this.state.contractEndDateTime.toDate(),
        };
        this.createContract(params);
        window.location.href = `/client/hire/${params.job}&${params.vendor}`;
      // })
      // .catch((error) => {
      //   process.env.NODE_ENV === "development" && console.log("error = ", error);
      // });
  }

  async createContract(params) {
    this.setState({ pending: true });
    await fetchCreateContract(params)
      .then((data) => {
        this.setState({ pending: false });
        const job = { ...this.props.job };
        job.hiredVendors.push(this.props.proposal.vendor._id);
        this.props.updateJob(job);
        this.props.proposal.status = constants.PROPOSAL_STATUS.HIRED;
        message.success(data.message);
        this.props.toggle();
      })
      .catch((error) => {
        this.setState({ pending: false });
        process.env.NODE_ENV === "development" && console.log(error);
        message.error(error.message);
      });
  }

  render() {
    // const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    return (
      <div className="create-contact">
        <Form>
          <div className="row">
            <div className="col-lg-6 d-flex">
              <Avatar
                src={this.props.proposal.vendor.profileImage || defaultProfileImage}
                size={50}
              />
              <div className="ml-2">
                <h6 className="text-dark font-weight-bold">
                  {this.props.proposal.vendor.username}
                </h6>
                <p>
                  {this.props.proposal.vendor.vendor
                    ? `${this.props.proposal.vendor.vendor.service.name}/${this.props.proposal.vendor.vendor.category.name}`
                    : "NONE"}
                </p>
                <p className="font-weight-bold text-blue">
                  {constants.ACCOUNTTYPES[this.props.proposal.vendor.accountType]}
                </p>
                {this.props.proposal.vendor.bsLocation && (
                  <p>
                    <span className=" font-weight-bold">Location: </span>
                    <Icon type="global" />
                    <span className="ml-1">
                      {this.props.proposal.vendor.bsLocation.city}/
                      {this.props.proposal.vendor.bsLocation.country}{" "}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <Progress
                percent={
                  this.props.proposal.vendor.vendor.jobs !== 0
                    ? this.props.proposal.vendor.vendor.jobCompletedRate : 0
                }
                size="small"
                status="active"
                style={{ width: "170px", display: "block" }}
              />
              <span className="mr-2">
                {this.props.proposal.vendor.vendor.rate}
              </span>
              <Rate
                disabled
                value={this.props.proposal.vendor.vendor.rate}
                allowHalf={true}
                className="like-rate"
              />
              <span className="ml-1">
                {this.props.proposal.vendor.vendor.reviewCount} Reviews
              </span>
            </div>
          </div>
          <hr className="mb-4" />
          <div className="row mb-4">
            <div className="col-md-6">
              <Form.Item label="Start Time">
                <DatePicker
                  showTime
                  className="w-100"
                  placeholder="Start Time"
                  value={moment(this.state.contractStDateTime)}
                  onChange={(value, dateString) => {
                    this.setState({
                      contractStDateTime: value,
                    });
                  }}
                  size={"large"}
                />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item label="End Time">
                <DatePicker
                  showTime
                  className="w-100"
                  placeholder="End Time"
                  value={this.state.contractEndDateTime}
                  onChange={(value, dateString) => {
                    this.setState({
                      contractEndDateTime: value,
                    });
                  }}
                  size={"large"}
                />
              </Form.Item>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-4 mb-2">
              <Form.Item label="Client Budget">
                <div className="d-flex align-items-center">
                  <InputNumber
                    placeholder="Client Budget"
                    name="clientBudget"
                    size={"large"}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    value={this.props.job.budget}
                    readOnly
                    className="mr-2 w-100"
                  />
                  <div>
                    {this.props.job.budgetType === constants.BUDGET_TYPE.HOURLY ? "/hr" : ""}
                  </div>
                </div>
              </Form.Item>
            </div>
            <div className="col-md-4 mb-2">
              <Form.Item label="Proposal Budget">
                <div className="d-flex align-items-center">
                  <InputNumber
                    placeholder="Proposal Budget"
                    name="proposalBudget"
                    size={"large"}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    value={this.props.proposal.offerBudget}
                    readOnly
                    className="mr-2 w-100"
                  />
                  <div>
                    {this.props.proposal.offerBudgetType === constants.BUDGET_TYPE.HOURLY
                      ? "/hr"
                      : ""}
                  </div>
                </div>
              </Form.Item>
            </div>
            <div className="col-md-4 mb-2 d-flex justify-content-between align-items-end">
              <Form.Item label="Contract Budget">
                <div className="d-flex align-items-center">
                  <InputNumber
                    placeholder="Contract Budget"
                    name="contractBudget"
                    size={"large"}
                    value={this.state.contractBudget}
                    onChange={(contractBudget) => {
                      this.setState({
                        contractBudget: contractBudget,
                        estimatedPrice: contractBudget * this.state.limitTime,
                      });
                    }}
                    min={1}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    step={0.1}
                    className="mr-2 w-100"
                  />
                  <div>
                    {this.props.proposal.offerBudgetType === constants.BUDGET_TYPE.HOURLY
                      ? "/hr"
                      : ""}
                  </div>
                </div>
              </Form.Item>
            </div>
          </div>
          {this.props.job.budgetType === constants.BUDGET_TYPE.HOURLY && (
            <div className="row mb-4">
              <div className="col-md-6 mb-2">
                <Form.Item label="Limit Time">
                  <div className="d-flex align-items-center">
                    <InputNumber
                      placeholder="limitTime"
                      name="limitTime"
                      size={"large"}
                      value={this.state.limitTime}
                      min={1}
                      onChange={(limitTime) => {
                        this.setState({
                          limitTime: limitTime,
                          estimatedPrice: limitTime * this.state.contractBudget,
                        });
                      }}
                      className="mr-2 w-100"
                    />
                  </div>
                </Form.Item>
              </div>
              <div className="col-md-6 mb-2">
                <Form.Item label="Estimated Price">
                  <div className="d-flex align-items-center">
                    <InputNumber
                      placeholder="Estimated Price"
                      name="estimatedPrice"
                      size={"large"}
                      value={this.state.estimatedPrice}
                      readOnly
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      className="mr-2 w-100"
                    />
                    <div>
                      {this.props.proposal.offerBudgetType === constants.BUDGET_TYPE.HOURLY
                        ? "/hr"
                        : ""}
                    </div>
                  </div>
                </Form.Item>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-md-12">
              <div className="col-md-12 text-right controls mt-5">
                <button
                  className={`button-primary ${this.state.pending ? "disable" : ""}`}
                  onClick={this.create}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ clientJobDetailsReducer, loginReducer }) => {
  const { error, job, success, pending } = clientJobDetailsReducer;

  const { user } = loginReducer;

  return { error, job, success, pending, user };
};

const CreateContractForm = Form.create({ name: "client_createcontact_form" })(CreateContract);

export default connect(mapStateToProps, {
  updateJob,
  updateProposal,
})(CreateContractForm);
