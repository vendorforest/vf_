import React from "react";
import { connect } from "react-redux";

class PendingDisputeItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div className="propposal-item ">
        {this.props.pendingDispute && this.props.user && (
          <div className="row">
            <div className="col-md-4 col-sm-6 vendor-profile-content d-flex">
              <div className="row">
                <div className="col-md-12" style={{ fontWeight: "bold" }}>
                  {this.props.pendingDispute.contractId.job.title}
                </div>
                <div className="col-md-12" style={{ fontSize: "15px" }}>
                  {this.props.pendingDispute.contractId.job.description.slice(0, 20)}...
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 vendor-rate">
              {this.props.user.userObj.accountType !== 0
                ? this.props.pendingDispute.clientId.username
                : this.props.pendingDispute.vendorId.username}
            </div>
            <div className="col-md-3 col-sm-6 vendor-rate">
              {this.props.pendingDispute.time}
            </div>
            <div className="col-md-2 col-sm-6 vendor-rate">
              ${this.props.pendingDispute.price}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ loginReducer }) => {
  const { user } = loginReducer;
  return { user };
};

export default connect(mapStateToProps, {})(PendingDisputeItem);
