import React from "react";
import { List, Icon } from "antd";
import { connect } from "react-redux";
import VendorItem from "./VendorItem";

class InvitedNotApplied extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const notAppliedVendors = this.props.job.invitedVendors.filter((user) => {
      return (
        this.props.proposales.findIndex((proposal) => user._id === proposal.vendor._id) === -1
      );
    });

    return (
      <div className="proposals py-md-4 py-2">
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              process.env.NODE_ENV === "development" && console.log(page);
            },
            pageSize: 5,
          }}
          dataSource={notAppliedVendors}
          footer={<div></div>}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <VendorItem vendor={item} />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ clientJobDetailsReducer, loginReducer }) => {
  const { error, job, success, proposales, pending } = clientJobDetailsReducer;

  const { user } = loginReducer;

  return { error, job, success, proposales, pending, user };
};

export default connect(mapStateToProps, {})(InvitedNotApplied);
