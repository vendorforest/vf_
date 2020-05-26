import React from "react";
import { Avatar, Badge } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { constants } from "@Shared/constants";
import { fetchContactedUser, fetchOldMsg } from "../essential";

class ContactItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      accountType: null,
    };
    this.handleClick = (ev) => {
      ev.preventDefault();
      const clientID = ev.currentTarget.id;
      this.props.fetchOldMsg(clientID);
    };
  }

  componentDidMount() {
    const userAccountType = this.props.user.userObj.accountType;
    this.setState({
      accountType: userAccountType,
    });
    process.env.NODE_ENV === "development" && console.log("********did mount*********");
    this.props.fetchContactedUser();
  }

  render() {
    const UserList = () => {
      if (!this.props.connectedUser) {
        return "";
      }
      return this.props.connectedUser.map((member, index) => {
        const { user } = this.props;
        process.env.NODE_ENV === "development" &&
          console.log(
            "ddddddddddd",
            member.user,
            "sdsds",
            member.roomName,
            "uwrtypefds",
            user.userObj.accoutType,
          );
        return (
          <div
            key={index}
            className="contactitem"
            id={this.state.accountType == 0 ? member.roomName : member.user}
            onClick={this.handleClick}
          >
            <span style={{ marginRight: 24 }}>
              <Badge count={1}>
                <Avatar
                  size={50}
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  style={{ backgroundColor: "#cdcdcd" }}
                />
              </Badge>
            </span>
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-center">
                <p style={{ fontWeight: "normal" }}>
                  {" "}
                  {this.state.accountType == 0 ? member.roomName : member.user}{" "}
                </p>
                <small style={{ color: "#9f9c9c" }}>2019 11/25</small>
              </div>
              <p className="some-text">...........</p>
            </div>
          </div>
        );
      });
    };

    return <div>{UserList()}</div>;
  }
}

const mapStateToProps = ({ messagesReducer, loginReducer }) => {
  const { error, success, pending, connectedUser } = messagesReducer;
  const { user } = loginReducer;
  return {
    error,
    success,
    pending,
    connectedUser,
    user,
  };
};

export default connect(mapStateToProps, { fetchContactedUser, fetchOldMsg })(ContactItem);
