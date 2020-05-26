import React from "react";
import { Button, Icon, Avatar, Rate, Modal, Progress } from "antd";
import { constants } from "@Shared/constants";
import defaultProfileImage from "@Components/images/profileplace.png";

class VendorItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.selectInviteUser = this.selectInviteUser.bind(this);
  }

  selectInviteUser() {
    const invitedVendors = [...this.props.invitedVendors];
    const index = invitedVendors.indexOf(this.props.vendor._id);
    if (index > -1) {
      invitedVendors.splice(index, 1);
    } else {
      invitedVendors.push(this.props.vendor._id);
    }
    this.props.updateInvtedVendor(invitedVendors);
    // console.log("invited vendors = ", invitedVendors);
  }

  render() {
    return (
      <div className="vendor-item ">
        <div className="row">
          <div className="col-lg-4 col-md-6 vendor-profile-content d-flex">
            <Avatar
              src={this.props.vendor.profileImage || defaultProfileImage}
              className="photo"
            />
            <div className="ml-2">
              <h6 className="text-dark font-weight-bold">{this.props.vendor.username}</h6>
              <p>
                {this.props.vendor.vendor.service
                  ? `${this.props.vendor.vendor.service.name} / ${this.props.vendor.vendor.category.name}`
                  : "NONE"}
              </p>
              <p className="font-weight-bold text-blue">
                {constants.ACCOUNTTYPES[this.props.vendor.accountType]}
              </p>
              {this.props.vendor.bsLocation && (
                <p>
                  <span className=" font-weight-bold">Location: </span>
                  <Icon type="global" />
                  <span className="ml-1">
                    {this.props.vendor.bsLocation.city}/{this.props.vendor.bsLocation.country}{" "}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div className="col-lg-4 col-md-6 vendor-rate">
            <Progress
              percent={ this.props.vendor.vendor.jobs !== 0 ? this.props.vendor.vendor.jobCompletedRate : 0 }
              size="small"
              status="active"
              className="job-progress"
            />
            <span className="mr-2">
              {this.props.vendor.vendor.rate}
            </span>
            <Rate
              disabled
              value={this.props.vendor.vendor.rate}
              allowHalf={true}
              className="like-rate"
            />
            <span className="ml-1">{this.props.vendor.vendor.reviewCount} Reviews</span>
          </div>
          <div className="col-lg-4 col-md-6 d-block d-md-flex align-items-center justify-content-between">
            <h5 className="text-center col py-3 w-100">
              ${this.props.vendor.vendor.hourlyRate}/hr
            </h5>
            {this.props.invitedVendors.indexOf(this.props.vendor._id) > -1 ? (
              <button className="button-primary" onClick={this.selectInviteUser}>
                Unselect
              </button>
            ) : (
              <button className="button-white" onClick={this.selectInviteUser}>
                Select
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default VendorItem;
