import React from "react";
import { Button, Icon, Avatar, Rate, Progress } from "antd";
import { constants } from "@Shared/constants";
import defaultProfileImage from "@Components/images/profileplace.png";

class VendorItem extends React.Component {
  render() {
    return (
      <div className="propposal-item ">
        {this.props.notification && (
          <div className="row">
            <div className="col-lg-9 col-md-8 vendor-profile-content d-flex">
              {this.props.index + 1}. &nbsp;
              <span>{this.props.notification.notificationMsg}</span>
            </div>
            <div className="col-lg-3 col-md-4 vendor-rate">{this.props.notification.time}</div>
          </div>
        )}
      </div>
    );
  }
}

export default VendorItem;
