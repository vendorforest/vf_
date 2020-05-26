// @ts-nocheck
import React from "react";
import { message, Icon, Avatar, Progress, Rate, Tag, Drawer, Input, Modal, Button } from "antd";
import { constants } from "@Shared/constants";
import { connect } from "react-redux";
import moment from "moment";
import CreateContract from "./CreateContract";
import ProposalDetails from "./ProposalDetails";
import { fetchDeclineProposal, askQuestion } from "./essential";
import defaultProfileImage from "@Components/images/profileplace.png";

const { TextArea } = Input;
class ProposalItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      proposalDrawVisible: false,
      contractDrawVisible: false,
      pending: false,
      visible: false,
      message: undefined,
    };
    this.view = this.view.bind(this);
    this.delete = this.delete.bind(this);
    this.chat = this.chat.bind(this);
    this.toggleProposal = this.toggleProposal.bind(this);
    this.toggleContract = this.toggleContract.bind(this);
    this.toggleAsk = this.toggleAsk.bind(this);
    this.handleAsk = this.handleAsk.bind(this);
  }

  componentDidMount() {}

  toggleProposal() {
    this.setState({
      proposalDrawVisible: !this.state.proposalDrawVisible,
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
      vendor: this.props.proposal.vendor._id,
      question: this.state.message,
      email: this.props.proposal.vendor.email,
      phone: this.props.proposal.vendor.phone,
    };
    askQuestion(params)
      .then((result) => {
        message.success(result.message);
      })
      .catch((error) => {
        message.warning(error);
      });
  }

  toggleContract() {
    this.setState({
      contractDrawVisible: !this.state.contractDrawVisible,
    });
  }

  view() {
    if (this.props.proposal.bidType < 1) {
      this.toggleProposal();
    } else {
      this.props.proposal.offers.forEach(offer => {
        if (offer.status !== constants.OFFER_STATUS.ACCEPT) return message.warning("You can accept this bid after all members of this team have been accepted.");
      })
      this.toggleProposal();
    }
  }

  delete() {
    const params = {
      _id: this.props.proposal._id,
    };
    this.setState({ pending: true });
    fetchDeclineProposal(params)
      .then((data) => {
        this.props.proposal.status = constants.PROPOSAL_STATUS.DECLINE;
        this.setState({ pending: false });
        message.success("Proposal has been declined.");
      })
      .catch((error) => {
        process.env.NODE_ENV === "development" && console.log(error);
        this.setState({ pending: false });
        message.error(error.message);
      });
  }

  chat() {
    window.location.href = "/messages/c";
  }

  render() {
    return (
      <div className="propposal-item ">
        <div className="row">
          {this.props.proposal.vendor && (
            <div className="col-lg-4 col-md-6 vendor-profile-content d-flex">
              <Avatar
                src={this.props.proposal.vendor.profileImage || defaultProfileImage}
                className="photo"
              />
              <div className="ml-2">
                <h6 className="text-dark font-weight-bold">
                  {this.props.proposal.vendor.username}
                  {this.props.proposal.bidType > 0 ||
                    (this.props.proposal.bidType === -1 && (
                      <h6 style={{ color: "red" }}>Team</h6>
                    ))}
                </h6>
                <p>
                  {this.props.proposal.vendor.vendor && this.props.proposal.vendor.vendor.service
                    ? `${this.props.proposal.vendor.vendor.service.name}/${this.props.proposal.vendor.vendor.category.name}`
                    : "NONE"}
                </p>
                <p className="font-weight-bold text-blue">
                  {constants.ACCOUNTTYPES[this.props.proposal.vendor.accountType]}
                </p>
                {this.props.proposal.vendor.bsLocation && (
                  <p>
                    <span className=" font-weight-bold">Location: </span>
                    <Icon type="global" />
                    <span className="ml-1">
                      {this.props.proposal.vendor.bsLocation.city}/
                      {this.props.proposal.vendor.bsLocation.country}{" "}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
          {this.props.proposal.vendor && (
            <div className="col-lg-4 col-md-6 vendor-rate">
              <Progress
                percent={
                  this.props.proposal.vendor.vendor.jobs !== 0
                    ? this.props.proposal.vendor.vendor.jobCompletedRate : 0
                }
                size="small"
                status="active"
                className="job-progress"
              />
              <span className="mr-2">
                {this.props.proposal.vendor.vendor.rate}
              </span>
              <Rate
                disabled
                value={this.props.proposal.vendor.vendor.rate}
                allowHalf={true}
                className="like-rate"
              />
              <span className="ml-1">
                {this.props.proposal.vendor.vendor.reviewCount} Reviews
              </span>
            </div>
          )}
          <div className="col-lg-4 col-md-6 d-block d-md-flex align-items-center justify-content-between">
            <h5 className="text-center col py-3 w-100">
              $ {this.props.proposal.offerBudget}
              {this.props.proposal.offerBudgetType === constants.BUDGET_TYPE.FIXED ? "" : "/hr"}
            </h5>
            {this.props.proposal.status === constants.PROPOSAL_STATUS.CREATED && (
              <div className="proposal-action col d-md-block d-flex justify-content-between">
                <p className="text-color pointer mb-1" onClick={this.view}>
                  <Icon type="search" className="mr-2" />
                  View
                </p>
                <p className="text-red pointer mb-1" onClick={this.delete}>
                  <Icon type="close" className="mr-2" />
                  Delete
                  {this.state.pending && <Icon type="sync" spin className="ml-2" />}
                </p>
                <p className="text-color pointer" onClick={this.toggleAsk}>
                  <Icon type="wechat" className="mr-2" />
                  Ask
                </p>
              </div>
            )}
            {this.props.proposal.status === constants.PROPOSAL_STATUS.DECLINE && (
              <div className="w-100 text-md-right text-center col">
                <div>
                  <Tag color="red">
                    <Icon type="ban" className="mr-2" />
                    Decline
                  </Tag>
                </div>
                <p>{moment(this.props.proposal.updatedAt).format("MMM DD, YYYY HH:mm")}</p>
              </div>
            )}
            {this.props.proposal.status === constants.PROPOSAL_STATUS.HIRED && (
              <div className="w-100 text-md-right text-center col">
                <div>
                  <Tag color="green">
                    <Icon type="check" className="mr-2" />
                    Hired
                  </Tag>
                </div>
                <p>{moment(this.props.proposal.updatedAt).format("MMM DD, YYYY HH:mm")}</p>
              </div>
            )}
          </div>
        </div>
        <Modal
          title={`Ask a question to ${this.props.proposal.vendor.username}`}
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

        <Drawer
          placement="left"
          closable={true}
          onClose={this.toggleContract}
          visible={this.state.contractDrawVisible}
          title={<span className="font-weight-bold">Create Contract</span>}
        >
          <CreateContract
            proposal={this.props.proposal}
            toggle={this.toggle}
            job={this.props.job}
          />
        </Drawer>
        <Drawer
          placement="right"
          closable={true}
          onClose={this.toggleProposal}
          visible={this.state.proposalDrawVisible}
          title={
            <div className="d-flex">
              <h5 className="mr-4">Proposal Details</h5>
              <button
                className="button-primary"
                style={{
                  height: "30px",
                  lineHeight: "30px",
                  minWidth: "80px",
                }}
                onClick={() => {
                  this.toggleProposal();
                  this.toggleContract();
                }}
              >
                Hire
              </button>
            </div>
          }
        >
          <ProposalDetails proposal={this.props.proposal} job={this.props.job} />
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = ({ clientJobDetailsReducer, loginReducer }) => {
  const { error, job, success, pending } = clientJobDetailsReducer;

  const { user } = loginReducer;

  return { error, job, success, pending, user };
};

export default connect(mapStateToProps, { fetchDeclineProposal })(ProposalItem);
