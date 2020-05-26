import React from "react";
import { Button, Icon } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { constants } from "@Shared/constants";
import {} from "../essential";

class SendBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //user: null,
      value: "",
      rows: 1,
      minRows: 1,
      maxRows: 10,
    };
  }

  handleChange = (event) => {
    const textareaLineHeight = 24;
    const { minRows, maxRows } = this.state;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    this.setState({
      value: event.target.value,
      rows: currentRows < maxRows ? currentRows : maxRows,
    });
  };

  render() {
    return (
      <div className="sendbox">
        <div className="msg-input mr-3">
          <textarea
            rows={this.state.rows}
            value={this.state.value}
            placeholder={"message here..."}
            className={"textarea"}
            onChange={this.handleChange}
          />
          <div className="mt-1">
            <Icon type="paper-clip" style={{ fontSize: "22px", color: "#929292" }} />
          </div>
        </div>
        <button className="button-primary" onClick={this.sendMessage}>
          Send
        </button>
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

export default connect(mapStateToProps, {})(SendBox);
