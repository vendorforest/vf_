import React from "react";
import { Input, Form, Avatar, Select, Button } from "antd";
const { Option } = Select;
const { TextArea } = Input;
const permissions = ["Administrator", "Developer", "Manager"];

class VendorEditTeam extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "gerardkasemba@mail.com",
      permission: 0,
      name: "",
      about: "",
      members: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectPermission = this.selectPermission.bind(this);
    this.addMember = this.addMember.bind(this);
  }

  componentDidMount() {
    this.setState({
      name: this.props.team ? this.props.team.name : "",
      about: this.props.team ? this.props.team.about : "",
      members: this.props.team ? this.props.team.members : [],
    });
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      name: newProps.team ? newProps.team.name : "",
      about: newProps.team ? newProps.team.about : "",
      members: newProps.team ? newProps.team.members : [],
    });
  }

  handleSubmit() {}

  selectPermission(value) {
    this.setState({
      permission: value,
    });
  }

  addMember() {
    let newMembers = [...this.state.members];
    newMembers.push({
      email: this.state.email,
      permission: this.state.permission,
    });
    this.setState({
      members: newMembers,
    });
  }

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    const nameError = isFieldTouched("name") && getFieldError("name");
    const aboutError = isFieldTouched("about") && getFieldError("about");
    const emailError = isFieldTouched("email") && getFieldError("email");

    const generatePermissionOptions = () => {
      return permissions.map((permission, index) => {
        return <Option value={String(index)}>{permission}</Option>;
      });
    };

    const generateMemberList = () => {
      return this.state.members.map((member, index) => {
        return (
          <div className="row border-bottom" key={index}>
            <div className="col-md-9 d-flex py-2 align-items-center">
              <Avatar src="https://semantic-ui.com/images/avatar2/large/kristy.png" />
              <div className="ml-3">
                <h6>{member.email}</h6>
                <a href="">Details</a>
              </div>
            </div>
            <div className="col-md-3 d-flex justify-content-end align-items-center py-md-0 py-2">
              <Select
                value={String(member.permission)}
                style={{ width: "100%" }}
                onChange={(value) => {
                  let newMembers = [...this.state.members];
                  newMembers[index].permission = Number(value);
                  this.setState({
                    members: newMembers,
                  });
                }}
              >
                {generatePermissionOptions()}
              </Select>
            </div>
          </div>
        );
      });
    };

    return (
      <div className="add-teams">
        <div className="row">
          <div className="col-md-12">
            <Form.Item
              label="Team Name"
              validateStatus={nameError ? "error" : ""}
              help={nameError || ""}
            >
              {getFieldDecorator("name", {
                initialValue: this.state.name,
                rules: [{ required: true, message: "Please input your Team Name" }],
              })(
                <Input
                  placeholder="Team Name"
                  name="businessName"
                  onChange={(value) => {
                    this.setState({
                      name: value.target.value,
                    });
                  }}
                />,
              )}
            </Form.Item>
          </div>
          <div className="col-md-12">
            <Form.Item
              label="About the team"
              validateStatus={aboutError ? "error" : ""}
              help={aboutError || ""}
            >
              {getFieldDecorator("about", {
                initialValue: this.state.about,
                rules: [{ required: true, message: "Please input about the team" }],
              })(
                <TextArea
                  placeholder=""
                  name="about"
                  onChange={(value) => {
                    this.setState({
                      about: value.target.value,
                    });
                  }}
                  rows={5}
                />,
              )}
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              label="Member Email or Name"
              validateStatus={emailError ? "error" : ""}
              help={emailError || ""}
            >
              {getFieldDecorator("name", {
                initialValue: this.state.email,
                rules: [{ required: true, message: "Please input Email or Username!" }],
              })(
                <Input
                  placeholder="Member name or Email"
                  name="email"
                  onChange={(value) => {
                    this.setState({
                      email: value.target.value,
                    });
                  }}
                />,
              )}
            </Form.Item>
          </div>
          <div className="col-md-3">
            <Form.Item label="Permission">
              <Select
                value={String(this.state.permission)}
                style={{ width: "100%" }}
                onChange={(value) => {
                  this.selectPermission(Number(value));
                }}
              >
                {generatePermissionOptions()}
              </Select>
            </Form.Item>
          </div>
          <div className="col-md-3 add-btn">
            <Button key="add" type="primary" onClick={this.addMember} className="mt-3">
              Add
            </Button>
          </div>
          <div className="col-12">
            <p className="mb-4">Members being invited</p>
            {generateMemberList()}
          </div>
        </div>
      </div>
    );
  }
}

const VendorEditTeamForm = Form.create({ name: "vendor_addteam" })(VendorEditTeam);

export default VendorEditTeamForm;
