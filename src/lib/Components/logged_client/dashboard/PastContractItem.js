/* eslint-disable import/first */
import React from "react";
import { connect } from "react-redux";
import { Tag, Icon, Avatar, Rate } from "antd";
import moment from "moment";
import { constants, getTimeFromTimezone } from "../../../constants";
import defaultProfileImage from "@Components/images/profileplace.png";

class PastContractItem extends React.Component {
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

  isLeftFeedBack() {
    if (this.props.contract.reviews.length === 0) {
      return false;
    }
    for (const review of this.props.contract.reviews) {
      if (review.from._id === this.props.user.userObj._id) {
        return true;
      }
    }
    return false;
  }

  getContractRate() {
    if (this.props.contract.reviews.length === 0) {
      return 0.0;
    }
    for (const review of this.props.contract.reviews) {
      if (review.from._id === this.props.user.userObj._id) {
        return review.rate;
      }
    }
    return 0.0;
  }

  render() {
    return (
      <div className="past-contract-item ">
        <div className="row">
          <div className="col-lg-6 mb-3">
            <h5 className="mb-2 text-grey">{this.props.contract.job.title}</h5>
            <div className="mb-3 text-grey">{this.displaySkills()}</div>
            <p>
              <b>Completed date & time:</b> <Icon type="calendar" />{" "}
              {moment(this.props.contract.completedDateTime).format("MMMM DD, YYYY")} -{" "}
              <Icon type="clock-circle" />{" "}
              {moment(this.props.contract.completedDateTime).format("HH:mm A")}
            </p>
            <p>
              <b>Complete Budget:</b> <Icon type="dollar" />
              &nbsp;
              <span className="text-color">
                {
                  this.props.contract.job.budgetType === constants.BUDGET_TYPE.HOURLY ? `${this.props.contract.budget}/hr` : `$${this.props.contract.paidPrice}`
                }
              </span>
            </p>
          </div>
          <div className="col-lg-6 d-md-flex justify-content-between d-block">
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
            <div className="rate text-center">
              <Rate disabled value={this.getContractRate()} allowHalf />
              {this.props.contract.status === constants.CONTRACT_STATUS.END &&
                !this.isLeftFeedBack() && (
                  <div>
                    <button
                      className="button-primary mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/client/givefeedback/${this.props.contract._id}`;
                      }}
                    >
                      Leave Feedback
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ loginReducer }) => {
  const { user } = loginReducer;
  return {
    user,
  };
};

export default connect(mapStateToProps, {})(PastContractItem);
