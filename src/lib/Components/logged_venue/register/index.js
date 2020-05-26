import React from "react";
import { Steps, Button } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";

import {Header, Footer} from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";

import RegisterVenueStepOne from "./RegisterStepOne";
import RegisterVenueStepTwo from "./RegisterStepTwo";
import RegisterVenueStepThree from "./RegisterStepThree";
import RegisterVenueStepFour from "./RegisterStepFour";
const Step = Steps.Step;

const steps = [
  {
    title: "Contact Info",
    content: <RegisterVenueStepOne />,
  },
  {
    title: "About Venue",
    content: <RegisterVenueStepTwo />,
  },
  {
    title: "Schedule",
    content: <RegisterVenueStepThree />,
  },
  {
    title: "Payment Method",
    content: <RegisterVenueStepFour />,
  },
];

class RegisterVenue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
    };
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
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

  render() {
    return (
      <div className="register-venue">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-12 mb-md-4 mb-3">
                <div className="steps-head">
                  <Steps size="small" current={this.state.currentStep}>
                    {steps.map((step, index) => (
                      <Step key={index} title={step.title} />
                    ))}
                  </Steps>
                </div>
              </div>
              <div className="col-12 mb-3">
                <div className="steps-content">{steps[this.state.currentStep].content}</div>
              </div>
              <div className="col-12">
                <div className="steps-footer">
                  {this.state.currentStep === 0 ? (
                    <div className="d-flex justify-content-end">
                      <Button type="primary" onClick={this.next}>
                        Next
                      </Button>
                    </div>
                  ) : this.state.currentStep === steps.length - 1 ? (
                    <div className="d-flex justify-content-end">
                      <Button onClick={this.back}>Back</Button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end">
                      <Button onClick={this.back} className="mr-3">
                        Back
                      </Button>
                      <Button type="primary" onClick={this.next}>
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(globalStyle, localStyle)(RegisterVenue);
