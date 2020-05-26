import React from "react";
import { Button, Icon, Avatar, Rate, Modal, Progress } from "antd";
import SendInvite from "./SendInvite";

import { constants } from "@Shared/constants";

class VendorItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModal: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isModal: !this.state.isModal,
    });
  }

  displaySkills() {
    if (this.props.vendor.skills.length === 0) {
      return "";
    }
    let skills = this.props.vendor.skills[0];
    this.props.vendor.skills.splice(0, 1).forEach((skill) => {
      skills += ` / ${skill}`;
    });
    return skills;
  }

  render() {
    const { user } = this.props;
    const { vendor } = user;
    process.env.NODE_ENV === "development" && console.log("user: ", user);
    process.env.NODE_ENV === "development" && console.log("vendor: ", vendor);
    return (
      <div className="vendor-item d-md-flex d-block justify-content-between">
        <div className="vendor-info d-flex mb-3 mb-md-0">
          <div className="vendor-photo">
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              size={80}
              style={{ width: "80px" }}
            />
          </div>
          <div className="vendor-summary ml-2">
            <h5
              className="vendor-name"
              onClick={() => {
                window.location.href = "/vendor/profile/" + user.username;
              }}
            >
              {user.username}
            </h5>
            {/* <p>{this.displaySkills()}</p> */}
            <h6 className="text-blue">{constants.ACCOUNTTYPES[user.accountType]}</h6>
            <p className="text-grey">
              <Icon type="global" />
              {user.bsLocation && (
                <span className="ml-1">
                  {`${user.bsLocation.city}`}, &nbsp; {`${user.bsLocation.state}`}
                </span>
              )}
            </p>
            <Progress
              percent={vendor.jobCompletedRate}
              size="small"
              status="active"
              className="job-progress"
            />
            <div className="text-grey">
              <span className="mr-2">{vendor.rate}</span>
              <Rate disabled defaultValue={vendor.rate} />
              <span className="mx-2">{vendor.reviewCount} Reviews</span>
            </div>
          </div>
        </div>
        <div className="vendor-action d-flex flex-md-column flex-row align-items-center">
          <h6 className="vendor-subinfo text-color text-md-right text-center col">
            ${vendor.hourlyRate}/hr
          </h6>
          <div className="col">
            <button className="button-primary" onClick={this.toggle}>
              Hire Vendor
            </button>
          </div>
        </div>
        <Modal
          title="Hire Vendor"
          visible={this.state.isModal}
          onOk={this.toggle}
          onCancel={this.toggle}
          width={"650px"}
          footer={
            <Button key="next" type="primary" onClick={this.toggle} style={{ width: "100px" }}>
              Send
            </Button>
          }
        >
          <SendInvite user={user} />
        </Modal>
      </div>
    );
  }
}

export default VendorItem;
