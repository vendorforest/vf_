import React from "react";
import { Input, Form } from "antd";
const { TextArea } = Input;

class AddStepOne extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      about: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {}

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    const nameError = isFieldTouched("name") && getFieldError("name");
    const aboutError = isFieldTouched("about") && getFieldError("about");

    return (
      <div className="addteams-stepone">
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-12">
              <Form.Item
                label="Team Name"
                validateStatus={nameError ? "error" : ""}
                help={nameError || ""}
              >
                {getFieldDecorator("name", {
                  initialValue: this.state.name, //solution
                  rules: [{ required: true, message: "Please input team name!" }],
                })(
                  <Input
                    placeholder="Team Name"
                    name="name"
                    onChange={(value) => {
                      this.setState({
                        name: value.target.value,
                      });
                    }}
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item
                label="About the team"
                validateStatus={aboutError ? "error" : ""}
                help={aboutError || ""}
              >
                {getFieldDecorator("about", {
                  initialValue: this.state.about, //solution
                  rules: [{ required: true, message: "Please input about the team!" }],
                })(
                  <TextArea
                    placeholder="About the team"
                    name="about"
                    onChange={(value) => {
                      this.setState({
                        about: value.target.value,
                      });
                    }}
                    rows={4}
                  />,
                )}
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const AddTeamStepOneForm = Form.create({ name: "vendor_addteam_stepone" })(AddStepOne);

export default AddTeamStepOneForm;
