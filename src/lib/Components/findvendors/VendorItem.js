import React from "react";
import { Button, Icon, Avatar, Rate, Modal, Progress, message, Input } from "antd";
import SendInvite from "./SendInvite";
import { hireVendor, askQuestion } from "./essential";
import { constants } from "@Shared/constants";
import { async } from "q";
import { connect } from "react-redux";
const firebase = require("firebase/app");
const { TextArea } = Input;
class VendorItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      isModal: false,
      title: undefined,
      text: undefined,
      check: false,
      message: undefined,
    };
    this.toggle = this.toggle.bind(this);
    this.selectCallback = this.selectCallback.bind(this);
    this.handleContract = this.handleContract.bind(this);
    this.toggleAsk = this.toggleAsk.bind(this);
    this.handleAsk = this.handleAsk.bind(this);
  }

  toggle() {
    this.setState({
      isModal: !this.state.isModal,
    });
  }
  toggleAsk() {
    this.setState({
      visible: !this.state.visible,
    });
  }
  handleAsk() {
    this.setState({
      visible: !this.state.visible,
    });
    if (this.state.message === undefined) {
      message.warning("Please input question.");
      return;
    } else {
      if (this.state.message.length > 90) {
        message.warning("You can't exceed the max length of 90 characters.");
        return;
      }
    }
    const params = {
      vendor: this.props.vendor._id,
      question: this.state.message,
      email: this.props.vendor.email,
      phone: this.props.vendor.phone,
    };
    askQuestion(params)
      .then((result) => {
        message.success(result.message);
      })
      .catch((error) => {
        message.warning(error);
      });
  }
  handleContract() {
    this.setState({
      isModal: !this.state.isModal,
    });
    if (this.state.check === false) {
      message.warning("You have to the check the checkbox.");
      return;
    }
    if (this.state.title === undefined) {
      message.warning("You have to select the Job title.");
      return;
    }
    if (this.state.title.proposales.length > 0) {
      this.state.title.proposales.map((proposal) => {
        if (proposal.vendor === this.props.vendor._id) {
          message.warning("This vendor already bidded on this project.");
          return;
        }
      });
    }
    const params = {
      job: this.state.title._id,
      vendor: this.props.vendor._id,
      offerBudget: this.state.title.budget,
      offerBudgetType: this.state.title.budgetType,
      bidType: 0,
      message: this.state.text,
      stDateTime: this.state.title.stDateTime,
      endDateTime: this.state.title.endDateTime,
      phone: this.props.vendor.phone,
      email: this.props.vendor.email,
      username: this.props.vendor.username,
    };
    hireVendor(params).then(async (result) => {
      const docKey = [this.props.user.userObj.email, this.props.vendor.email].sort().join(":");
      await firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .set({
          messages: [
            {
              message: "Hi.",
              sender: this.props.user.userObj.email,
              timeStamp: Date.now(),
            },
          ],
          users: [this.props.user.userObj.email, this.props.vendor.email],
          userNames: [this.props.user.userObj.username, this.props.vendor.username],
          receiverHadRead: false,
          jobTitle: this.state.title.title,
          service: this.props.vendor.vendor.service.name,
          category: this.props.vendor.vendor.category.name,
          contract: 0,
          createdAt: Date.now(),
        });
      window.location.href = `/client/hire/${result.data.job}&${result.data.vendor}`;
    });
  }

  selectCallback(childData) {
    this.setState({
      title: childData,
    });
  }

  textCallback = (childData) => {
    this.setState({
      text: childData,
    });
  };

  checkCallback = (childData) => {
    this.setState({
      check: childData,
    });
  };

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
    const { vendor } = this.props;
    // const { vendor } = vendor;
    return (
      <div className="vendor-item d-md-flex d-block justify-content-between">
        <div className="vendor-info d-flex mb-3 mb-md-0">
          <div className="vendor-photo">
            <Avatar src={`${vendor.profileImage}`} size={80} style={{ width: "80px" }} />
          </div>
          <div className="vendor-summary ml-2">
            <h5
              className="vendor-name"
              onClick={() => {
                window.location.href = "/vendor/profile/" + vendor.username;
              }}
            >
              {vendor.username}
            </h5>
            {vendor.vendor.service && vendor.vendor.category && (
              <p>
                {vendor.vendor.service.name} / {vendor.vendor.category.name}
              </p>
            )}
            {/* <p>{this.displaySkills()}</p> */}
            <h6 className="text-blue">{constants.ACCOUNTTYPES[vendor.accountType]}</h6>
            <p className="text-grey">
              <Icon type="global" />
              {vendor.bsLocation && (
                <span className="ml-1">
                  {`${vendor.bsLocation.city}`}, &nbsp; {`${vendor.bsLocation.state}`}
                </span>
              )}
            </p>
            <Progress
              percent={
                vendor.vendor.jobs !== 0
                  ? vendor.vendor.jobCompletedRate
                  : 0
              }
              size="small"
              status="active"
              className="job-progress"
            />
            <div className="text-grey">
              <span className="mr-2">{vendor.vendor.rate}</span>
              <Rate
                disabled
                value={vendor.vendor.rate}
              />
              <span className="mx-2">{vendor.vendor.reviewCount} Reviews</span>
            </div>
          </div>
        </div>
        <div className="vendor-action d-flex flex-md-column flex-row align-items-center">
          <h6 className="vendor-subinfo text-color text-md-right text-center col">
            ${vendor.vendor.hourlyRate}/hr
          </h6>
          <div className="col" style={{ marginBottom: "5px" }}>
            <button className="" onClick={this.toggleAsk} style={{ border:"2px solid #07b107", backgroundColor:"#fff" ,color: "#07b107",height:"45px",lineHeight:"45px",width:"150px",minWidth:"150px",flexGrow:"0",borderRadius:"4px",fontFamily:"inherit",fontSize:"13px",fontWeight:"700" }}>
              Ask a Question
            </button>
          </div>
          <div className="col">
            <button className="button-primary" onClick={this.toggle}>
              Hire Vendor
            </button>
          </div>
        </div>
        <Modal
          title={`Hire ${this.props.vendor.username}`}
          visible={this.state.isModal}
          // onOk={this.toggle}
          onCancel={this.toggle}
          width={"50%"}
          footer={
            <Button
              key="next"
              type="primary"
              onClick={this.handleContract}
              style={{ width: "120px" }}
            >
              Hire Vendor
            </Button>
          }
        >
          <SendInvite
            title={this.selectCallback}
            text={this.textCallback}
            check={this.checkCallback}
          />
        </Modal>

        <Modal
          title={`Ask a question to ${this.props.vendor.username}`}
          visible={this.state.visible}
          // onOk={this.toggle}
          onCancel={this.toggleAsk}
          width={"50%"}
          footer={
            <Button
              key="next"
              type="primary"
              onClick={this.handleAsk}
              style={{ width: "120px" }}
            >
              Ask Now
            </Button>
          }
        >
          <div className="message mb-6">
            <TextArea
              value={this.state.message}
              onChange={(e) => {
                this.setState({
                  message: e.target.value,
                });
              }}
              rows={5}
              placeholder="Message"
            />
          </div>
          <div className="message mb-6" style={{ textAlign: "right" }}>
            90 Characters
          </div>
          <div className="message mb-6" style={{ marginTop: "20px" }}>
            NOTE: Please undersand that you can only ask questions that the vendor can only
            answer by YES or NO. For your own safety reasons.
          </div>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = ({ loginReducer }) => {
  const { user } = loginReducer;
  return { user };
};

export default connect(mapStateToProps, {})(VendorItem);
