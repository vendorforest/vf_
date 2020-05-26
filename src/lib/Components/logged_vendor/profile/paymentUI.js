import React from "react";
import { Icon, Input, Form, Divider, InputNumber } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { constants } from "@Shared/constants";

class Milestones extends React.Component {
  _button = -1;

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="milestones">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-md-3 col-sm-6 col-12 text-center mb-3 mb-md-0">
                <h6 className="mb-2">Budget</h6>
                <h6 className="font-weight-normal text-color">$100</h6>
              </div>
              <div className="col-md-3 col-sm-6 col-12 text-center mb-3 mb-md-0">
                <h6 className="mb-2">In Escrow</h6>
                <h6 className="font-weight-normal text-color">$150</h6>
              </div>
              <div className="col-md-3 col-sm-6 col-12 text-center mb-3 mb-md-0">
                <h6 className="mb-2">Remaining</h6>
                <h6 className="font-weight-normal text-color">$200</h6>
              </div>
              <div className="col-md-3 col-sm-6 col-12 text-center mb-3 mb-md-0">
                <h6 className="mb-2">Total Payments</h6>
                <h6 className="font-weight-normal text-color">$500</h6>
              </div>
            </div>
            <hr />
            <div className="milestone-list-content">
              <h5 className="mb-2">Milestones</h5>
              <Form>
                <div className="add-milestone mb-4 d-md-flex">
                  <div className="ms-descrption mr-md-2 mr-0 mb-2 mb-md-0">
                    <Form.Item label="Description"></Form.Item>
                  </div>
                  <div
                    className="ms-price mr-md-2 mr-0 mb-2 mb-md-0"
                    style={{ maxWidth: "150px" }}
                  >
                    <Form.Item label="Price"></Form.Item>
                  </div>
                  <button className="button-primary">Withdraw</button>
                </div>
              </Form>
              <div className="milestone-list"></div>
            </div>
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

export default connect(mapStateToProps, {})(MilestonesForm);
