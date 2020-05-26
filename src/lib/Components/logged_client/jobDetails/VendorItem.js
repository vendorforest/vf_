import React from "react";
import { Button, Icon, Avatar, Rate, Progress } from "antd";
import { constants } from "@Shared/constants";
import defaultProfileImage from "@Components/images/profileplace.png";

class VendorItem extends React.Component {
  render() {
    return (
      <div className="propposal-item ">
        <div className="row">
          <div className="col-lg-7 col-md-6 vendor-profile-content d-flex">
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
          <div className="col-lg-5 col-md-6 vendor-rate">
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
        </div>
      </div>
    );
  }
}

export default VendorItem;
