import React from "react";
import { List, Icon } from "antd";
import { connect } from "react-redux";
import PendingContractItem from "./PendingContractItem";
import { constants } from "@Shared/constants";

import { fetchPendingContractsData } from "./essential";

class PendingContracts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // static async fetchInitialData(store) {}
  isAdmin() {
    return this.props.team.admin._id === this.props.user.userObj._id;
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.team._id !== newProps.team._id) {
      this.props.fetchPendingContractsData({
        teamId: newProps.team._id,
        admin: newProps.team.admin._id,
        status: constants.CONTRACT_STATUS.CREATED,
      });
    }
  }
  componentDidMount() {
    this.props.user &&
      this.props.fetchPendingContractsData({
        teamId: this.props.team._id,
        admin: this.props.team.admin._id,
        status: constants.CONTRACT_STATUS.CREATED,
      });
  }

  render() {
    process.env.NODE_ENV === "development" && console.log(this.props.user);
    return (
      <div className="pending-contracts shadow" style={{ marginBottom: "50px" }}>
        <div className="head">
          <h4 className="h5 font-weight-bold">My Pending Contracts</h4>
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
                      window.location.href = `/vendor/contract/${item._id}`;
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

const mapStateToProps = ({ vendorViewTeamReducer, vendorDashboardReducer, loginReducer }) => {
  const { error, success, pending } = vendorDashboardReducer;
  const { user } = loginReducer;
  const { team, pendingContracts } = vendorViewTeamReducer;
  return {
    error,
    success,
    pending,
    pendingContracts,
    user,
    team,
  };
};

export default connect(mapStateToProps, {
  fetchPendingContractsData,
})(PendingContracts);
