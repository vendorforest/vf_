import React from "react";
import { connect } from "react-redux";
import { Input, Form, Avatar, Icon, message } from "antd";
import { fetchFindUser, fetchTeamInviteUsers, updateTeam } from "./essential";

class InviteVendors extends React.Component {
  _btnFlag = 0;

  constructor(props) {
    super(props);

    this.state = {
      invitedUsers: [],
      pending: false,
    };
    this.invite = this.invite.bind(this);
    this.addMember = this.addMember.bind(this);
  }

  addMember() {
    this.props.form.validateFields(["email"], async (error, value) => {
      if (!error && !this.state.pending) {
        if (this.props.team.admin.email === value.email) {
          message.warning("You are a administrator of team already");
          return;
        }
        if (this.props.team.members.findIndex((member) => member.email === value.email) > -1) {
          message.warning("This user is a member of team already");
          return;
        }
        this.setState({ pending: true });
        this._btnFlag = 0;
        fetchFindUser({
          email: value.email,
        })
          .then((data) => {
            this.setState({ pending: false });
            if (data) {
              let newInvitedUsers = [...this.state.invitedUsers];
              if (newInvitedUsers.findIndex((user) => user._id === data.data._id) > -1) {
                message.warning("This vendor added already.");
                return;
              }
              newInvitedUsers.push(data.data);
              this.setState({
                invitedUsers: newInvitedUsers,
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
    let newInvitedUsers = [...this.state.invitedUsers];
    newInvitedUsers.splice(index, 1);
    this.setState({
      invitedUsers: newInvitedUsers,
    });
  }

  invite() {
    this.setState({ pending: true });
    this._btnFlag = 1;
    const params = {
      _id: this.props.team._id,
      invitedUsers: this.state.invitedUsers.map((member) => member._id),
    };
    fetchTeamInviteUsers(params)
      .then((data) => {
        this.setState({ pending: false });
        this.props.updateTeam(data.data);
        message.success(data.message);
        this.props.toggle();
      })
      .catch((error) => {
        this.setState({ pending: false });
        message.error(error.message);
      });
  }

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    const generateInvitedUsersList = () => {
      return this.state.invitedUsers.map((user, index) => {
        return (
          <div className="row border-bottom" key={index}>
            <div className="col-md-9 d-flex py-2 align-items-center">
              <Avatar
                src={
                  user.profileImage || "https://semantic-ui.com/images/avatar2/large/kristy.png"
                }
              />
              <div className="ml-3">
                <h6>{user.email}</h6>
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
      <div className="invite-vendor">
        <Form layout="vertical">
          <div className="row">
            <div className="col-md-12">
              <p className="mb-4">Invite members using their (Email Address)</p>
            </div>
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
                className={`button-primary ${
                  this.state.pending && this._btnFlag === 0 ? "disable" : ""
                }`}
                onClick={this.addMember}
              >
                Add Member
              </button>
            </div>
            {this.state.invitedUsers.length > 0 && (
              <div className="col-12">
                <p className="mb-4">Members being invited</p>
                {generateInvitedUsersList()}
              </div>
            )}
            <div className="col-12 controls d-flex justify-content-end mt-4">
              <button
                className={`button-primary ${
                  this.state.pending && this._btnFlag === 1 ? "disable" : ""
                }`}
                onClick={this.invite}
              >
                Invite
              </button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ vendorViewTeamReducer, loginReducer }) => {
  const { error, team, pending } = vendorViewTeamReducer;
  const { user } = loginReducer;
  return {
    error,
    team,
    pending,
    user,
  };
};

const InviteVendorsForm = Form.create({ name: "vendor_addteam" })(InviteVendors);

export default connect(mapStateToProps, {
  updateTeam,
})(InviteVendorsForm);
