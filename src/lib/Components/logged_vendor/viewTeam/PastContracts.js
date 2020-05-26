import React from "react";
import { Icon, List } from "antd";
import PastContractItem from "./PastContractItem";
import { connect } from "react-redux";
import { constants } from "@Shared/constants";

import { fetchPastContractsData } from "./essential";

class PastConstracts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.team._id !== newProps.team._id) {
      this.props.fetchPastContractsData({
        teamId: newProps.team._id,
        admin: newProps.team.admin._id,
        status: constants.CONTRACT_STATUS.END,
      });
    }
  }
  componentDidMount() {
    this.props.user &&
      this.props.fetchPastContractsData({
        teamId: this.props.team._id,
        admin: this.props.team.admin._id,
        status: constants.CONTRACT_STATUS.END,
      });
  }

  render() {
    return (
      <div className="past-contracts shadow">
        <div className="head">
          <h5 className="h5 font-weight-bold">Past Contracts</h5>
        </div>
        <div className="contract-list-content">
          <div className="w-100">
            {!this.props.pastContracts && this.props.pending && (
              <div className="w-100 p-5 text-center loading-small">
                <Icon type="sync" spin />
              </div>
            )}
            {this.props.pastContracts && !this.props.pending && (
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: (page) => {
                    process.env.NODE_ENV === "development" && console.log(page);
                  },
                  pageSize: 2,
                }}
                dataSource={this.props.pastContracts}
                footer={<div></div>}
                renderItem={(item, index) => (
                  <List.Item
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.location.href = `/vendor/contract/${item._id}`;
                    }}
                  >
                    <PastContractItem contract={item} />
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

const mapStateToProps = ({ vendorDashboardReducer, loginReducer, vendorViewTeamReducer }) => {
  const { error, success, pending } = vendorDashboardReducer;
  const { user } = loginReducer;
  const { team, pastContracts } = vendorViewTeamReducer;
  return {
    error,
    success,
    pending,
    pastContracts,
    user,
    team,
  };
};

export default connect(mapStateToProps, {
  fetchPastContractsData,
})(PastConstracts);
