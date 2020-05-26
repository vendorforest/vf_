import React from "react";
import { Card, Avatar, Icon, Modal, Button, Steps } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import AddStepOne from "./AddStepOne";
import AddStepTwo from "./AddStepTwo";
import AddStepThree from "./AddStepThree";

import style from "./index.scss";

const Step = Steps.Step;
const { Meta } = Card;

const steps = [
  {
    title: "About the employee",
    content: <AddStepOne />,
  },
  {
    title: "Service",
    content: <AddStepTwo />,
  },
  {
    title: "Rate",
    content: <AddStepThree />,
  },
];

class VendorEmployees extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModal: false,
      currentStep: 0,
    };
    this.toggle = this.toggle.bind(this);
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.save = this.save.bind(this);
    this.ok = this.ok.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  toggle() {
    this.setState({
      isModal: !this.state.isModal,
      currentStep: 0,
    });
  }

  next() {
    this.setState({
      currentStep: this.state.currentStep + 1,
    });
  }

  back() {
    this.setState({
      currentStep: this.state.currentStep - 1,
    });
  }

  save() {
    this.toggle();
  }

  cancel() {
    this.toggle();
  }

  ok() {
    this.toggle();
  }
  render() {
    return (
      <div className="vendor-employees">
        <Card
          title="Teams"
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)" }}
          extra={
            <div onClick={this.toggle} className="text-color" style={{ cursor: "pointer" }}>
              <Icon type="plus" />
            </div>
          }
        >
          <div className="row">
            <div className="col-md-4 col-sm-6 mb-2">
              <Card className="w-100 h-100">
                <Meta
                  avatar={
                    <Avatar src="https://semantic-ui.com/images/avatar2/large/kristy.png" />
                  }
                  title="Talik"
                  description="Co-founder"
                />
                button
              </Card>
            </div>
            <div className="col-md-4 col-sm-6 mb-2">
              <Card className="w-100 h-100">
                <Meta
                  avatar={
                    <Avatar src="https://semantic-ui.com/images/avatar2/large/kristy.png" />
                  }
                  title="Talik"
                  description="Co-founder"
                />
                button
              </Card>
            </div>
            <div className="col-md-4 col-sm-6 mb-2">
              <Card className="w-100 h-100">
                <Meta
                  avatar={
                    <Avatar src="https://semantic-ui.com/images/avatar2/large/kristy.png" />
                  }
                  title="Talik"
                  description="Co-founder"
                />
                button
              </Card>
            </div>
          </div>
        </Card>
        <Modal
          title="Add Employee"
          visible={this.state.isModal}
          onOk={this.ok}
          onCancel={this.cancel}
          width={"650px"}
          footer={
            this.state.currentStep === 0
              ? [
                  <Button key="next" type="primary" onClick={this.next}>
                    Next
                  </Button>,
                ]
              : this.state.currentStep >= 2
              ? [
                  <Button key="back" onClick={this.back}>
                    Back
                  </Button>,
                  <Button key="next" type="primary" onClick={this.save}>
                    Save
                  </Button>,
                ]
              : [
                  <Button key="back" onClick={this.back}>
                    Back
                  </Button>,
                  <Button key="next" type="primary" onClick={this.next}>
                    Next
                  </Button>,
                ]
          }
        >
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <Steps size="large" current={this.state.currentStep}>
                  {steps.map((step, index) => (
                    <Step key={index} title={step.title} />
                  ))}
                </Steps>
                <div className="steps-content">{steps[this.state.currentStep].content}</div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(style)(VendorEmployees);
