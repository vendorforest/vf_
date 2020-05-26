import React from "react";
import { connect } from "react-redux";
import { Icon, Avatar, Progress, Rate, List } from "antd";
import { constants } from "@Shared/constants";
import defaultProfileImage from "@Components/images/profileplace.png";
import moment from "moment";
import { fetchGetReviewsData } from "./essential";
import ReviewItem from "./ReviewItem";

class ProposalDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pending: false,
    };
  }

  componentDidMount() {
    this.props.fetchGetReviewsData({
      to: this.props.proposal.vendor._id,
    });
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.proposal._id !== newProps.proposal._id) {
      this.props.fetchGetReviewsData({
        to: newProps.proposal.vendor._id,
      });
    }
  }

  render() {
    const generateQA = () => {
      return this.props.proposal.answers.map((answer, index) => {
        return (
          <div className="anwer-item mb-3" key={index}>
            <h6 className="question text-grey mb-2">
              {index + 1}. {answer.question}
            </h6>
            <p>{answer.answer}</p>
          </div>
        );
      });
    };

    return (
      <div className="proposal_details">
        <div className="row">
          <div className="col-12">
            <div className="vendor-content mb-3">
              <div className="row">
                <div className="col-md-7 vendor-profile d-flex mb-2">
                  <Avatar
                    src={this.props.proposal.vendor.profileImage || defaultProfileImage}
                    shape="square"
                    size={80}
                  />
                  <div className="ml-2">
                    <h6 className="text-dark font-weight-bold">
                      {this.props.proposal.vendor.firstName &&
                      this.props.proposal.vendor.lastName
                        ? `${this.props.proposal.vendor.firstName} ${this.props.proposal.vendor.lastName}`
                        : this.props.proposal.vendor.username}
                    </h6>
                    <p>
                      {this.props.proposal.vendor.vendor
                        ? `${this.props.proposal.vendor.vendor.service.name}/${this.props.proposal.vendor.vendor.category.name}`
                        : "NONE"}
                    </p>
                    <p className="font-weight-bold text-blue">
                      {constants.ACCOUNTTYPES[this.props.proposal.vendor.accountType]}
                    </p>
                    <p>
                      <span className=" font-weight-bold">Location: </span>
                      <Icon type="global" />
                      {this.props.proposal.vendor.bsLocation && (
                        <span className="ml-1">
                          {this.props.proposal.vendor.bsLocation.city}/
                          {this.props.proposal.vendor.bsLocation.country}{" "}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {this.props.proposal.vendor && (
                  <div className="col-md-5 vendor-status">
                    <Progress
                      percent={
                        this.props.proposal.vendor.vendor.jobs !== 0
                          ? this.props.proposal.vendor.vendor.jobCompletedRate : 0
                      }
                      size="small"
                      status="active"
                      className="job-progress"
                    />
                    <Rate
                      disabled
                      value={this.props.proposal.vendor.vendor.rate}
                      allowHalf={true}
                      className="like-rate"
                    />
                    <span className="ml-1">
                      {this.props.proposal.vendor.vendor.reviewCount} Reviews
                    </span>
                  </div>
                )}
              </div>
            </div>
            <hr />
            <div className="proposal-content">
              <div className="price d-flex justify-content-around">
                <div className="bid-price">
                  <p className="text-grey mb-2">Bid Price</p>
                  <h4>
                    ${this.props.proposal.offerBudget}
                    <small>
                      {this.props.proposal.offerBudgetType === constants.BUDGET_TYPE.FIXED
                        ? ""
                        : "/hr"}
                    </small>
                  </h4>
                </div>
                <div className="bid-price mb-2">
                  <p className="text-grey">Job Price</p>
                  <h4>
                    ${this.props.job.budget}
                    <small>
                      {this.props.job.budgetType === constants.BUDGET_TYPE.FIXED ? "" : "/hr"}
                    </small>
                  </h4>
                </div>
              </div>
              <hr />
              <div className="qa">
                <h5 className="text-grey my-4">Screening Questions</h5>
                {generateQA()}
              </div>
            </div>
            <hr />
            <div className="review-content">
              <h5 className="text-grey my-4">Reviews</h5>
              {this.props.pending && (
                <div className="w-100 p-5 text-center loading-small">
                  <Icon type="sync" spin />
                </div>
              )}
              {!this.props.pending && this.props.reviews.length > 0 && (
                <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    onChange: (page) => {
                      process.env.NODE_ENV === "development" && console.log(page);
                    },
                    pageSize: 10,
                  }}
                  dataSource={this.props.reviews}
                  footer={<div></div>}
                  renderItem={(item, index) => (
                    <List.Item key={index} style={{ cursor: "pointer" }}>
                      <ReviewItem review={item} />
                    </List.Item>
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ clientJobDetailsReducer, loginReducer }) => {
  const { error, job, success, reviews, pending } = clientJobDetailsReducer;

  const { user } = loginReducer;

  return {
    error,
    job,
    success,
    pending,
    reviews,
    user,
  };
};

export default connect(mapStateToProps, {
  fetchGetReviewsData,
})(ProposalDetails);
