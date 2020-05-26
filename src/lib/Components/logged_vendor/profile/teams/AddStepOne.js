import React from "react";
import { Input, Form } from "antd";
const { TextArea } = Input;

class AddStepOne extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.team.name,
      about: this.props.team.about,
    };
    this.next = this.next.bind(this);
  }

  next = async (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((error, value) => {
      if (!error) {
        this.props.updateTeam(value);
        this.props.updateStep(1);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    return (
      <div className="addteams-stepone">
        <Form layout="vertical" onSubmit={this.next}>
          <div className="row">
            <div className="col-12">
              <Form.Item label="Team Name">
                {getFieldDecorator("name", {
                  initialValue: this.state.name, //solution
                  rules: [{ required: true, message: "Please input team name!" }],
                })(<Input placeholder="Team Name" name="name" size={"large"} />)}
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item label="About the team">
                {getFieldDecorator("about", {
                  initialValue: this.state.about, //solution
                  rules: [{ required: true, message: "Please input about the team!" }],
                })(<TextArea placeholder="About the team" name="about" rows={5} />)}
              </Form.Item>
            </div>
            <div className="col-12 controls d-flex justify-content-end">
              <button className="button-primary" type="submit">
                Next
              </button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const AddTeamStepOneForm = Form.create({ name: "vendor_addteam_stepone" })(AddStepOne);

export default AddTeamStepOneForm;
