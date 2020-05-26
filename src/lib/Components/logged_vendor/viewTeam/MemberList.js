import React from "react";
import { connect } from "react-redux";
import VendorMemberItem from "./MemberItem";
import InvitedVendorItem from "./InvitedVendorItem";
import InviteVendors from "./InviteVendors";
import { Input, Card, List, Divider, Icon, Modal } from "antd";
const { Search } = Input;

class VendorMemberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModal: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isModal: !this.state.isModal,
      currentStep: 0,
    });
  }

  isAdmin() {
    return this.props.team.admin._id === this.props.user.userObj._id;
  }

  isInviatedUser() {
    return (
      this.props.team.invitedUsers.findIndex(
        (user) => user._id === this.props.user.userObj._id,
      ) > -1
    );
  }

  render() {
    return (
      <div>
        <Card
          title={<span className="h5 font-weight-bold">{this.props.team.name}</span>}
          className="shadow mb-5"
          extra={
            this.isAdmin() && (
              <span>
                {
                  <a
                    className="text-blue pointer"
                    onClick={() => {
                      this.toggle();
                    }}
                  >
                    <Icon type="user" className="mr-1" />
                    Invite
                  </a>
                }
                <Divider type="vertical" />
                <a
                  className="text-color pointer"
                  onClick={() => {
                    window.location.href = "/messages/v";
                  }}
                >
                  <Icon type="wechat" className="mr-1" />
                  Chat
                </a>
              </span>
            )
          }
        >
          <div className="row">
            <div className="col-md-12">
              <h6 className=" font-weight-bold">Members</h6>
              <List
                itemLayout="vertical"
                size="large"
                className="member-list"
                pagination={{
                  onChange: (page) => {
                    process.env.NODE_ENV === "development" && console.log(page);
                  },
                  pageSize: 20,
                }}
                dataSource={[this.props.team.admin, ...this.props.team.members]}
                footer={<div></div>}
                renderItem={(item, index) => (
                  <List.Item key={index} style={{ cursor: "pointer" }}>
                    <VendorMemberItem member={item} team={this.props.team} />
                  </List.Item>
                )}
              />
            </div>
            {this.props.team.invitedUsers &&
              this.props.team.invitedUsers.length > 0 &&
              (this.isAdmin() || this.isInviatedUser()) && (
                <div className="col-md-12 mt-3">
                  <h6 className=" font-weight-bold">Invited Vendors</h6>
                  <List
                    itemLayout="vertical"
                    size="large"
                    className="member-list"
                    pagination={{
                      onChange: (page) => {
                        process.env.NODE_ENV === "development" && console.log(page);
                      },
                      pageSize: 20,
                    }}
                    dataSource={[...(this.props.team.invitedUsers || [])]}
                    footer={<div></div>}
                    renderItem={(item, index) => (
                      <List.Item key={index} style={{ cursor: "pointer" }}>
                        <InvitedVendorItem member={item} team={this.props.team} />
                      </List.Item>
                    )}
                  />
                </div>
              )}
          </div>
        </Card>
        <Modal
          title={<span className="h6 font-weight-bold">Invite Members</span>}
          visible={this.state.isModal}
          width={"650px"}
          footer={[null, null]}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <InviteVendors team={this.props.team} toggle={this.toggle} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ vendorViewTeamReducer, loginReducer }) => {
  const { error, success, pending } = vendorViewTeamReducer;

  const { user } = loginReducer;

  return {
    error,
    success,
    pending,
    user,
  };
};

export default connect(mapStateToProps, {})(VendorMemberList);
