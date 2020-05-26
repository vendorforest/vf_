import React from "react";
import { Tag, Icon, Avatar, Progress } from "antd";
import moment from "moment";
import { constants, getTimeFromTimezone } from "@Shared/constants";
import defaultProfileImage from "@Components/images/profileplace.png";

class PendingContractItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
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

  render() {
    return (
      <div className="pending-contract-item ">
        <div className="row">
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
          <div className="col-lg-6 d-md-flex justify-content-between d-block">
            <div className="user">
              <Avatar
                src={this.props.contract.client.profileImage || defaultProfileImage}
                className="photo"
              />
              <div className="info ml-2">
                <h6>
                  <a href="" className="text-color font-weight-bold">
                    {this.props.contract.client.username}
                  </a>
                </h6>
                {this.props.contract.client.bsLocation && (
                  <p className="text-grey">
                    {this.props.contract.client.bsLocation.city} /{" "}
                    {this.props.contract.client.bsLocation.country}
                  </p>
                )}
                {this.props.contract.client.timeZone && (
                  <p className="text-grey">
                    {getTimeFromTimezone(this.props.contract.client.timeZone)}
                  </p>
                )}
              </div>
            </div>
            <div className="status">
              <Progress
                type="circle"
                percent={this.props.contract.completedPercent}
                format={(percent) => `${percent} %`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PendingContractItem;
