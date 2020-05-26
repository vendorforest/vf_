// @ts-nocheck
import React from "react";
import { Button, Icon, Rate, Modal, Form, Input, DatePicker, InputNumber } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class VenueItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModal: false,
      isSuccessModal: false,
      fullName: "",
      email: "",
      phoneNumber: "",
      eventStDate: moment(),
      eventEtDate: moment().add(5, "days"),
      guestNumber: 1,
      message: "",
    };
    this.toggle = this.toggle.bind(this);
    this.toggleSuccessModal = this.toggleSuccessModal.bind(this);
  }

  toggle() {
    this.setState({
      isModal: !this.state.isModal,
    });
  }

  toggleSuccessModal() {
    this.setState({
      isSuccessModal: !this.state.isSuccessModal,
    });
  }

  displaySkills() {
    if (this.props.job.skills.length === 0) {
      return "";
    }
    let skills = this.props.job.skills[0];
    this.props.job.skills.splice(0, 1).forEach((skill) => {
      skills += ` / ${skill}`;
    });
    return skills;
  }

  render() {
    return (
      <div className="venue-item ">
        <div className="venue-photo mr-3">
          <img
            src="https://via.placeholder.com/165"
            className="mb-md-0 mb-2"
            alt="venue-photo"
          />
        </div>
        <div className="venue-summary">
          <div className="d-flex justify-content-between">
            <h5
              className="venue-name"
              onClick={() => {
                window.location.href = "";
              }}
            >
              {this.props.venue.name}
            </h5>
            <h6>${this.props.venue.hourlyRate}/hr</h6>
          </div>
          <div className="color-gray">
            <span className="mr-2">{this.props.venue.rate}</span>
            <Rate disabled defaultValue={this.props.venue.rate} />
            <span className="mx-2">{this.props.venue.reviews} Reviews</span>
            <span className="text-color">{this.props.venue.service}</span>
          </div>
          <p className="color-gray mb-1">
            <Icon type="global" />
            <span className="ml-1">{this.props.venue.location}</span>
          </p>
          <p>{this.props.venue.overview}</p>
          <div className="d-md-flex d-block align-items-center">
            <h6 className="mr-auto py-2">Deposit: $100</h6>
            <div className="d-flex justify-content-end mt-2">
              <button className="button-white mr-2">
                <Icon type="heart" />
                <span className="ml-2">Save</span>
              </button>
              <button className="button-primary" onClick={this.toggle}>
                Send Request
              </button>
            </div>
          </div>
        </div>
        <Modal
          title="Send message to Altamont Manor"
          visible={this.state.isModal}
          onOk={this.toggle}
          onCancel={this.toggle}
          width={"650px"}
          footer={
            <Button
              key="next"
              type="primary"
              onClick={() => {
                this.toggle();
                this.toggleSuccessModal();
              }}
              style={{ width: "100px" }}
            >
              Send
            </Button>
          }
        >
          <div className="container vendor-sendrequest">
            <div className="row">
              <div className="col-md-12">
                <p className="mb-4">
                  Fill out the form below to request information from Altamont Manor
                </p>
                <Form.Item label="First and Last Name">
                  <Input
                    placeholder="First and Last Name"
                    value={this.state.fullName}
                    onChange={(e) => {
                      this.setState({
                        fullName: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item label="Email">
                  <Input
                    placeholder="Email"
                    value={this.state.email}
                    onChange={(e) => {
                      this.setState({
                        email: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item label="Phone Number">
                  <Input
                    placeholder="Phone Number"
                    value={this.state.phoneNumber}
                    onChange={(e) => {
                      this.setState({
                        phoneNumber: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item label="Event Start Date ~ End Date">
                  <RangePicker
                    placeholder="Event Start Date ~ End Date"
                    value={[this.state.eventStDate, this.state.eventEtDate]}
                    onChange={(date, dateString) => {
                      process.env.NODE_ENV === "development" && console.log(date, dateString);
                    }}
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item label="Number of Guests">
                  <InputNumber
                    placeholder="Number of Guests"
                    value={this.state.guestNumber}
                    onChange={(e) => {
                      this.setState({
                        guestNumber: e.target.value,
                      });
                    }}
                    className="w-100"
                  />
                </Form.Item>
              </div>
              <div className="col-md-12">
                <Form.Item label="Message">
                  <TextArea
                    placeholder="Message"
                    value={this.state.message}
                    onChange={(e) => {
                      this.setState({
                        message: e.target.value,
                      });
                    }}
                    className="w-100"
                    rows={5}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          title="Send message to Altamont Manor"
          visible={this.state.isSuccessModal}
          onOk={this.toggleSuccessModal}
          onCancel={this.toggleSuccessModal}
          width={"650px"}
          footer={
            <Button
              key="next"
              type="primary"
              onClick={this.toggleSuccessModal}
              style={{ width: "100px" }}
            >
              Ok
            </Button>
          }
        >
          <div className="container vendor-sendrequest">
            <div className="row">
              <div className="col-md-12 text-center">
                <Icon type="check-circle" className="text-color h1" />
                <p>
                  Thank you! Your Request was succesfully sent to Altamont Manor. You will be
                  notified in your email and your account once Altamont Manor respond to you
                </p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default VenueItem;
