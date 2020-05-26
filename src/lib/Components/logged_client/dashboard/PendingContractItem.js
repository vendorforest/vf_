import React from "react";
import { connect } from "react-redux";
import { Tag, Icon, Avatar, Progress, message } from "antd";
import moment from "moment";
import { constants, getTimeFromTimezone } from "@Shared/constants";
import defaultProfileImage from "@Components/images/profileplace.png";
import {
  updatePendingContracts,
  updatePastContracts,
  fetchEndContract,
  fetchUpdateContract,
} from "./essential";

class PendingContractItem extends React.Component {
  _button = 0;

  constructor(props) {
    super(props);

    this.state = {
      pending: false,
    };

    this.jobComplete = this.jobComplete.bind(this);
    this.endContract = this.endContract.bind(this);
  }

  displaySkills() {
    return this.props.contract.job.subCategories.map((subct, index) => {
      return (
        <Tag key={index} color="#ddd" className="text-dark mb-1">
          {subct}
        </Tag>
      );
    });
  }

  jobComplete(e) {
    e.stopPropagation();
    if (this.state.pending) {
      return;
    }
    this._button = 0;
    this.setState({
      pending: true,
    });
    const params = {
      _id: this.props.contract._id,
      completedPercent: 100,
      isCompleted: true,
    };
    fetchUpdateContract(params).then((data) => {
      if (data.status >= 400) {
        message.error(data.message);
      } else {
        this.props.contract.completedPercent = 100;
        message.success(data.message);
      }
      this.setState({
        pending: false,
      });
    });
  }

  endContract(e) {
    e.stopPropagation();
    if (this.state.pending) {
      return;
    }
    this._button = 1;
    this.setState({
      pending: true,
    });
    const params = {
      _id: this.props.contract._id,
    };
    fetchEndContract(params).then((data) => {
      if (data.status >= 400) {
        message.error(data.message);
      } else {
        const newPendingContracts = [...this.props.pendingContracts];
        const newPastContracts = [...this.props.pastContracts];
        const index = newPendingContracts.findIndex(
          (contract) => contract._id === this.props.contract._id,
        );
        if (index > -1) {
          newPendingContracts.splice(index, 1);
          newPastContracts.push(data.data);
          this.props.updatePendingContracts(newPendingContracts);
          this.props.updatePastContracts(newPastContracts);
        }
        message.success(data.message);
      }
      this.setState({
        pending: false,
      });
    });
  }

  render() {
    return (
      <div className="pending-contract-item ">
        <div className="row">
          {this.props.contract && this.props.contract.job && (
            <div className="col-lg-6 mb-3">
              <h5 className="mb-2 text-grey">{this.props.contract.job.title}</h5>
              <div className="mb-3 text-grey">{this.displaySkills()}</div>
              <p>
                <b>Begin date & time:</b> <Icon type="calendar" />{" "}
                {moment(this.props.contract.stDateTime).format("MMMM DD, YYYY")} -{" "}
                <Icon type="clock-circle" />{" "}
                {moment(this.props.contract.stDateTime).format("HH:mm A")}
              </p>
              <p>
                <b>Estimated End date & time:</b> <Icon type="calendar" />{" "}
                {moment(this.props.contract.endDateTime).format("MMMM DD, YYYY")} -{" "}
                <Icon type="clock-circle" />{" "}
                {moment(this.props.contract.endDateTime).format("HH:mm A")}
              </p>
              <p>
                <b>Contract Budget:</b> <Icon type="dollar" />
                &nbsp;
                <span className="text-color">
                {
                  this.props.contract.job.budgetType === constants.BUDGET_TYPE.HOURLY ? `${this.props.contract.budget}/hr` : `$${this.props.contract.totalBudget}`
                }
                </span>
              </p>
            </div>
          )}
          <div className="col-lg-6 d-md-flex justify-content-between d-block">
            {this.props.contract.vendor && (
              <div className="user">
                <Avatar
                  src={this.props.contract.vendor.profileImage || defaultProfileImage}
                  className="photo"
                />
                <div className="info ml-2">
                  <h6>
                    <a href="" className="text-color font-weight-bold">
                      {this.props.contract.vendor.username}
                    </a>
                  </h6>
                  {this.props.contract.vendor.bsLocation && (
                    <p className="text-grey">
                      {this.props.contract.vendor.bsLocation.city} /{" "}
                      {this.props.contract.vendor.bsLocation.country}
                    </p>
                  )}
                  {this.props.contract.vendor.timeZone && (
                    <p className="text-grey">
                      {getTimeFromTimezone(this.props.contract.vendor.timeZone)}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="status">
              <Progress
                percent={this.props.contract.completedPercent}
                size="small"
                status="active"
                className="job-progress"
              />
              {/* {this.props.contract.completedPercent < 100 && (
                <div>
                  <button
                    className={`button-primary ${
                      this._button === 0 && this.state.pending ? "disable" : ""
                    }`}
                    onClick={this.jobComplete}
                  >
                    Job Complete
                  </button>
                </div>
              )}
              <div>
                <button
                  className={`button-white ${
                    this._button === 1 && this.state.pending ? "disable" : ""
                  }`}
                  onClick={this.endContract}
                >
                  End Contract
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ clientDashboardReducer, loginReducer }) => {
  const { error, success, pending, pendingContracts, pastContracts } = clientDashboardReducer;
  const { user } = loginReducer;
  return {
    error,
    success,
    pending,
    pendingContracts,
    pastContracts,
    user,
  };
};

export default connect(mapStateToProps, {
  updatePendingContracts,
  updatePastContracts,
})(PendingContractItem);
