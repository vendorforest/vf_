import React from "react";
import { Input, Icon, Tag } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import { connect } from "react-redux";
import { Footer, Header } from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { fetchGetJobData } from "./essential";
import { constants, getTimeFromTimezone } from "@Shared/constants";
import defaultProfileImage from "@Components/images/profileplace.png";
import moment from "moment";

class VendorJobDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.fetchGetJobData({
      _id: this.props.match.params.id,
    });
  }

  displaySkills() {
    return this.props.job.subCategories.map((subct, index) => {
      return (
        <Tag key={index} color="#ddd" className="text-dark mb-1">
          {subct}
        </Tag>
      );
    });
  }

  getBudgetType() {
    return this.props.job.budgetType === constants.BUDGET_TYPE.FIXED ? "Fixed Price" : "Hourly";
  }

  displayApplicants() {
    if (this.props.job.proposales.length < 5) {
      return "Less than 5";
    } else if (this.props.job.proposales.length >= 5 && this.props.job.proposales.length < 10) {
      return "5 to 10";
    } else if (
      this.props.job.proposales.length >= 10 &&
      this.props.job.proposales.length < 20
    ) {
      return "10 to 20";
    } else {
      return "More that 20";
    }
  }

  getInviteNoApplicant() {
    return this.props.job.invitedVendors.filter(
      (inviteUser) =>
        this.props.job.proposales.findIndex(
          (proposal) => proposal.vendor._id === inviteUser._id,
        ) === -1,
    );
  }

  getProposal() {
    const index =
      this.props.user &&
      this.props.job.proposales.findIndex(
        (proposal) => proposal.vendor && proposal.vendor._id === this.props.user.userObj._id,
      );
    return index > -1 ? this.props.job.proposales[index] : null;
  }

  render() {
    const displayAttachFiles = () => {
      return this.props.job.attachFiles.map((file, index) => {
        return (
          <p key={index}>
            <a href={file.url} className="text-color" download target="_black">
              {file.name}
            </a>
          </p>
        );
      });
    };

    return (
      <div className="vendor-job-details">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              {!this.props.job && this.props.pending && (
                <div className="col-12 p-5 text-center loading-small shadow">
                  <Icon type="sync" spin />
                </div>
              )}
              {this.props.job && (
                <div className="col-12">
                  <div className="job-content shadow mb-4">
                    <div className="row">
                      <div className="col-lg-9 col-md-8">
                        <div className="job-main-content">
                          <div className="job-head">
                            <h4 className="mb-2">{this.props.job.title}</h4>
                            {/* <p>Posted 1 month a go</p> */}
                          </div>
                          <hr />
                          <div className="job-body">
                            <p className="mb-2">{this.props.job.description}</p>
                            <h6 className="mb-2">
                              {this.props.job.service.name} > {this.props.job.category.name}
                            </h6>
                            <div className="w-100">{this.displaySkills()}</div>
                          </div>
                          <hr />
                          <div className="job-price d-flex">
                            <p className=" font-weight-bold">
                              {this.getBudgetType()}: <Icon type="dollar" />
                              <span className="ml-1">
                                ${this.props.job.budget}
                                {this.props.job.budgetType === constants.BUDGET_TYPE.HOURLY
                                  ? "/hr"
                                  : ""}{" "}
                              </span>
                              <span>
                                ({constants.AVB_HRSPERWEEKS[this.props.job.avbHrsPerWeek]})
                              </span>
                            </p>
                          </div>
                          <hr />
                          <div className="job-timeline-location">
                            <p>
                              <span className=" font-weight-bold">Start date & time: </span>
                              <Icon type="calendar" />
                              <span className="ml-1">
                                {moment(this.props.job.stDateTime).format("YYYY/MM/DD")}-
                              </span>
                              <Icon type="clock-circle" />
                              <span className="ml-1">
                                {moment(this.props.job.stDateTime).format("HH:mm")}
                              </span>
                            </p>
                            <p>
                              <span className=" font-weight-bold">End date & time: </span>
                              <Icon type="calendar" />
                              <span className="ml-1">
                                {moment(this.props.job.endDateTime).format("YYYY/MM/DD")}-
                              </span>
                              <Icon type="clock-circle" />
                              <span className="ml-1">
                                {moment(this.props.job.endDateTime).format("HH:mm")}
                              </span>
                            </p>
                            <p>
                              <span className=" font-weight-bold">Location: </span>
                              <Icon type="global" />
                              <span className="ml-1">
                                {this.props.job.location.city}/{this.props.job.location.country}{" "}
                              </span>
                            </p>
                          </div>
                          <hr />
                          <div className="job-attachfile">{displayAttachFiles()}</div>
                          <hr />
                          <div className="job-additional-question">
                            {this.props.job.questions.map((question, index) => {
                              return (
                                <p key={index}>
                                  {index + 1}. {question}
                                </p>
                              );
                            })}
                          </div>
                          <hr />
                          <div className="job-applicants">
                            <p>
                              <span className=" font-weight-bold">Applicants: </span>
                              {this.displayApplicants()}
                            </p>
                            <p>
                              <span className=" font-weight-bold">Invited: </span>
                              {this.props.job.invitedVendors.length}
                            </p>
                            <p>
                              <span className=" font-weight-bold">Invited-Not Applied: </span>
                              {this.getInviteNoApplicant().length}
                            </p>
                            <p>
                              <span className=" font-weight-bold">Hired: </span>
                              {this.props.job.hiredVendors.length}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4">
                        <hr className="d-block d-md-none" />
                        <div className="about-client">
                          <div className="job-bid-action mb-md-5 mb-0">
                            <button
                              className="button-primary mb-3"
                              onClick={() => {
                                if (this.getProposal()) {
                                  this.props.history.push(
                                    `/vendor/placebid/${this.props.job._id}/${
                                      this.getProposal()._id
                                    }`,
                                  );
                                } else {
                                  this.props.history.push(
                                    `/vendor/placebid/${this.props.job._id}`,
                                  );
                                }
                              }}
                            >
                              {this.getProposal() ? "Edit Proposal" : "Place Bid"}
                            </button>
                            {/* <button className="button-white">
                              <Icon type="heart" />
                              <span className="ml-2">Save Job</span>
                            </button> */}
                          </div>
                          <hr />
                          {this.props.job.client && (
                            <div>
                              {" "}
                              <div className="client-info mb-2">
                                <img
                                  src={
                                    this.props.job.client.profileImage || defaultProfileImage
                                  }
                                  style={{
                                    height: "55px",
                                    width: "55px",
                                    borderRadius: "100%",
                                  }}
                                  alt="profileimage"
                                />
                                <div className="info ml-2">
                                  <h6>
                                    <a href="/client" className="text-color font-weight-bold">
                                      {this.props.job.client.username}
                                    </a>
                                  </h6>
                                  <p>
                                    {this.props.job.client.bsLocation
                                      ? this.props.job.client.bsLocation.country
                                      : this.props.job.location.country}
                                  </p>
                                  <p>
                                    {this.props.job.client.bsLocation
                                      ? this.props.job.client.bsLocation.city
                                      : this.props.job.location.city}{" "}
                                    {this.props.job.client.timeZone
                                      ? getTimeFromTimezone(this.props.job.client.timeZone)
                                      : "Unknown"}
                                  </p>
                                </div>
                              </div>
                              <div className="client-verified-info text-center">
                                <p>
                                  <span
                                    className={`${
                                      this.props.job.client.isConfirmed ? "text-color" : ""
                                    } mr-3`}
                                  >
                                    <Icon type="mail" />
                                  </span>
                                  <span
                                    className={`${
                                      this.props.job.client.phone ? "text-color" : ""
                                    } mr-3`}
                                  >
                                    <Icon type="mobile" />
                                  </span>
                                  <span
                                    className={`${
                                      this.props.job.client.bsLocation ? "text-color" : ""
                                    } mr-3`}
                                  >
                                    <Icon type="global" />
                                  </span>
                                  <span className="mr-3">
                                    <Icon type="dollar" />
                                  </span>
                                </p>
                              </div>
                              <hr />
                              <div className="client-history">
                                <p>
                                  <span className=" font-weight-bold mr-2">Amount Spent: </span>
                                  ${this.props.job.client.client.totalSpent}
                                </p>
                                <p>
                                  <span className=" font-weight-bold mr-2">Posted Jobs: </span>
                                  {this.props.job.client.client.postedJobs}
                                </p>
                                <p>
                                  <span className=" font-weight-bold mr-2">Open Jobs: </span>
                                  {this.props.job.client.client.openJobs}
                                </p>
                                {this.props.job.client.hireRate && (
                                  <p>
                                    <span className=" font-weight-bold mr-2">Hire Rate: </span>
                                    {this.props.job.client.client.hireRate}%
                                  </p>
                                )}
                                {this.props.job.client.avgHourlyRate && (
                                  <p>
                                    <span className=" font-weight-bold mr-2">
                                      Avg Hourly Rate:{" "}
                                    </span>
                                    ${this.props.job.client.client.avgHourlyRate}
                                    /hr
                                  </p>
                                )}
                              </div>
                              <hr />{" "}
                            </div>
                          )}
                          <div className="job-link">
                            <p className=" font-weight-bold">Job Link</p>
                            <Input
                              disabled={true}
                              value={`https://vendorforest.com/vendor/job/${this.props.job._id}`}
                            ></Input>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="similar-jobs shadow">
                    <h5 className="mb-4">Similar Jobs</h5>
                    <p>
                      <a href="#/" className="text-color">
                        Motivated front end developer (with design sense) needed to join a
                        growing team.
                      </a>
                    </p>
                    <p>
                      <a href="#/" className="text-color">
                        Seeking developer to convert web designs into Bootstrap responsive site.
                      </a>
                    </p>
                    <p>
                      <a href="#/" className="text-color">
                        React and React Native Developer.
                      </a>
                    </p>
                    <p>
                      <a href="#/" className="text-color">
                        Full stack developer needed for short job
                      </a>
                    </p>
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ vendorJobDetailsReducer, loginReducer }) => {
  const { error, job, success, pending } = vendorJobDetailsReducer;

  const { user } = loginReducer;

  return { error, job, success, pending, user };
};

export default connect(mapStateToProps, {
  fetchGetJobData,
})(withStyles(globalStyle, localStyle)(VendorJobDetails));
