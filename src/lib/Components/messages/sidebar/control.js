import React from "react";
import { Button, Icon } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { constants } from "@Shared/constants";
import {} from "../essential";
const ButtonGroup = Button.Group;

class SidebarControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="control">
        <ButtonGroup>
          <Button type="primary" icon="wechat" className="px-3" />
          <Button type="default" icon="contacts" className="px-3" />
        </ButtonGroup>
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

export default connect(mapStateToProps, {})(SidebarControl);
