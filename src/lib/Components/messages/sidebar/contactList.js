import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import ContactItem from "./contactItem";
import { constants } from "@Shared/constants";
import {} from "../essential";

class ContactList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="contactlist">
        <ContactItem />
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

export default connect(mapStateToProps, {})(ContactList);
