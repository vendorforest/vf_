import React from "react";
import { Button, Input, Select } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { constants } from "@Shared/constants";
import {} from "../essential";
const { Search } = Input;
const ButtonGroup = Button.Group;

class SidebarSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="search">
        <Search
          size={"large"}
          placeholder="Search"
          onSearch={(value) => process.env.NODE_ENV === "development" && console.log(value)}
          className="w-100"
        />
        <div style={{ padding: "5px 0px" }}></div>
        <Select defaultValue="0">
          <option value="0"> All Recent </option>
          {/* <option value="1"> Unread </option> */}
          <option value="1"> Open Contract </option>
          <option value="2"> Closed Contract </option>
        </Select>
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

export default connect(mapStateToProps, {})(SidebarSearch);
