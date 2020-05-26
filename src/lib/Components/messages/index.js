import React from "react";
import ClientHeader from "@Components/inc/client_header";
import { Footer, Header } from "@Components/inc";
import withStyles from "isomorphic-style-loader/withStyles";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { connect } from "react-redux";
import { fetchContactedUser } from "./essential";
import ChatRoom from "./chatroom";

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actype: this.props.match.params.actype,
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Header/>
        <div className="chat-section">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <ChatRoom />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

export default connect(mapStateToProps, { fetchContactedUser })(
  withStyles(globalStyle, localStyle)(Messages),
);
