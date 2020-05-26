import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import style from "./index.scss";
import AddStepOne from "./AddStepOne";
import AddStepTwo from "./AddStepTwo";
import { Card, Icon, Modal, Button, Steps } from "antd";
const Step = Steps.Step;

const permissions = ["Administrator", "Developer", "Manager"];
const steps = [
  {
    title: "About the team",
    content: <AddStepOne />,
  },
  {
    title: "Members",
    content: <AddStepTwo />,
  },
];

class VendorTeams extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModal: false,
      currentStep: 0,
      teams: [
        {
          name: "Team1",
          about:
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque possimus facilis architecto iure eum aliquid, praesentium totam nemo molestiae rerum.",
          members: [
            {
              name: "Gerard Kasemba",
              email: "gerardkasemba@mail.com",
              permission: 0,
            },
            {
              name: "Jaon Micle",
              email: "jaonmicle@mail.com",
              permission: 1,
            },
          ],
        },
        {
          name: "Team2",
          about:
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque possimus facilis architecto iure eum aliquid, praesentium totam nemo molestiae rerum.",
          members: [
            {
              name: "Gerard Kasemba",
              email: "gerardkasemba@mail.com",
              permission: 0,
            },
            {
              name: "Jaon Micle",
              email: "jaonmicle@mail.com",
              permission: 1,
            },
          ],
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
    const generateTeams = () => {
      return this.state.teams.map((team, index) => {
        return (
          <div className="col-md-4 mb-2" key={index}>
            <Card
              title={team.name}
              extra={<a href="/viewteam">View</a>}
              className="w-100 h-100"
            >
              <p className="mb-3">{team.about}</p>
              <p>
                Member Count: <span className="text-color">{team.members.length}</span>
              </p>
            </Card>
          </div>
        );
      });
    };

    return (
      <div className="vendor-teams">
        <Card
          title="Teams"
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)" }}
          extra={
            <div onClick={this.toggle} className="text-color" style={{ cursor: "pointer" }}>
              <Icon type="plus" />
            </div>
          }
        >
          <div className="row">{generateTeams()}</div>
        </Card>
        <Modal
          title="Add Team"
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
              : [
                  <Button key="back" onClick={this.back}>
                    Back
                  </Button>,
                  <Button key="next" type="primary" onClick={this.save}>
                    Register
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

export default withStyles(style)(VendorTeams);
