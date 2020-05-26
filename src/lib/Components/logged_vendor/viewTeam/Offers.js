import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Input, Card, Divider, Icon, Avatar, Modal, Button, Table, Form } from "antd";
import { fetchOffersData, fetchOfferDecline, fetchOfferAccept } from "./essential";
import { constants } from "@Shared/constants";
import defaultProfileImage from "@Components/images/profileplace.png";
const { TextArea } = Input;

class VendorOffers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOffer: undefined,
      isModal: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  isAdmin() {
    return this.props.team.admin._id === this.props.user.userObj._id;
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.team._id !== newProps.team._id) {
      const params = {
        team: newProps.team._id,
        status: constants.OFFER_STATUS.CREATED,
      };
      if (!this.isAdmin()) {
        params.receiver = this.props.user.userObj._id;
      }
      this.props.fetchOffersData(params);
    }
  }
  componentDidMount() {
    const params = {
      team: this.props.team._id,
      status: constants.OFFER_STATUS.CREATED,
    };
    if (!this.isAdmin()) {
      params.receiver = this.props.user.userObj._id;
    }
    this.props.fetchOffersData(params);
  }

  accept() {
    this.props.form.validateFields(["message"], (error, values) => {
      if (!error && !this.props.pending) {
        const params = {
          _id: this.state.selectedOffer._id,
          message: values.message,
          offers: this.props.offers,
        };
        process.env.NODE_ENV === "development" && console.log(params);
        this.props.fetchOfferAccept(params);
      }
    });
  }

  decline(offerId) {
    process.env.NODE_ENV === "development" && console.log(this.props.pending);
    if (this.props.pending) {
      return;
    }
    const params = {
      _id: offerId,
      offers: this.props.offers,
    };
    this.props.fetchOfferDecline(params);
  }

  toggle() {
    this.setState({
      isModal: !this.state.isModal,
      currentStep: 0,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: "Job Details",
        key: "jobDetails",
        render: (text, record, index) => (
          <div className="job-details" key={index}>
            <h6>{record.proposal.job.title}</h6>
            <p className="color-gray">
              <Icon type="calendar" />
              <span className="ml-1">
                {moment(record.proposal.job.stDateTime).format("YYYY/MM/DD")}-
              </span>
              <Icon type="clock-circle" />
              <span className="ml-1">
                {moment(record.proposal.job.stDateTime).format("HH:mm")}
              </span>

              <span className="mx-2 font-weight-bold">To</span>

              <Icon type="calendar" />
              <span className="ml-1">
                {moment(record.proposal.job.endDateTime).format("YYYY/MM/DD")}-
              </span>
              <Icon type="clock-circle" />
              <span className="ml-1">
                {moment(record.proposal.job.endDateTime).format("HH:mm")}
              </span>
            </p>
            <p className="mb-2">
              <Icon type="global" />
              <span className="ml-1">
                Location: {record.proposal.job.location.city} /{" "}
                {record.proposal.job.location.country}
              </span>
            </p>
          </div>
        ),
      },
      {
        title: "Client",
        key: "client",
        render: (text, record, index) => (
          <div className="d-flex align-items-center" key={index}>
            <Avatar
              src={record.proposal.job.client.profileImage || defaultProfileImage}
              size={50}
              className="mb-2 inline-block"
            />
            {record.proposal.job.client.bsLocation && (
              <div className="ml-2">
                <p className=" font-weight-bold">{record.proposal.job.client.username}</p>
                <p className="mb-2">
                  <span className="ml-1">
                    {record.proposal.job.client.bsLocation.city} /{" "}
                    {record.proposal.job.client.bsLocation.country}
                  </span>
                </p>
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Budget",
        dataIndex: "budget",
        key: "budget",
        render: (budget) => <div className="text-center">${budget}</div>,
      },
      {
        title: "",
        key: "action",
        render: (text, record, index) => (
          <div>
            {!this.isAdmin() ? (
              <span
                style={{
                  display: "block",
                  minWidth: "130px",
                  textAlign: "right",
                }}
              >
                <a
                  className="text-color pointer"
                  onClick={() => {
                    this.setState({
                      selectedOffer: record,
                    });
                    this.toggle();
                  }}
                >
                  <Icon type="check" className="mr-1" />
                  Accept
                </a>
                <Divider type="vertical" />
                <a
                  className="text-red pointer"
                  onClick={() => {
                    this.decline(record._id);
                  }}
                >
                  <Icon type="close" className="mr-1 pointer" />
                  Decline
                </a>
              </span>
            ) : (
              <span
                style={{
                  display: "block",
                  minWidth: "130px",
                  textAlign: "right",
                }}
              >
                <a
                  className="text-red pointer"
                  onClick={() => {
                    this.decline(record._id);
                  }}
                >
                  <Icon type="close" className="mr-1" />
                  Cancel
                </a>
              </span>
            )}
          </div>
        ),
      },
    ];
    return (
      <div>
        <Card
          title={<span className="h5 font-weight-bold">Offers</span>}
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)", marginBottom: "50px" }}
        >
          {!this.props.offers && this.props.pending && (
            <div className="w-100 p-5 text-center loading-small mb-5">
              <Icon type="sync" spin />
            </div>
          )}
          {this.props.offers && (
            <div className="row">
              <div className="col-md-12">
                <Table
                  columns={columns}
                  dataSource={this.props.offers}
                  pagination={{ pageSize: 5 }}
                />
              </div>
            </div>
          )}
        </Card>
        <Modal
          title="Accept"
          visible={this.state.isModal}
          onOk={this.toggle}
          onCancel={this.toggle}
          width={"650px"}
          footer={
            <Button
              key="next"
              type="primary"
              style={{ width: "100px" }}
              onClick={() => {
                this.toggle();
                this.accept();
              }}
            >
              Send
            </Button>
          }
        >
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <Form.Item label="Message">
                  {getFieldDecorator("message", {
                    initialValue: "",
                    rules: [{ required: true, message: "Please input message" }],
                  })(<TextArea placeholder="Please input message" name="message" rows="8" />)}
                </Form.Item>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const VendorOffersForm = Form.create({ name: "vendor_setting_companyinfo" })(VendorOffers);

const mapStateToProps = ({ vendorViewTeamReducer, loginReducer }) => {
  const { error, success, team, offers, pending } = vendorViewTeamReducer;

  const { user } = loginReducer;

  return {
    error,
    success,
    team,
    offers,
    pending,
    user,
  };
};

export default connect(mapStateToProps, {
  fetchOffersData,
  fetchOfferDecline,
  fetchOfferAccept,
})(VendorOffersForm);
