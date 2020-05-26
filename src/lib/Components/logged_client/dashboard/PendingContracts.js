/* eslint-disable import/first */
import React from "react";
import { Input, List, Icon } from "antd";
import { connect } from "react-redux";
import PendingContractItem from "./PendingContractItem";
import { constants } from "@Shared/constants";

import { fetchPendingContractsData } from "./essential";

const { Search } = Input;
class PendingConstracts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.user &&
      this.props.fetchPendingContractsData({
        client: this.props.user.userObj._id,
        status: constants.CONTRACT_STATUS.CREATED,
      });
  }

  render() {
    return (
      <div className="pending-contracts shadow">
        <div className="head">
          <h4 className="text-grey">My Pending Contracts</h4>
        </div>
        <div className="contract-list-content">
          <div className="w-100">
            {!this.props.pendingContracts && this.props.pending && (
              <div className="w-100 p-5 text-center loading-small">
                <Icon type="sync" spin />
              </div>
            )}
            {this.props.pendingContracts && !this.props.pending && (
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: (page) => {
                    process.env.NODE_ENV === "development" && console.log(page);
                  },
                  pageSize: 2,
                }}
                dataSource={this.props.pendingContracts}
                footer={<div></div>}
                renderItem={(item, index) => (
                  <List.Item
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.location.href = `/client/contract/${item._id}`;
                    }}
                  >
                    <PendingContractItem contract={item} />
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ clientDashboardReducer, loginReducer }) => {
  const { error, success, pending, pendingContracts } = clientDashboardReducer;
  const { user } = loginReducer;
  return {
    error,
    success,
    pending,
    pendingContracts,
    user,
  };
};

export default connect(mapStateToProps, {
  fetchPendingContractsData,
})(PendingConstracts);
