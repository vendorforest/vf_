import React from "react";
import { connect } from "react-redux";
import MessageBoxTopbar from "./topbar";
import MessageList from "./messageList";
import SendBox from "./sendBox";
import { Avatar, Icon, Input, message, Upload, Divider } from "antd";
import moment from "moment";

const { TextArea } = Input;
class MessageBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
      fileInfo: null,
      show: false,
      fileList: [
        {
          uid: "-1",
          name: "xxx.png",
          status: "done",
          url: "http://www.baidu.com/xxx.png",
        },
      ],
    };
  }

  componentDidMount = () => {
    const container = document.getElementById("chatList");
    if (container) {
      container.scrollTo(0, container.scrollHeight);
    }
  };

  componentDidUpdate = () => {
    const container = document.getElementById("chatList");
    if (container) {
      container.scrollTo(0, container.scrollHeight);
    }
  };

  handleType = (event) => {
    event.keyCode === 13
      ? this.handleSubmit()
      : this.setState({
          value: event.target.value,
        });
  };

  handleSubmit = () => {
    process.env.NODE_ENV === "development" && console.log("message submitted");
    if ((this.messageValid(this.state.value) || this.state.fileInfo) && this.props.chat) {
      this.props.handleSubmit(this.state.value, this.state.fileInfo);
      // this.props.handleFile(this.state.fileInfo);
      document.getElementById("chat-text-box").value = "";
      this.setState({
        value: null,
        fileInfo: null,
        show: false,
      });
      this.handleRemove();
    } else {
      // message.info("You haven't connected Users to You.");
      document.getElementById("chat-text-box").value = "";
    }
  };
  handleClick = () => this.props.messageRead();

  handleFile = (info) => {
    if (info.file.status === "removed") {
      this.setState({
        fileInfo: null,
      });
    } else {
      let fileList = [...info.fileList];
      this.setState({
        fileInfo: info.file.originFileObj,
        fileList: fileList.slice(-1),
        show: true,
      });
    }
  };
  handleRemove = () => {
    return true;
  };

  messageValid = (txt) => txt && txt.replace(/\s/g, "").length;

  render() {
    const props = {
      name: "file",
    };
    var date = "";
    var displayDate;
    const msgList = () => {
      if (!this.props.chat) {
        return "";
      }
      return this.props.chat.messages.map((msg, index) => {
        const { user, chat } = this.props;
        if (moment(msg.timeStamp).format("LL") !== date) {
          displayDate = true;
          date = moment(msg.timeStamp).format("LL");
        } else {
          displayDate = false;
          date = moment(msg.timeStamp).format("LL");
        }
        var sender = !chat.teamId
          ? msg.sender !== user.userObj.email
            ? chat.userNames.filter((_user) => _user !== user.userObj.username)[0]
            : "Me"
          : `"${chat.userNames}" Team`;
        return (
          <div key={index}>
            {displayDate === true ? (
              <div>
                <hr style={{ marginBottom: "8px" }} />
                <p style={{ paddingLeft: "20px" }}>{moment(msg.timeStamp).format("LL")}</p>
                <hr style={{ marginTop: "8px" }} />
              </div>
            ) : (
              ""
            )}
            <div key={index} className="messageitem">
              <Avatar size={50} style={{ backgroundColor: "#07b107", minWidth: "50px" }}>
                {!chat.teamId ? sender.split("")[0].toUpperCase() : "TEAM"}
              </Avatar>
              <div className="message-content ml-3">
                <p className="mb-2" style={{ fontWeight: "bolder" }}>
                  {sender}
                </p>
                <p className="msg-text mb-2">{msg.message}</p>
                {msg.FileName ? (
                  <p style={{ color: "#07b107" }}>
                    {" "}
                    attach :{" "}
                    <a href={msg.FileUrl} download>
                      {msg.FileName}
                    </a>{" "}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div className="control">
                <p className="time mb-2">{moment(msg.timeStamp).format("LTS")}</p>
                <Icon type="setting" className="setting text-color pointer" />
              </div>
            </div>
          </div>
        );
      });
    };

    return (
      <div className="messagebox">
        {/* <MessageBoxTopbar /> */}
        <div className="messagelist" id="chatList">
          {" "}
          {msgList()}{" "}
        </div>
        <div className="sendbox">
          <div className="msg-input mr-3">
            <textarea
              placeholder={"message here..."}
              className="textarea"
              onKeyUp={(e) => this.handleType(e)}
              // onFocus={this.handleClick}
              id="chat-text-box"
            ></textarea>
          </div>
          <Upload
            {...props}
            onChange={(info) => this.handleFile(info)}
            showUploadList={this.state.show}
            fileList={this.state.fileList}
          >
            <div style={{ marginRight: "15px", marginTop: "15px" }}>
              <Icon type="paper-clip" style={{ fontSize: "30px", color: "#07b107" }} />
            </div>
          </Upload>
          <button
            className="button-primary"
            onClick={this.handleSubmit}
            style={{ marginTop: "1%" }}
          >
            Send
          </button>
        </div>
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

export default connect(mapStateToProps, {})(MessageBox);
