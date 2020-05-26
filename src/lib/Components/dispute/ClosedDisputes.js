import React from "react";
import { List, Icon } from "antd";
import { connect } from "react-redux";
import ClosedDisputeItems from "./ClosedDisputeItems";
import { getClosedDisputes } from "./essential";
import { constants } from "@Shared/constants";

class ClosedDispute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: undefined,
    };
  }
  componentDidMount() {
    this.props.getClosedDisputes();
  }

  render() {
    return (
      <div className="proposals py-md-4 py-2">
        {this.props.user && (
          <div className="row">
            <div className="col-md-4 col-sm-6 vendor-profile-content d-flex">
              <h5>CONTRACT</h5>
            </div>
            <div className="col-md-3 col-sm-6 vendor-rate">
              <h5>{this.props.user.userObj.accountType !== 0 ? "CLIENT" : "VENDOR"}</h5>
            </div>
            <div className="col-md-3 col-sm-6 vendor-rate">
              <h5>DISPUTE DATE</h5>
            </div>
            <div className="col-md-2 col-sm-6 vendor-rate">
              <h5>AMOUNT</h5>
            </div>
          </div>
        )}
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              process.env.NODE_ENV === "development" && console.log(page);
            },
            pageSize: 5,
          }}
          dataSource={this.props.closedDisputes}
          footer={<div></div>}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <ClosedDisputeItems closedDispute={item} />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ disputeReducer, loginReducer }) => {
  const { user } = loginReducer;
  const { closedDisputes, error, pending, success } = disputeReducer;
  return { error, closedDisputes, success, pending, user };
};

export default connect(mapStateToProps, {
  getClosedDisputes,
})(ClosedDispute);
