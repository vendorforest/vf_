import React from "react";
import {
  Input,
  Modal,
  Popconfirm,
  Radio,
  Icon,
  List,
  Checkbox,
  Button,
  Select,
  Avatar,
  Form,
  InputNumber,
  DatePicker,
  Row,
  message,
} from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import defaultProfileImage from "@Components/images/profileplace.png";
import { Footer, Header } from "@Components/inc";
import moment from "moment";

import { connect } from "react-redux";
import { fetchGetHireData, updateProposal, comparePW } from "./essential";

import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";

const { TextArea } = Input;
class Hire extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dueDateTime: moment(),
      show: false,
      dueDateString: undefined,
      deposit: 0,
      confirmStatus: false,
      modalStatus: undefined,
      visible: false,
      emditmodal: false,
      description: undefined,
      price: undefined,
      skip: false,
      pendingBtn: false,
    };
    this.selectdueDateTime = this.selectdueDateTime.bind(this);
    this.onConfirmChange = this.onConfirmChange.bind(this);
    this.confirmPopup = this.confirmPopup.bind(this);
    this.handeleOk = this.handeleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.createLesserMilestone = this.createLesserMilestone.bind(this);
    this.cancelMilestone = this.cancelMilestone.bind(this);
    this.onSkip = this.onSkip.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.success && newProps.success) {
      message.success(newProps.success);
    }
    if (!this.props.error && newProps.error) {
      message.error(newProps.error);
    }
  }

  componentDidMount() {
    this.props.fetchGetHireData({
      job_id: this.props.match.params.proposal_id,
      vendor_id: this.props.match.params.vendor_id,
    });
  }
  selectdueDateTime(value, dateString) {
    this.setState({
      dueDateTime: value,
      dueDateString: dateString,
    });
  }
  onConfirmChange(value) {
    this.setState({
      confirmStatus: !this.state.confirmStatus,
    });
  }
  confirmPopup() {
    this.setState({
      visible: true,
    });
  }
  handeleOk() {
    this.props.form.validateFields(["password"], (err, values) => {
      this.setState({
        pendingBtn: true,
      });
      const defaultParams = {
        password: values.password,
        description: "Whole milestone",
        price: this.props.hireInfo.budget,
        contract: this.props.hireInfo._id,
        budget: 0,
        // endDateTime: this.props.hireInfo.endDateTime,
      };
      const lessParams = {
        password: values.password,
        description: this.state.description,
        price: this.state.price,
        contract: this.props.hireInfo._id,
        budget: this.props.hireInfo.budget - this.state.price,
        // endDateTime: this.state.dueDateString,
      };
      if (this.state.deposit === 0) {
        this.fetchCompare(defaultParams);
      } else {
        this.fetchCompare(lessParams);
      }
    });
    this.setState({
      visible: false,
    });
    // window.location.href =`/client/contract/${this.props.hireInfo._id}`;
  }
  async fetchCompare(params) {
    // await this.props.fetchPostJob(params)
    comparePW(params)
      .then((data) => {
        this.setState({
          pendingBtn: false,
        });
        message.success(data.message);
        this.props.history.push(`/client/contract/${this.props.hireInfo._id}`);
      })
      .catch((error) => {
        this.setState({
          pendingBtn: false,
        });
        process.env.NODE_ENV === "development" && console.log(error);
        message.warning(error.message);
      });
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  handleEdit() {
    this.setState({
      emditmodal: true,
    });
  }
  onCreate() {
    this.setState({
      emditmodal: false,
    });
    this.props.form.validateFields(
      ["updateTitle", "updateDescription", "updatePrice"],
      (err, values) => {
        if (!err) {
          const params = {
            updateTitle: values.updateTitle,
            updateDescription: values.updateDescription,
            updatePrice: values.updatePrice,
            contract: this.props.hireInfo._id,
            job: this.props.hireInfo.job._id,
          };
          this.props.updateProposal(params);
        }
        if (err) {
          console.log(err);
        }
      },
    );
    window.location.reload();
  }
  onCancel() {
    this.setState({
      emditmodal: false,
    });
  }
  createLesserMilestone() {
    this.props.form.validateFields(["price", "description"], (err, values) => {
      if (values.price > this.props.hireInfo.budget) {
        message.warning("You can't exceed the total amount!");
        return;
      }
      this.setState({
        description: values.description,
        price: values.price,
        show: true,
      });
    });
  }
  cancelMilestone() {
    this.setState({
      description: undefined,
      price: undefined,
      show: false,
    });
  }
  onSkip(e) {
    this.setState({
      skip: e.target.checked,
    });
  }
  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;
    const getContractBudget = () => {
      return this.props.hireInfo.budget;
    };
    const text = () => {
      return (
        <div className="row" style={{ paddingTop: "20px" }}>
          <div className="col-md-12 box1">
            You will be depositing ${this.props.hireInfo.budget} into escrow today. On your
            Transaction History report, you'll see an immediate escrow invoice and corresponding
            payment from your primary billing method.
          </div>
          <div className="col-md-12 box1">
            When the milestone work is ready and you release the funds, Upwork will send the
            funds from escrow to your freelancer. Learn more
          </div>
          <div className="col-md-12 box1">
            <Checkbox onChange={this.onSkip} checked={this.state.skip}>
              Don't show me this again, I understand how escrow works.
            </Checkbox>
          </div>
        </div>
      );
    };
    return (
      <div className="find-vendor">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-9">
                <div className="content-details shadow">
                  {this.props.hireInfo && (
                    <div>
                      <div className="head d-md-flex d-block justify-content-between align-items-center">
                        <div className="user mb-3 mb-md-0">
                          <Avatar
                            src={this.props.hireInfo.vendor.profileImage || defaultProfileImage}
                            className="photo"
                          />
                          <div className="info ml-2">
                            <h6>
                              <a href="#/" className="text-color font-weight-bold">
                                {this.props.hireInfo.vendor.username}
                              </a>
                            </h6>
                            <p className="text-grey">
                              {this.props.hireInfo.job.service !== null
                                ? this.props.hireInfo.job.service.name
                                : ""}{" "}
                              / {this.props.hireInfo.job.category.name}
                            </p>
                            <p className="text-grey">
                              {this.props.hireInfo.vendor.bsLocation
                                ? `${this.props.hireInfo.vendor.bsLocation.city} / ${this.props.hireInfo.vendor.bsLocation.country}`
                                : "NONE"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr></hr>
                      <div className="main-content">
                        <div className="row box">
                          <div className="col-md-8 col-sm-6">
                            <h4 className="title">Job Listing</h4>
                          </div>
                          <div className="col-md-4 col-sm-6">
                            <span className="edit">
                              <a onClick={this.handleEdit}>Edit</a>
                            </span>
                          </div>
                          <div className="col-md-12">
                            <p className="content">{this.props.hireInfo.job.title}</p>
                          </div>
                        </div>
                        <hr></hr>
                        <div className="row box">
                          <div className="col-md-8 col-sm-6">
                            <h4 className="title">Description</h4>
                          </div>
                          <div className="col-md-4 col-sm-6">
                            <span className="edit">
                              <a onClick={this.handleEdit}>Edit</a>
                            </span>
                          </div>
                          <div className="col-md-12">
                            <p className="content">{this.props.hireInfo.job.description}</p>
                          </div>
                        </div>
                        <hr></hr>
                        <div className="row box">
                          <div className="col-md-12">
                            <Icon type="paper-clip" />
                            <span>Attach file</span>
                          </div>
                        </div>
                        <hr></hr>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ margin: "20px 0px" }}></div>
                <div className="content-details shadow">
                  {this.props.hireInfo && (
                    <div>
                      <div className="head d-md-flex d-block justify-content-between align-items-center">
                        <div className="user mb-3 mb-md-0">
                          <h2>Terms</h2>
                        </div>
                      </div>
                      <hr></hr>
                      <div className="main-content">
                        <div className="row box">
                          <div className="col-md-12 col-sm-12">
                            <h4 className="title">Total Amount</h4>
                          </div>
                          <div className="col-md-4">
                            <p
                              className="content"
                              style={{ color: "#07b107", fontSize: "16px" }}
                            >
                              ${this.props.hireInfo.budget}
                            </p>
                          </div>
                          <div className="col-md-8 col-sm-6">
                            <span className="edit">
                              <a onClick={this.handleEdit}>Edit</a>
                            </span>
                          </div>
                        </div>
                        <hr></hr>
                        <div className="row box">
                          <div className="col-md-8 col-sm-6">
                            <h4 className="title">Deposit into Escrow</h4>
                          </div>
                          <div className="col-md-12" style={{ marginTop: "20px" }}>
                            <Radio.Group
                              onChange={(e) => {
                                this.setState({
                                  deposit: e.target.value,
                                });
                              }}
                              value={this.state.deposit}
                            >
                              <Radio
                                value={0}
                                className="d-block mb-3"
                                defaultChecked
                                onChange={() => {
                                  this.setState({ show: false });
                                }}
                              >
                                Deposit ${this.props.hireInfo.budget} for the whole project
                              </Radio>
                              <Radio value={1} className="d-block mb-3">
                                Deposit a lesser amount to cover the first milestone
                              </Radio>
                            </Radio.Group>
                          </div>
                        </div>
                        <hr></hr>
                        <div className="row box">
                          <div
                            className={
                              this.state.deposit === 0 || !this.state.deposit
                                ? "milestone-list-content hide"
                                : "milestone-list-content show"
                            }
                          >
                            <Form>
                              <div className="add-milestone mb-4 d-md-flex">
                                <div className="ms-descrption mr-md-2 mr-0 mb-2 mb-md-0">
                                  <Form.Item label="Description">
                                    {getFieldDecorator("description", {
                                      initialValue: "", //solution
                                      rules: [
                                        {
                                          required: true,
                                          message: "Please input description of a milestone",
                                        },
                                      ],
                                    })(
                                      <Input placeholder="please input description of a milestone" />,
                                    )}
                                  </Form.Item>
                                </div>
                                <div
                                  className="ms-price mr-md-2 mr-0 mb-2 mb-md-0"
                                  // style={{ maxWidth: "150px" }}
                                >
                                  <Form.Item label="Due Date">
                                    <DatePicker
                                      showTime
                                      placeholder="Due Date"
                                      value={this.state.dueDateTime}
                                      onChange={this.selectdueDateTime}
                                      size={"large"}
                                    />
                                  </Form.Item>
                                </div>
                                <div
                                  className="ms-price mr-md-2 mr-0 mb-2 mb-md-0"
                                  style={{ maxWidth: "150px" }}
                                >
                                  <Form.Item label="Price">
                                    {getFieldDecorator("price", {
                                      initialValue: getContractBudget(),
                                      rules: [
                                        { required: true, message: "Price of a milestone" },
                                      ],
                                    })(
                                      <InputNumber
                                        placeholder="Price of a milestone"
                                        size={"large"}
                                        min={1}
                                        formatter={(value) =>
                                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                        }
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                        className="w-100"
                                      />,
                                    )}
                                  </Form.Item>
                                </div>
                                <button
                                  className={`button-primary`}
                                  style={{ marginTop: "38px" }}
                                  onClick={this.createLesserMilestone}
                                >
                                  <Icon type="plus" />
                                  &nbsp;Add
                                </button>
                              </div>
                            </Form>
                          </div>
                        </div>
                        {this.state.deposit === 1 ? <hr></hr> : ""}

                        <div className="row box">
                          <div className="col-md-5 col-sm-6">
                            {this.state.show === true
                              ? `Description : ${this.state.description}`
                              : ""}
                          </div>
                          <div className="col-md-4 col-sm-3">
                            {this.state.show === true
                              ? `Due Date: ${this.state.dueDateString}`
                              : ""}
                          </div>
                          <div className="col-md-3 col-sm-3">
                            {this.state.show === true ? `Price : $ ${this.state.price}` : ""}
                          </div>
                        </div>
                        {this.state.show === true ? <hr></hr> : ""}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ margin: "20px 0px" }}></div>
                {this.props.hireInfo && (
                  <div className="content-details shadow">
                    <div className="main-content">
                      <div className="row box">
                        <div className="col-md-12">
                          <Checkbox
                            onChange={this.onConfirmChange}
                            style={{ color: "black", paddingTop: "25px" }}
                          >
                            Yes, I understand and agree to the VendorForest Terms of Service,
                            including the User Agreement and
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Privacy Policy
                          </Checkbox>
                        </div>
                        <div className="col-md-6" style={{ margin: "5% 0px" }}>
                          {this.state.confirmStatus ? (
                            this.state.skip === false ? (
                              <Popconfirm
                                placement="leftBottom"
                                title={text()}
                                onConfirm={this.confirmPopup}
                                okText="Yes, Deposite Now"
                                cancelText="Cancel"
                                style={{ padding: "0% 20%" }}
                              >
                                <Button
                                  type="primary"
                                  className={`confirm_btn ${
                                    this.state.pendingBtn === true ? "disable" : ""
                                  }`}
                                >
                                  Hire {this.props.hireInfo.vendor.username}
                                  &nbsp;
                                  {this.state.pendingBtn && <Icon type="sync" spin />}
                                </Button>
                              </Popconfirm>
                            ) : (
                              <Button
                                type="primary"
                                className={`confirm_btn ${
                                  this.state.pendingBtn === true ? "disable" : ""
                                }`}
                                onClick={() => this.setState({ visible: true })}
                              >
                                Hire {this.props.hireInfo.vendor.username}
                                &nbsp;
                                {this.state.pendingBtn && <Icon type="sync" spin />}
                              </Button>
                            )
                          ) : (
                            <Button
                              type="primary"
                              className={`confirm_btn ${
                                this.state.pendingBtn === true ? "disable" : ""
                              }`}
                              onClick={() => {
                                message.warning("Please check the checkbox ");
                              }}
                            >
                              Hire {this.props.hireInfo.vendor.username}
                              &nbsp;
                              {this.state.pendingBtn && <Icon type="sync" spin />}
                            </Button>
                          )}
                          <Button
                            type="default"
                            className="cancel_btn"
                            onClick={this.cancelMilestone}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-md-3 mb-4">
                <div className="justify mb-4">
                  <h6 className="pb-3 border-bottom mb-2">
                    How do fixed-price contracts work?
                  </h6>
                  At the start of the engagement, you and your freelancer agree on certain work
                  milestones and how much you'll pay for the completion of each. Before work
                  begins on a milestone, you'll pre-fund the payment into an escrow account.
                  Upon receiving and approving that milestone, you release payment to your
                  freelancer.
                </div>
                <div className="justify mb-4">
                  <h6 className="pb-3 border-bottom mb-2">How do I pay?</h6>
                  You release funding as each milestone is completed to your satisfaction.
                </div>
                <div className="justify mb-4">
                  <h6 className="pb-3 border-bottom mb-2">What if there is a problem?</h6>
                  You're protected by VendorForest.com Payment Protection, which assures that
                  you pay only for work you’ve approved. If an issue ever should arise, our
                  payment protection and dispute resolution programs will help fix the
                  situation.
                </div>
                <div className="justify mb-4">
                  <h6 className="pb-3 border-bottom mb-2">
                    How does VendorForest.com make money?
                  </h6>
                  Vendors pay Vendorforest.com a variable service fee, taken as a percentage of
                  their earnings.
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          visible={this.state.visible}
          title="Please confirm the password to your account."
          okText="Confirm"
          onCancel={this.handleCancel}
          onOk={this.handeleOk}
        >
          <Form className="login-form">
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "Please input your Password!" }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          visible={this.state.emditmodal}
          title="Update Proposal"
          okText="Update"
          onCancel={this.onCancel}
          onOk={this.onCreate}
        >
          {this.props.hireInfo && (
            <Form layout="vertical">
              <Form.Item label="Title">
                {getFieldDecorator("updateTitle", {
                  initialValue: this.props.hireInfo.job.title,
                  rules: [{ required: true, message: "Please input the title of Proposal!" }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="description">
                {getFieldDecorator("updateDescription", {
                  initialValue: this.props.hireInfo.job.description,
                  rules: [
                    { required: true, message: "Please input the description of Proposal!" },
                  ],
                })(<TextArea type="textarea" rows={5} />)}
              </Form.Item>
              <Form.Item label="Price">
                {getFieldDecorator("updatePrice", {
                  initialValue: getContractBudget(),
                  rules: [{ required: true, message: "Price of a milestone" }],
                })(
                  <InputNumber
                    placeholder="Price of a milestone"
                    size={"large"}
                    min={1}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    className="w-100"
                  />,
                )}
              </Form.Item>
            </Form>
          )}
        </Modal>
        <Footer />
      </div>
    );
  }
}

const HireMilestonesForm = Form.create({ name: "client_hire_milestoneform" })(Hire);
const mapStateToProps = ({ loginReducer, clientHireDetailReducer }) => {
  const { error, success, pending, hireInfo } = clientHireDetailReducer;

  const { user } = loginReducer;

  return { error, success, pending, user, hireInfo };
};

export default connect(mapStateToProps, {
  fetchGetHireData,
  updateProposal,
  comparePW,
})(withStyles(globalStyle, localStyle)(HireMilestonesForm));
