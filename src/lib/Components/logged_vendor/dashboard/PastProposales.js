import React from "react";
import { List, Icon } from "antd";
import { connect } from "react-redux";
import { constants } from "@Shared/constants";
import moment from "moment";

import { fetchPastProposalesData } from "./essential";

class PastProposales extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.user &&
      this.props.fetchPastProposalesData({
        vendor: this.props.user.userObj._id,
        status: constants.PROPOSAL_STATUS.DECLINE,
      });
  }

  render() {
    return (
      <div className="proposales shadow">
        <div className="head">
          <h4 className="text-grey">Past Proposals</h4>
        </div>
        <div className="proposal-list-content">
          <div className="w-100">
            {!this.props.pastProposales && this.props.pending && (
              <div className="w-100 p-5 text-center loading-small">
                <Icon type="sync" spin />
              </div>
            )}
            {this.props.pastProposales && !this.props.pending && (
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: (page) => {
                    process.env.NODE_ENV === "development" && console.log(page);
                  },
                  pageSize: 2,
                }}
                dataSource={this.props.pastProposales}
                footer={<div></div>}
                renderItem={(item, index) => (
                  <List.Item
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.location.href = `/client/contract/${item._id}`;
                    }}
                  >
                    <div className="row">
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
  const { error, success, pending, pastProposales } = vendorDashboardReducer;
  const { user } = loginReducer;
  return {
    error,
    success,
    pending,
    pastProposales,
    user,
  };
};

export default connect(mapStateToProps, {
  fetchPastProposalesData,
})(PastProposales);
