// @ts-nocheck
import React from "react";
import {
  Input,
  Radio,
  Icon,
  List,
  Checkbox,
  Modal,
  Form,
  InputNumber,
  Button,
  DatePicker,
  Rate,
} from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import moment from "moment";
import {Header, Footer} from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

const filterSpaceNeedTypes = [
  "Party / reception space",
  "Dining space",
  "Meeting space",
  "Presentation space",
  "Kitchen",
  "Parking",
];

const filterServiceTypes = [
  "Sound equipment",
  "Video equipment",
  "Microphones",
  "Tables & chairs",
  "Tableware",
  "Lighting",
  "Valet parking",
  "Catering Services",
  "Bar Services",
  "Clean Up",
  "Pet Friendly",
  "Wifi",
];

const filterEventTypes = [
  "Wedding",
  "Corporate Event",
  "Conference / convention",
  "Birthday party",
  "Formal / prom",
  "Fundraiser",
  "Reunion",
  "Shower (baby, bridal, etc.)",
  "Graduation party",
  "Anniversary party",
];

class VenueDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModal: false,
      isSuccessModal: false,
      filterSpaceNeeds: [],
      filterServices: [],
      filterEventType: 0,
      venue: {
        name: "Altamont Manor",
        rate: 5.0,
        reviews: 144,
        service: "Garden Weddings",
        location: "Altamont, NY",
        overview:
          "Altamont Manor, an historic wedding venue in the Albany, New York area, is an 1894 Victorian Manor with elegant indoor and outdoor spaces. Couples can marry...",
        hourlyRate: 100,
        deposit: 100,
      },
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

  componentDidMount() {
    $(document).ready(function() {
      $("#content-slider").lightSlider({
        loop: true,
        keyPress: true,
      });
      $("#image-gallery").lightSlider({
        gallery: true,
        item: 1,
        thumbItem: 9,
        slideMargin: 0,
        speed: 500,
        auto: true,
        loop: true,
        onSliderLoad: function() {
          $("#image-gallery").removeClass("cS-hidden");
        },
      });
    });
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

  render() {
    const generateFilterEventTypeOptions = () => {
      return filterEventTypes.map((eventType, index) => {
        return (
          <Radio
            value={index}
            key={index}
            className={index > 4 && this.state.lessEvent ? "d-none" : "d-block"}
          >
            {eventType}
          </Radio>
        );
      });
    };

    return (
      <div className="venue-details">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-12 shadow p-md-4 p-2">
                <div className="row">
                  <div className="col-md-12 mb-5">
                    <div className="venue-carousel">
                      <ul id="image-gallery" className="gallery list-unstyled cS-hidden">
                        <li data-thumb="/img/thumb/cS-1.jpg">
                          <img src="/img/cS-1.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-2.jpg">
                          <img src="/img/cS-2.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-3.jpg">
                          <img src="/img/cS-3.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-4.jpg">
                          <img src="/img/cS-4.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-5.jpg">
                          <img src="/img/cS-5.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-6.jpg">
                          <img src="/img/cS-6.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-7.jpg">
                          <img src="/img/cS-7.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-8.jpg">
                          <img src="/img/cS-8.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-9.jpg">
                          <img src="/img/cS-9.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-10.jpg">
                          <img src="/img/cS-10.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-11.jpg">
                          <img src="/img/cS-11.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-12.jpg">
                          <img src="/img/cS-12.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-13.jpg">
                          <img src="/img/cS-13.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-14.jpg">
                          <img src="/img/cS-14.jpg" />
                        </li>
                        <li data-thumb="/img/thumb/cS-15.jpg">
                          <img src="/img/cS-15.jpg" />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="d-flex justify-content-between">
                      <h4>{this.state.venue.name}</h4>
                      <h5 className="text-color">$ {this.state.venue.hourlyRate}/hr</h5>
                    </div>
                    <div className="mb-3">
                      <span className="mr-2">{this.state.venue.rate}</span>
                      <Rate disabled defaultValue={this.state.venue.rate} />
                      <span className="mx-2">{this.state.venue.reviews} Reviews</span>
                      <span className="text-color mx-2">{this.state.venue.service}</span>
                      <span className="text-grey">{this.state.venue.location}</span>
                    </div>
                    <p className="mb-3">
                      Altamont Manor, an historic wedding venue in the Albany, New York area, is
                      an 1894 Victorian Manor with elegant indoor and outdoor spaces. Couples
                      can marry among lush gardens and antique accents. Facilities and Capacity
                      The venue hosts up to 150 guests in its indoor and outdoor spaces. Couples
                      can... (Garden Weddings Altamont)
                    </p>
                    <div className="mb-3">
                      <h5>
                        Settings: <span className="h6 mr-3">Indoor</span>Maximum Capacity:{" "}
                        <span className="h6">101 - 150</span>
                      </h5>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5 className="mb-2">Space Has:</h5>
                    <CheckboxGroup
                      value={this.state.filterSpaceNeeds}
                      options={filterSpaceNeedTypes}
                      onChange={(checkList) => {
                        this.setState({
                          filterSpaceNeeds: checkList,
                        });
                      }}
                    />
                    <h5 className="mt-3 mb-2">Service and equipment needs :</h5>
                    <CheckboxGroup
                      value={this.state.filterServices}
                      options={filterServiceTypes}
                      onChange={(checkList) => {
                        this.setState({
                          filterServices: checkList,
                        });
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <h5 className="mb-2">Event Type</h5>
                    <Radio.Group
                      onChange={(e) => {
                        this.setState({
                          filterEventType: e.target.value,
                        });
                      }}
                      value={this.state.filterEventType}
                    >
                      {generateFilterEventTypeOptions()}
                    </Radio.Group>
                  </div>
                  <div className="col-md-12">
                    <div className="d-md-flex d-block align-items-center">
                      <h5 className="mr-auto py-2">Deposit: $100</h5>
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
                </div>
              </div>
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
        <Footer />
      </div>
    );
  }
}

export default withStyles(globalStyle, localStyle)(VenueDetails);
