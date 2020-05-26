import React from "react";
import { Avatar, Icon } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { constants } from "@Shared/constants";
import {} from "../essential";

class MessageItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: null,
    };
  }

  componentDidMount() {
    const userName = this.props.user.userObj.username;
    this.setState({
      userName: userName,
    });
  }

  render() {
    const msgList = () => {
      if (!this.props.oldMsg) {
        return "";
      }
      return this.props.oldMsg.map((msg, index) => {
        return (
          <div key={index} className="messageitem">
            <Avatar
              size={50}
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              style={{ backgroundColor: "#cdcdcd", minWidth: "50px" }}
            />
            <div className="message-content ml-3">
              <p className="mb-2" style={{ fontWeight: "normal" }}>
                {msg.user}
              </p>
              <p className="msg-text">{msg.msg}</p>
            </div>
            <div className="control">
              <p className="time mb-2">{msg.time}</p>
              <Icon type="setting" className="setting text-color pointer" />
            </div>
          </div>
        );
      });
    };
    return <div>{msgList()}</div>;
  }
}

const mapStateToProps = ({ messagesReducer, loginReducer }) => {
  const { error, success, pending, oldMsg } = messagesReducer;
  const { user } = loginReducer;
  return {
    error,
    success,
    pending,
    user,
    oldMsg,
  };
};

export default connect(mapStateToProps, {})(MessageItem);
