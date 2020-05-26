import React from "react";
import { Button, Icon } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import MessageItem from "./messageItem";
import { constants } from "@Shared/constants";
import {} from "../essential";

class MessageList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className="messagelist"></div>;
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

export default connect(mapStateToProps, {})(MessageList);
