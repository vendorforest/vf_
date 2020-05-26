import React from "react";
import { constants } from "@Shared/constants";
import moment from "moment";
import { Button, Icon, Avatar, Rate, Modal, Progress } from "antd";

class ReviewItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="review-item">
        <p>{this.props.review.feedback}</p>
        <div className="w-100 d-flex justify-content-between">
          <div className="mr-2">
            <a className="text-color pointer mr-3" href="">
              <h5>{this.props.review.from.username}</h5>
            </a>
            <span>on {moment(this.props.review.cratedAt).format("MMM DD, YYYY")}</span>
            <h6 className="text-color pointer">{this.props.review.job.title}</h6>
          </div>
          <Rate value={this.props.user.vendor.rate} disabled allowHalf />
          <span className="h6">{this.props.user.vendor.rate}</span>
        </div>
      </div>
    );
  }
}

export default ReviewItem;
