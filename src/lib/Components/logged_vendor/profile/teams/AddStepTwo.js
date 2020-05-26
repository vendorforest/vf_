import React from "react";
import { Input, Form, Avatar, Select, Button, message, Icon } from "antd";
import { connect } from "react-redux";
import { fetchFindUser, fetchCreateTeam, updateTeams } from "../essential";
const firebase = require("firebase/app");
const { Option } = Select;

class AddStepTwo extends React.Component {
  _btnFlag = 0;

  constructor(props) {
    super(props);

    this.state = {
      members: [],
      pending: false,
    };
    this.create = this.create.bind(this);
    this.prev = this.prev.bind(this);
    this.addMember = this.addMember.bind(this);
  }

  addMember() {
    this.props.form.validateFields(["email"], async (error, value) => {
      if (!error && !this.state.pending) {
        this.setState({ pending: true });
        this._btnFlag = 0;
        fetchFindUser({
          email: value.email,
        })
          .then((data) => {
            this.setState({ pending: false });
            if (data) {
              let newMembers = [...this.state.members];
              if (newMembers.findIndex((member) => member._id === data.data._id) > -1) {
                message.warning("This vendor added already.");
                return;
              }
              newMembers.push(data.data);
              this.setState({
                members: newMembers,
              });
              this.props.form.setFieldsValue({
                email: "",
              });
            } else {
              message.warning("This vendor doesn't exist");
            }
          })
          .catch((error) => {
            this.setState({ pending: false });
            message.error(error.message);
          });
      }
    });
  }

  deleteMember(index) {
    let newMembers = [...this.state.members];
    newMembers.splice(index, 1);
    this.setState({
      members: newMembers,
    });
  }

  create() {
    this.setState({ pending: true });
    this._btnFlag = 1;
    const params = {
      name: this.props.team.name,
      about: this.props.team.about,
      admin: this.props.user._id,
      members: this.state.members.map((member) => member._id),
    };
    fetchCreateTeam(params)
      .then(async (data) => {
        // const memberEmail = this.state.members.map((member) => member.email);
        // memberEmail.push(this.props.user.email);
        // const docKey = memberEmail.sort().join(":");
        // await firebase
        //   .firestore()
        //   .collection("chats")
        //   .doc(docKey)
        //   .set({
        //     messages: [
        //       {
        //         message: "We are new team.",
        //         sender: this.props.user.email,
        //         timeStamp: Date.now(),
        //       },
        //     ],
        //     users: memberEmail,
        //     userNames: params.name,
        //     receiverHadRead: false,
        //     contract: 0,
        //     createdAt: Date.now(),
        //     teamId: data.data._id,
        //   });
        this.setState({ pending: false });
        const teams = [...this.props.teams];
        teams.push(data.data);
        this.props.updateTeams(teams);
        message.success(data.message);
        this.props.toggle();
      })
      .catch((error) => {
        this.setState({ pending: false });
        message.error(error.message);
      });
  }

  prev() {}

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    const generateMemberList = () => {
      return this.state.members.map((member, index) => {
        return (
          <div className="row border-bottom" key={index}>
            <div className="col-md-9 d-flex py-2 align-items-center">
              <Avatar
                src={
                  member.profileImage ||
                  "https://semantic-ui.com/images/avatar2/large/kristy.png"
                }
              />
              <div className="ml-3">
                <h6>{member.email}</h6>
                <a href="">Details</a>
              </div>
            </div>
            <div
              className="col-md-3 text-right pointer"
              style={{
                marginTop: "10px",
              }}
            >
              <div
                className="text-danger"
                onClick={() => {
                  this.deleteMember(index);
                }}
              >
                <Icon type="close" /> Delete
              </div>
            </div>
          </div>
        );
      });
    };

    return (
      <div className="addteams-steptwo">
        <Form layout="vertical">
          <div className="row">
            <div className="col-md-9">
              <Form.Item label="Member Email">
                {getFieldDecorator("email", {
                  initialValue: this.state.email,
                  rules: [{ required: true, message: "Please input Email" }],
                })(<Input placeholder="Member Email" name="email" size={"large"} />)}
              </Form.Item>
            </div>
            <div className="col-md-3 add-btn">
              <button
                className={`button-primary mt-3 ${
                  this.state.pending && this._btnFlag === 0 ? "disable" : ""
                }`}
                onClick={this.addMember}
                style={{ height: "40px", lineHeight: "40px" }}
              >
                Add Member
              </button>
            </div>
            {this.state.members.length > 0 && (
              <div className="col-12">
                <p className="mb-4">Members being invited</p>
                {generateMemberList()}
              </div>
            )}
            <div className="col-12 controls d-flex justify-content-end mt-4">
              <button
                className="button-white mr-2"
                onClick={() => {
                  this.props.updateStep(0);
                }}
              >
                Prev
              </button>
              <button
                className={`button-primary ${
                  this.state.pending && this._btnFlag === 1 ? "disable" : ""
                }`}
                onClick={this.create}
              >
                Create
              </button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ vendorProfileReducer, loginReducer }) => {
  const { error, user, teams, pending } = vendorProfileReducer;
  return {
    error,
    user,
    teams,
    pending,
  };
};

const AddTeamStepTwoForm = Form.create({ name: "vendor_addteam_steptwo" })(AddStepTwo);

export default connect(mapStateToProps, {
  updateTeams,
})(AddTeamStepTwoForm);
