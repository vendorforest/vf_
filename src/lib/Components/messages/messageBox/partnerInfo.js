import React from "react";
import { Button, Icon } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { constants } from "@Shared/constants";
import {} from "../essential";
const ButtonGroup = Button.Group;

class PartnerInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="partner-info">
        <h4>Andrew Owen</h4>
        <p style={{ color: "#9f9c9c" }}>
          NewYork/US <small>(12:34 AM)</small>
        </p>
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

export default connect(mapStateToProps, {})(PartnerInfo);
