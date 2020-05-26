/* eslint-disable import/first */
import React from "react";
import { Button, Icon } from "antd";
import { constants } from "../../../constants";

class PostedJobItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  displayJobStatus() {
    switch (this.props.job.status) {
      case constants.JOB_STATUS.POSTED:
        return <span className="text-color h6">(OPEN)</span>;
      case constants.JOB_STATUS.HIRED:
        return <span className="text-color h6">(HIRED)</span>;
      case constants.JOB_STATUS.CLOSED:
        return <span className="text-danger h6">(CLOSED)</span>;
      case constants.JOB_STATUS.CANCELED:
        return <span className="text-danger h6">(CANCELED)</span>;
    }
  }

  render() {
    return (
      <div className="posted-job-item ">
        <div className="row">
          <div className="col-lg-8 mb-3">
            <h5 className="mb-2 text-grey">
              {this.props.job.title} {this.displayJobStatus()}
            </h5>
            <p className="mb-3 text-grey">
              {this.props.job.service.name
                ? `${this.props.job.service.name}/${this.props.job.category.name}`
                : "NONE"}
            </p>
            <p>{this.props.job.description.substring(0, 350) + "..."}</p>
          </div>
          <div className="col-lg-4 d-flex justify-content-between text-grey">
            <div className="col text-center">
              <h6>Bids</h6>
              <p className="text-color font-weight-bold">
                ({this.props.job.proposales.length})
              </p>
            </div>
            <div className="col text-center">
              <h6>Hire</h6>
              <p className="text-color font-weight-bold">
                ({this.props.job.hiredVendors.length})
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default PostedJobItem;
