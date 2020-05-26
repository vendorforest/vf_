import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { constants } from "@Shared/constants";
import Sidebar from "./sidebar/index";
import MessageBox from "./messageBox/index";
import { async } from "q";
const firebase = require("firebase/app");
// const storage = firebase.storage();

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allChats: [],
      cookieChats: [],
      selectedChat: 0,
      email: null,
    };
  }
  componentDidMount() {
    firebase
      .firestore()
      .collection("chats")
      .where("users", "array-contains", this.props.user.userObj.email)
      .orderBy("createdAt", "desc")
      .onSnapshot(async (result) => {
        const chats = result.docs.map((_doc) => _doc.data());
        await this.setState({
          allChats: chats,
          cookieChats: chats,
          email: this.props.user.userObj.email,
        });
      });
  }

  buildDocKey = (friend) => [this.state.email, friend].sort().join(":");

  selectChat = async (chatIndex) => {
    await this.setState({
      selectedChat: chatIndex,
    });
    this.messageRead();
  };

  selectConditions = async (status, search) => {
    var searchResult = [];
    if (status === 0 && search !== "") {
      this.state.cookieChats.map((chat, index) => {
        for (var i = 0; i < 2; i++) {
          if (chat.userNames[i].match(new RegExp("\\b" + search)) !== null) {
            searchResult.push(chat);
          }
        }
      });
    }
    if (status !== 0 && search !== "") {
      this.state.cookieChats.map((chat, index) => {
        if (chat.contract === status - 1) {
          for (var i = 0; i < 2; i++) {
            if (chat.userNames[i].match(new RegExp("\\b" + search)) !== null) {
              searchResult.push(chat);
            }
          }
        }
      });
    }
    if (status !== 0 && search === "") {
      this.state.cookieChats.map((chat, index) => {
        if (chat.contract === status - 1) {
          searchResult.push(chat);
        }
      });
    }
    if (status === 0 && search === "") {
      this.state.cookieChats.map((chat, index) => {
        searchResult.push(chat);
      });
    }
    await this.setState({
      allChats: searchResult,
    });
  };

  submitMessage = async (msg, fileInfo) => {
    const chatIndex = this.state.selectedChat;
    const members = this.state.allChats[chatIndex].users.sort().join(":");
    const docKey = !this.state.allChats[chatIndex].teamId
      ? this.buildDocKey(
          this.state.allChats[chatIndex].users.filter((_user) => _user !== this.state.email)[0],
        )
      : members;
    if (fileInfo) {
      if (!msg) {
        msg = "attached file";
      }
      var filePath = "images/" + fileInfo.uid + "/" + fileInfo.name;
      await firebase
        .storage()
        .ref(filePath)
        .put(fileInfo)
        .then(async (fileSnapshot) => {
          await fileSnapshot.ref
            .getDownloadURL()
            .then(async (url) => {
              this.setState({
                selectedChat: 0,
              });
              await firebase
                .firestore()
                .collection("chats")
                .doc(docKey)
                .update({
                  messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: this.state.email,
                    message: msg,
                    timeStamp: Date.now(),
                    FileUrl: url,
                    storageUri: fileSnapshot.metadata.fullPath,
                    FileName: fileInfo.name,
                  }),
                  receiverHadRead: false,
                  createdAt: Date.now(),
                })
                .catch((err) => process.env.NODE_ENV === "development" && console.log(err));
            })
            .catch((err) => process.env.NODE_ENV === "development" && console.log(err));
        })
        .catch((err) => process.env.NODE_ENV === "development" && console.log(err));
    }
    if (!fileInfo) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({
          messages: firebase.firestore.FieldValue.arrayUnion({
            sender: this.state.email,
            message: msg,
            timeStamp: Date.now(),
          }),
          receiverHadRead: false,
          createdAt: Date.now(),
        });
      this.setState({
        selectedChat: 0,
      });
    }
  };

  messageRead = () => {
    const chatIndex = this.state.selectedChat;
    const members = this.state.allChats[chatIndex].users.sort().join(":");
    const docKey = !this.state.allChats[chatIndex].teamId
      ? this.buildDocKey(
          this.state.allChats[chatIndex].users.filter((_user) => _user !== this.state.email)[0],
        )
      : members;
    if (this.clickedChat(chatIndex)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHadRead: true });
    } else {
      process.env.NODE_ENV === "development" &&
        console.log("Clicked message where user is sender");
    }
  };

  clickedChat = (chatIndex) =>
    this.state.allChats[chatIndex].messages[this.state.allChats[chatIndex].messages.length - 1]
      .sender !== this.state.email;

  render() {
    return (
      <div id="chat-room">
        <Sidebar
          chats={this.state.allChats}
          selectedChatIndex={this.selectChat}
          selectedChat={this.state.selectedChat}
          conditions={this.selectConditions}
        />
        <MessageBox
          chat={this.state.allChats[this.state.selectedChat]}
          handleSubmit={this.submitMessage}
          // handleFile={this.handleFile}
          messageRead={this.messageRead}
        />
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

export default connect(mapStateToProps, {})(ChatRoom);
