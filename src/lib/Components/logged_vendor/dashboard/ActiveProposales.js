import React from "react";
import { List, Icon } from "antd";
import { connect } from "react-redux";
// const PendingContractItem from './PendingContractItem')
import { constants } from "@Shared/constants";
import moment from "moment";

import { fetchActiveProposalesData } from "./essential";

class ActiveProposales extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.user &&
      this.props.fetchActiveProposalesData({
        vendor: this.props.user.userObj._id,
        status: constants.PROPOSAL_STATUS.HIRED,
      });
  }

  render() {
    return (
      <div className="proposales shadow">
        <div className="head">
          <h4 className="text-grey">Active Proposals</h4>
        </div>
        <div className="proposal-list-content">
          <div className="w-100">
            {!this.props.activeProposales && this.props.pending && (
              <div className="w-100 p-5 text-center loading-small">
                <Icon type="sync" spin />
              </div>
            )}
            {this.props.activeProposales && !this.props.pending && (
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: (page) => {
                    process.env.NODE_ENV === "development" && console.log(page);
                  },
                  pageSize: 2,
                }}
                dataSource={this.props.activeProposales}
                footer={<div></div>}
                renderItem={(item, index) => (
                  <List.Item key={index} style={{ cursor: "pointer" }}>
                    <div className="row active_proposal_li">
                      <div className="col-md-4">
                        Submitted {moment(item.createdAt).format("MMM DD, YYYY")}
                      </div>
                      <div className="col-md-8">
                        <a
                          href={`/vendor/placebid/${item.job._id}/${item._id}`}
                          className="text-color"
                        >
                          {item.job.title}
                        </a>
                      </div>
                    </div>
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

const mapStateToProps = ({ vendorDashboardReducer, loginReducer }) => {
  const { error, success, pending, activeProposales } = vendorDashboardReducer;
  const { user } = loginReducer;
  return {
    error,
    success,
    pending,
    activeProposales,
    user,
  };
};

export default connect(mapStateToProps, {
  fetchActiveProposalesData,
})(ActiveProposales);
