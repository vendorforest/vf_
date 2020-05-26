import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import style from "./index.scss";
import AddStepOne from "./AddStepOne";
import AddStepTwo from "./AddStepTwo";
import AddStepThree from "./AddStepThree";
import { Card, Icon, Modal, Button, Steps } from "antd";
const Step = Steps.Step;

const serviceTypes = ["Type1", "Type2", "Type3", "Type4"];
const categories = ["Category1", "Category2", "Category3", "Category4"];
const moreItems = ["More1", "More2", "More3", "More4"];

const steps = [
  {
    title: "About the service",
    content: <AddStepOne />,
  },
  {
    title: "Service schedule",
    content: <AddStepTwo />,
  },
  {
    title: "Rate",
    content: <AddStepThree />,
  },
];

class VendorServices extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModal: false,
      currentStep: 0,
      services: [
        {
          type: 0,
          category: 0,
          more: 0,
          ratePerHr: 35,
          fixedRate: 2000,
        },
      ],
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

  componentDidMount() {}

  render() {
    const generateServices = () => {
      return this.state.services.map((service, index) => {
        return (
          <div className="col-md-4 mb-2" key={index}>
            <Card className="w-100 h-100" title={`Service${index}`}>
              <p>
                Service Type: <span className="text-color">{serviceTypes[service.type]}</span>
              </p>
              <p>
                Category: <span className="text-color">{categories[service.category]}</span>
              </p>
              <p>
                More Type: <span className="text-color">{moreItems[service.more]}</span>
              </p>
              <p>
                Rate Pre Hour: <span className="text-color">$ {service.ratePerHr}</span>
              </p>
              <p>
                Fixed Rate: <span className="text-color">$ {service.fixedRate}</span>
              </p>
            </Card>
          </div>
        );
      });
    };
    return (
      <div className="vendor-services">
        <Card
          title="Services"
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)" }}
          extra={
            <div onClick={this.toggle} className="text-color" style={{ cursor: "pointer" }}>
              <Icon type="plus" />
            </div>
          }
        >
          <div className="row">{generateServices()}</div>
        </Card>
        <Modal
          title="Add Service"
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

export default withStyles(style)(VendorServices);
