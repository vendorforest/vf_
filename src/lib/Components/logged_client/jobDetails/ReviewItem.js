import React from "react";
import { Rate } from "antd";
import { constants } from "@Shared/constants";
import moment from "moment";
import feedBackIconOnTime from "@Components/images/NewIcons/feedbackicon_1.png";
import feedBackIconSkillful from "@Components/images/NewIcons/feedbackicon_2.png";
import feedBackIconExcelent from "@Components/images/NewIcons/feedbackicon_3.png";
import feedBackIconBeyond from "@Components/images/NewIcons/feedbackicon_4.png";
import feedBackIconEntertaining from "@Components/images/NewIcons/feedbackicon_5.png";
import feedBackIconConversation from "@Components/images/NewIcons/feedbackicon_6.png";

class ReviewItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pending: false,
    };
  }

  getBadgeIcon(badge) {
    switch (badge) {
      case 0:
        return feedBackIconOnTime;
      case 1:
        return feedBackIconSkillful;
      case 2:
        return feedBackIconExcelent;
      case 3:
        return feedBackIconBeyond;
      case 4:
        return feedBackIconEntertaining;
      case 5:
        return feedBackIconConversation;
    }
  }

  render() {
    const generateBadges = () => {
      return this.props.review.vendorBadge.map((badge, index) => {
        return (
          <img
            key={index}
            src={this.getBadgeIcon(badge)}
            alt="badge"
            style={{
              width: "25px",
              height: "25px",
            }}
          />
        );
      });
    };

    return (
      <div className="feedback">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="text-color">{this.props.review.contract.job.title}</h6>
          <p>${this.props.review.contract.paidPrice}</p>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Rate
              disabled
              value={Number(this.props.review.rate)}
              allowHalf={true}
              className="like-rate"
            />
            <span className="mr-2">{this.props.review.rate}</span>
            <small>{moment(this.props.review.createdAt).format("MMM DD, YYYY")}</small>
          </div>
          <p>
            {this.props.review.contract.job.budgetType === constants.BUDGET_TYPE.FIXED
              ? "Fixed price"
              : `$${this.props.review.contract.budget}/hr`}
          </p>
        </div>
        <div className="d-flex justify-content-between">
          <p className=" font-italic">{this.props.review.feedback}</p>
          <div
            className="d-flex justify-content-end"
            style={{
              maxWidth: "150px",
            }}
          >
            {generateBadges()}
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewItem;
