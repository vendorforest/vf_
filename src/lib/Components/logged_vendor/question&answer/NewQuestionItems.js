import React from "react";
import { Button, Icon, Avatar, Rate, Progress, message, Modal, Radio } from "antd";
import { constants } from "@Shared/constants";
import { fetchRespond } from "./essential";
import { connect } from "react-redux";

class VendorItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      answer: 0,
    };
    this.handleAnswer = this.handleAnswer.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleRespond = this.handleRespond.bind(this);
  }

  handleAnswer() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  toggle() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  handleRespond() {
    this.setState({
      visible: !this.state.visible,
    });
    const params = {
      status: 0,
      _id: this.props.newQuestion._id,
      answer: this.state.answer,
    };
    fetchRespond(params)
      .then((result) => {
        message.success(result.message);
        window.location.reload();
      })
      .catch((error) => {
        message.warning(error.message);
      });
  }
  render() {
    return (
      <div className="propposal-item ">
        {this.props.newQuestion && (
          <div className="row">
            <div className="col-lg-12 vendor-profile-content d-flex">
              <h5>{this.props.newQuestion.client.username}</h5>
            </div>
            <div className="col-lg-12 vendor-rate">
              <p>"{this.props.newQuestion.question}"</p>
            </div>
            <div className="col-lg-12 vendor-rate" style={{ textAlign: "right" }}>
              <Button type="primary" onClick={this.handleAnswer}>
                Answer
              </Button>
            </div>
          </div>
        )}
        {/* <hr /> */}
        <Modal
          title={`Answer`}
          visible={this.state.visible}
          // onOk={this.toggle}
          onCancel={this.toggle}
          width={"50%"}
          footer={
            <Button
              key="next"
              type="primary"
              onClick={this.handleRespond}
              style={{ width: "120px" }}
            >
              Respond
            </Button>
          }
        >
          <div className="message mb-6"></div>
          <div className="message mb-6">
            <h5>Question</h5>
          </div>
          <div className="message mb-6" style={{ marginTop: "10px" }}>
            client: {this.props.newQuestion.client.username}
          </div>
          <div className="message mb-6" style={{ marginBottom: "10px" }}>
            <p>"{this.props.newQuestion.question}"</p>
          </div>
          <div className="message mb-6">
            <h5>Answer</h5>
          </div>
          <div className="message mb-6" style={{ marginTop: "10px" }}>
            NOTE: Please undersand that you can only with a YES or NO, security reasons.
          </div>
          <div className="message mb-6" style={{ marginTop: "8px" }}>
            <Radio.Group
              onChange={(e) => {
                this.setState({
                  answer: e.target.value,
                });
              }}
              value={this.state.answer}
            >
              <Radio value={0} className="d-block" defaultChecked>
                Yes
              </Radio>
              <Radio value={1} className="d-block">
                No
              </Radio>
            </Radio.Group>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ loginReducer }) => {
  const { user } = loginReducer;
  return { user };
};

export default connect(mapStateToProps, {
  fetchRespond,
})(VendorItem);
