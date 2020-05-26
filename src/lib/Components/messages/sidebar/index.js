import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import SidebarControl from "./control";
import SidebarSearch from "./search";
import ContactList from "./contactList";
import { constants } from "@Shared/constants";
import {} from "../essential";
import { Badge, Avatar, Input, Select } from "antd";
const { Search } = Input;
const { Option } = Select;
const chatStatusOptions = ["All Recent", "Open Contract", "Closed Contract"];
class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chatStatus: 0,
      searchValue: "",
    };
  }

  handleSelect(index) {
    this.props.selectedChatIndex(index);
  }
  async handleSelectOption(value) {
    await this.setState({
      chatStatus: Number(value),
    });
    await this.sendConditions();
  }
  async handleSearch(e) {
    await this.setState({
      searchValue: e.target.value,
    });
    await this.sendConditions();
  }
  sendConditions() {
    this.props.conditions(this.state.chatStatus, this.state.searchValue);
  }
  userIsSender = (chat) =>
    chat.messages[chat.messages.length - 1].sender === this.props.user.userObj.email;
  render() {
    const generateChatStatusOptions = () => {
      return chatStatusOptions.map((status, index) => {
        return (
          <Option value={String(index)} key={index}>
            {status}
          </Option>
        );
      });
    };
    const UserList = () => {
      if (!this.props.chats) {
        return "";
      }
      return this.props.chats.map((member, index) => {
        const { user } = this.props;
        return (
          <div
            key={index}
            className={`contactitem ${this.props.selectedChat === index ? "selected" : ""}`}
            onClick={() => this.handleSelect(index)}
          >
            <span style={{ marginRight: 24 }}>
              <Badge
                status={
                  member.receiverHadRead === false && !this.userIsSender(member)
                    ? "error"
                    : undefined
                }
              >
                {!member.teamId && (
                  <Avatar>
                    {member.userNames
                      .filter((_user) => _user !== user.userObj.username)[0]
                      .split("")[0]
                      .toUpperCase()}
                  </Avatar>
                )}
                {member.teamId && <Avatar>{"Team".toUpperCase()}</Avatar>}
              </Badge>
            </span>
            {!member.teamId && (
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center">
                  <p style={{ fontWeight: "bolder" }}>
                    {" "}
                    {
                      member.userNames.filter((_user) => _user !== user.userObj.username)[0]
                    }{" "}
                  </p>
                  <small style={{ color: "#9f9c9c" }}>
                    {moment(member.messages[member.messages.length - 1].timeStamp).fromNow()}
                  </small>
                </div>
                <p>{member.jobTitle.substring(0, 20) + "..."}</p>
                <p>
                  {member.service.substring(0, 10) +
                    "/" +
                    member.category.substring(0, 20) +
                    "..."}
                </p>
                <p className="some-text">
                  {member.messages[member.messages.length - 1].message.substring(0, 20) + "..."}
                </p>
              </div>
            )}
            {member.teamId && (
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center">
                  <p style={{ fontWeight: "bolder" }}> {member.userNames.substring(0, 10)} </p>
                  <small style={{ color: "#9f9c9c" }}>
                    {moment(member.messages[member.messages.length - 1].timeStamp).fromNow()}
                  </small>
                </div>
                <p className="some-text">
                  {member.messages[member.messages.length - 1].message.substring(0, 20) + "..."}
                </p>
              </div>
            )}
          </div>
        );
      });
    };

    return (
      <div className="sidebar">
        <SidebarControl />
        <div className="search">
          <Search
            size={"large"}
            value={this.state.searchValue}
            onChange={(e) => {
              this.handleSearch(e);
            }}
            placeholder="Search"
            onSearch={(value) => process.env.NODE_ENV === "development" && console.log(value)}
            className="w-100"
          />
          <div style={{ padding: "5px 0px" }}></div>
          <Select
            value={String(this.state.chatStatus)}
            onChange={(value) => {
              this.handleSelectOption(value);
            }}
          >
            {generateChatStatusOptions()}
          </Select>
        </div>
        <div className="contactlist">{UserList()}</div>
      </div>
    );
  }
}

const mapStateToProps = ({ messagesReducer, loginReducer }) => {
  const { error, success, pending } = messagesReducer;
  const { user } = loginReducer;
  return {
    error,
    success,
    pending,
    user,
  };
};

export default connect(mapStateToProps, {})(Sidebar);
