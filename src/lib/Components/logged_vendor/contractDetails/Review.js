import React from "react";
import { Rate } from "antd";
import moment from "moment";
import { connect } from "react-redux";

class Review extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getMyReview() {
    if (this.props.contract.reviews.length === 0) {
      return null;
    }
    for (const review of this.props.contract.reviews) {
      if (review.from._id === this.props.user.userObj._id) {
        return review;
      }
    }
    return null;
  }

  getPartnerReview() {
    if (this.props.contract.reviews.length === 0) {
      return null;
    }
    for (const review of this.props.contract.reviews) {
      if (review.to._id === this.props.user.userObj._id) {
        return review;
      }
    }
    return null;
  }

  render() {
    return (
      <div className="reviews">
        <div className="row">
          <div className="col-12">
            <div className="reviews-content p-md-5 p-2">
              <div className="mb-md-5 mb-4">
                <h6 className="mb-3" style={{ flexGrow: 1 }}>
                  Your Feedback to{" "}
                  {this.props.contract.client.firstName && this.props.contract.client.lastName
                    ? `${this.props.contract.client.firstName} ${this.props.contract.client.lastName}`
                    : this.props.contract.client.username}
                </h6>
                <div className="feedback pl-md-3 pl-0">
                  {this.getMyReview() ? (
                    <div className="feedback pl-md-3 pl-0">
                      <Rate value={this.getMyReview().rate} disabled allowHalf />
                      <span className="h6">{this.getMyReview().rate}</span>
                      <p>{this.getMyReview().feedback}</p>
                    </div>
                  ) : (
                    <div className="feedback pl-md-3 pl-0 text-danger">No Feedback</div>
                  )}
                </div>
              </div>
              <div>
                <h6 className="mb-3" style={{ flexGrow: 1 }}>
                  Client's Feedback to You
                </h6>
                <div className="feedback pl-md-3 pl-0">
                  {this.getPartnerReview() ? (
                    <div className="feedback pl-md-3 pl-0">
                      <Rate value={this.getPartnerReview().rate} disabled allowHalf />
                      <span className="h6">{this.getPartnerReview().rate}</span>
                      <p>{this.getPartnerReview().feedback}</p>
                    </div>
                  ) : (
                    <div className="feedback pl-md-3 pl-0 text-danger">No Feedback</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ vendorContractDetailsReducer, loginReducer }) => {
  const { error, contract, success, pending } = vendorContractDetailsReducer;

  const { user } = loginReducer;

  return { error, contract, success, pending, user };
};

export default connect(mapStateToProps, {})(Review);
