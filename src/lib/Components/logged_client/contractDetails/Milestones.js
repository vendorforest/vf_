import React from "react";
import { Icon, Input, Form, Divider, InputNumber, message } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { constants } from "@Shared/constants";
import {
  fetchGetMilestonesData,
  fetchCreateMilestoneData,
  fetchRleaseMilestoneData,
  fetchCancelMilestoneData,
  // fetchMilestoneResult,
} from "./essential";

class Milestones extends React.Component {
  _button = -1;

  constructor(props) {
    super(props);

    this.state = {};
    this.create = this.create.bind(this);
  }
  componentWillReceiveProps(newProps) {
    if (this.props.contract._id !== newProps.contract._id) {
      this.props.fetchGetMilestonesData({
        contract: newProps.contract._id,
      });
    }
  }
  componentDidMount() {
    this.props.fetchGetMilestonesData({
      contract: this.props.contract._id,
    });
  }

  create() {
    this._button = 0;
    this.props.form.validateFields(["description", "price"], (err, values) => {
      if (!err) {
        this.props.fetchCreateMilestoneData({
          ...values,
          contract: this.props.contract._id,
        });
        this.props.form.setFieldsValue({
          description: "",
        });
      }
    });
  }

  releaseMilestone(index) {
    if (this.props.pending) {
      return;
    }
    this._button = index + 1;
    this.props.fetchRleaseMilestoneData({
      _id: this.props.milestones[index]._id,
      contractId: this.props.contract._id,
    });
  }

  cancelMilestone(index) {
    if (this.props.pending) {
      return;
    }
    this._button = index + 1;
    this.props.fetchCancelMilestoneData({
      _id: this.props.milestones[index]._id,
    });
  }

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    const generateMilestone = () => {
      return this.props.milestones.map((milestone, index) => {
        if (milestone.status === constants.MILESTONE_STATUS.RELEASED) {
          return (
            <div
              key={index}
              className="d-md-flex d-block justify-content-between align-items-end border-bottom mb-3 pb-3"
            >
              <h6 className="mb-2">
                {index + 1}. {milestone.description}
              </h6>
              <div className="text-right d-md-block d-flex justify-content-between ">
                <p className=" font-weight-bold mb-2">$ {milestone.price}</p>
                <p>{moment(milestone.createdAt).format("YYYY-MM-DD HH:mm A")}</p>
                <p>Payment Completed</p>
              </div>
            </div>
          );
        } else {
          return (
            <div
              key={index}
              className="d-md-flex d-block justify-content-between align-items-end border-bottom mb-3 pb-3"
            >
              <h6 className="mb-2">
                {index + 1}. {milestone.description}
              </h6>
              <div className="text-right d-md-block d-flex justify-content-between ">
                <p className=" font-weight-bold mb-2">$ {milestone.price}</p>
                <div>
                  {this.props.pending && this._button === index + 1 && (
                    <Icon type="sync" spin className="mr-2 text-success" />
                  )}
                  {/* {this.props.contract.status === constants.CONTRACT_STATUS.END ? ( */}
                  <a
                    className={`pointer ${
                      milestone.status === constants.MILESTONE_STATUS.REQ_RELEASED
                        ? "text-warning"
                        : "text-success"
                    }`}
                    onClick={() => {
                      this.releaseMilestone(index);
                    }}
                  >
                    Release
                  </a>
                </div>
              </div>
            </div>
          );
        }
      });
    };

    const getContractBudget = () => {
      return this.props.contract.job.budgetType === constants.BUDGET_TYPE.FIXED
        ? this.props.contract.totalBudget
        : this.props.contract.budget * this.props.contract.limitTime;
    };

    return (
      <div className="milestones">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-md-3 col-sm-6 col-12 text-center mb-3 mb-md-0">
                <h6 className="mb-2">Budget</h6>
                <h6 className="font-weight-normal text-color">
                  $ {getContractBudget()}{" "}
                  {this.props.contract.job.budgetType === constants.BUDGET_TYPE.FIXED
                    ? ""
                    : `(${this.props.contract.limitTime}hrs X ${this.props.contract.budget}/hr)`}
                </h6>
              </div>
              <div className="col-md-3 col-sm-6 col-12 text-center mb-3 mb-md-0">
                <h6 className="mb-2">In Escrow</h6>
                <h6 className="font-weight-normal text-color">
                  $ {this.props.contract.escrowPrice}
                </h6>
              </div>
              <div className="col-md-3 col-sm-6 col-12 text-center mb-3 mb-md-0">
                <h6 className="mb-2">Remaining</h6>
                <h6 className="font-weight-normal text-color">
                  ${" "}
                  {getContractBudget() >= this.props.contract.paidPrice
                    ? getContractBudget() - this.props.contract.paidPrice
                    : "--"}
                </h6>
              </div>
              <div className="col-md-3 col-sm-6 col-12 text-center mb-3 mb-md-0">
                <h6 className="mb-2">Total Payments</h6>
                <h6 className="font-weight-normal text-color">
                  $ {this.props.contract.paidPrice}
                </h6>
              </div>
            </div>
            <hr />
            {!this.props.milestones && this.props.pending && (
              <div className="text-center loading-small py-5">
                <Icon type="sync" spin />
              </div>
            )}
            {this.props.milestones && (
              <div className="milestone-list-content">
                <h5 className="mb-2">Milestones</h5>
                {/* <Form>
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
                        })(<Input placeholder="please input description of a milestone" />)}
                      </Form.Item>
                    </div>
                    <div
                      className="ms-price mr-md-2 mr-0 mb-2 mb-md-0"
                      style={{ maxWidth: "150px" }}
                    >
                      <Form.Item label="Price">
                        {getFieldDecorator("price", {
                          initialValue:
                            getContractBudget() >= this.props.contract.paidPrice
                              ? getContractBudget() - this.props.contract.paidPrice
                              : 0, //solution
                          rules: [{ required: true, message: "Price of a milestone" }],
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
                      className={`button-primary ${
                        this.props.pending && this._button === 0 ? "disable" : ""
                      }`}
                      style={{ marginTop: "38px" }}
                      onClick={this.create}
                    >
                      <Icon type="plus" />
                      &nbsp;Add
                    </button>
                  </div>
                </Form> */}
                <div className="milestone-list">{generateMilestone()}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const MilestonesForm = Form.create({ name: "client_add_milestoneform" })(Milestones);
const mapStateToProps = ({ clientContractDetailsReducer, loginReducer }) => {
  const { error, contract, milestones, success, pending } = clientContractDetailsReducer;

  const { user } = loginReducer;

  return {
    error,
    contract,
    milestones,
    success,
    pending,
    user,
  };
};

export default connect(mapStateToProps, {
  fetchGetMilestonesData,
  fetchCreateMilestoneData,
  fetchRleaseMilestoneData,
  fetchCancelMilestoneData,
})(MilestonesForm);
