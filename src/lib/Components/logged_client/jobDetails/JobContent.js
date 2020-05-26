import React from "react";
import { connect } from "react-redux";
import { Icon, Tag, message } from "antd";
import { constants } from "@Shared/constants";
import moment from "moment";
import { fetchCloseJob } from "./essential";

class JobContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pending: false,
    };
    this.closeJob = this.closeJob.bind(this);
  }

  componentDidMount() {}

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

  displayElapsedTime() {
    const jobDate = moment(this.props.job.createdAt);
    const diffMonths = moment().diff(jobDate, "months");
    const diffDays = moment().diff(jobDate, "days");
    const diffHours = moment().diff(jobDate, "hours");
    const diffMinutes = moment().diff(jobDate, "minutes");
    if (diffMonths > 0) {
      return `Posted ${diffMonths} months ago`;
    }
    if (diffDays > 0) {
      return `Posted ${diffDays} days ago`;
    }
    if (diffHours > 0) {
      return `Posted ${diffHours} hours ago`;
    }
    if (diffMinutes > 0) {
      return `Posted ${diffMinutes} minutes ago`;
    }
    return "Posted a minutes ago";
  }

  closeJob() {
    const params = {
      _id: this.props.job._id,
      status: constants.JOB_STATUS.CLOSED,
    };
    this.setState({ pending: true });
    fetchCloseJob(params)
      .then((data) => {
        this.setState({ pending: false });
        message.success("Job has been canceled successfully");
        window.location.href = "/client";
      })
      .catch((error) => {
        process.env.NODE_ENV === "development" && console.log(error);
        this.setState({ pending: false });
        message.error(error.message);
      });
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
      <div className="client-job-content py-md-4 py-2">
        <div className="row">
          <div className="col-lg-12 col-md-8">
            <div className="job-main-content">
              <div className="job-head">
                <h4 className="mb-2">{this.props.job.title}</h4>
                <div>{this.displaySkills()}</div>
                <p>{this.displayElapsedTime()}</p>
              </div>
              <hr />
              <div className="job-body">
                <p>{this.props.job.description}</p>
              </div>
              <hr />
              <div className="job-price d-flex">
                <p className=" font-weight-bold">
                  {this.getBudgetType()}: <Icon type="dollar" />
                  <span className="ml-1">
                    ${this.props.job.budget}
                    {this.props.job.budgetType === constants.BUDGET_TYPE.FIXED ? "" : "/hr"}
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
            </div>
            <div className="d-flex w-100 edit-btn-content mt-4 justify-content-end">
              <a
                onClick={this.closeJob}
                className={`button-white mr-2 ${this.state.pending ? "disable" : ""}`}
              >
                <Icon type="close" />
                <span className="ml-3">Close Job</span>
              </a>
              <a href={`/client/editjob/${this.props.job._id}`} className="button-primary">
                <Icon type="edit" />
                <span className="ml-3">Edit Post</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ clientJobDetailsReducer, loginReducer }) => {
  const { error, job, success, pending } = clientJobDetailsReducer;

  const { user } = loginReducer;

  return { error, job, success, pending, user };
};

export default connect(mapStateToProps, {})(JobContent);
