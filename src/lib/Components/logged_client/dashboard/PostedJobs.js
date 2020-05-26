/* eslint-disable import/first */
import React, { Component } from "react";
import { Input, List, Icon, Button } from "antd";
import { connect } from "react-redux";
const { Search } = Input;
import PostedJobItem from "./PostedJobItem";
import { fetchPostJobsData } from "./essential";

class PostedJobs extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    await this.props.fetchPostJobsData();
  }

  render() {
    return (
      <div className="posted-job shadow">
        <div className="head">
          <h4 className="text-grey">My Job Postings</h4>
          <Button
            // className="button-primary"
            type="primary"
            onClick={() => {
              window.location.href = "/client/postjob";
            }}
          >
            Post a New Job
          </Button>
        </div>
        <div className="jobs-list-content">
          <div className="py-2">
            <Search
              placeholder="Find Jobs"
              onSearch={(value) => process.env.NODE_ENV === "development" && console.log(value)}
              style={{ maxWidth: "400px", height: "40px" }}
            />
          </div>
          <hr />
          <div className="w-100">
            {!this.props.postedJobs && this.props.pending && (
              <div className="w-100 p-5 text-center loading-small">
                <Icon type="sync" spin />
              </div>
            )}
            {this.props.postedJobs && !this.props.pending && (
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: (page) => {
                    process.env.NODE_ENV === "development" && console.log(page);
                  },
                  pageSize: 2,
                }}
                dataSource={this.props.postedJobs}
                footer={<div></div>}
                renderItem={(item, index) => (
                  <List.Item
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.location.href = `/client/job/${item._id}`;
                    }}
                  >
                    <PostedJobItem job={item} />
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
  const {
    error,
    success,
    pending,
    postedJobs,
    pendingContracts,
    pastContracts,
  } = clientDashboardReducer;
  return {
    error,
    success,
    pending,
    postedJobs,
    pendingContracts,
    pastContracts,
  };
};

export default connect(mapStateToProps, {
  fetchPostJobsData,
})(PostedJobs);
