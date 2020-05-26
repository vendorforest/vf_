import React from "react";
import { Button, Icon, Avatar, Rate, Progress } from "antd";
import { constants } from "@Shared/constants";
import defaultProfileImage from "@Components/images/profileplace.png";

class VendorItem extends React.Component {
  render() {
    return (
      <div className="propposal-item ">
        {this.props.answeredQuestion && (
          <div className="row">
            <div className="col-lg-12 vendor-profile-content d-flex">
              <h5>{this.props.answeredQuestion.client.username}</h5>
            </div>
            <div className="col-lg-12 vendor-rate">
              <p>Question : "{this.props.answeredQuestion.question}"</p>
            </div>
            <div className="col-lg-12 vendor-rate">
              <p>Answer : "{this.props.answeredQuestion.answer}"</p>
            </div>
          </div>
        )}
        {/* <hr /> */}
      </div>
    );
  }
}

export default VendorItem;
